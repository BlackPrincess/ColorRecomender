###
input support
###
$ ->
  $("#base_color_hex").focus ->
    $("#type_hex").click()  # HACK

  $("#base_color_r").focus ->
    $("#type_rgb").click()  # HACK

  $("#base_color_h").focus ->
    $("#type_hsv").click()  # HACK

  # ex) 270 -> 14
  $(".base_color_255").change ->
    val = ('' + $(@).val()).toFloatOrZero() % 256;
    $(@).val(val);

  # ex) 370 -> 10
  $(".base_color_359").change ->
    val = ('' + $(@).val()).toFloatOrZero() % 360;
    $(@).val(val);

###
# draw color whell
###
window.drawColorWheel = (paper, colors) -> 
  paper.clear()
  center = 
    x: paper.width / 2
    y: paper.height / 2
  # Radian
  diffRad = 360 / colors.length
  for color, i in colors
    start = (90 - diffRad / 2) + i * diffRad
    end = start + diffRad
    animationMs = 
      'txt':100
      'circle':1000
    # draw color code text
    txt = paper.text(center.x, center.y, 
      color.toCssHexCode()).attr(
        'font-size': "20px"
        'fill': "#899299"
        'opacity': 0)
    # draw sector circle
    paper.circleSector(center.x, center.y, 
      paper.width * 2 / 5, start, end)
      .attr(
        'fill':color.toCssHexCode()
        'stroke-width':0)
      .mouseover -> 
        transform = 'transform' : "s1.1 1.1 " + center.x + " " + center.y
        @.stop().animate(
          transform, 
          animationMs.circle, "elastic")
        # HACK
        txt.toFront()
        txt.stop().animate(opacity:1, animationMs.txt, "elastic")
      .mouseout -> 
        @.stop().animate(transform:"", animationMs.circle, "elastic")
        txt.stop().animate(opacity:0, animationMs.txt, "elastic")
      
  # end for
  paper.circle(center.x, center.y, paper.width / 3)
    .attr(
      'fill':"#ffffff"
      'stroke-width':0)