$ ->
  ###
  input support
  ###
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
  event ?
  ###
  $("#execute").click (ev) ->
    resultRender()
    false

  ###
  # svg 
  ###
  raphael = (id) -> Raphael(id, $("#" + id).width(), $("#" + id).height());
  window.papers = 
    triadWheel:　raphael("triad_wheel_svg")
    hexardWheel: raphael("hexard_wheel_svg")
    colorWheel: raphael("color_wheel_svg")

###
# render all blocks
###
resultRender = ->
  origin = getOriginColor()
  Complementary.render(origin)
  drawTriad(origin)
  drawHexard(origin)
  Analogous.render(origin)
  draw12ColorWheel(origin)

###
# get origin color from inputs
###
getOriginColor = ->
  type = $("input[name=type]:checked").val().toLowerCase()
  switch type
    when "hex"
      princessJs.Color.createFromHexCode($("#base_color_hex").val())
    when "rgb"
      princessJs.Color.create(
        $("#base_color_r").val().toInt()
        $("#base_color_g").val().toInt()
        $("#base_color_b").val().toInt())
    when "hsv"
      princessJs.Color.createFromHSV(
        $("#base_color_h").val().toInt()
        $("#base_color_s").val().toInt() 
        $("#base_color_v").val().toInt())
###
#
###
class Complementary
  @base = (origin) -> origin.addHue 180
  gradationRate = -20

  @render = (origin) ->
    base = @base(origin)
    originHexCode = origin.toCssHexCode()
    $("#complementary .origin").css("background-color", originHexCode);
    $("#complementary .origin").text(originHexCode);
    
    $("#complementary .origin").each (index) ->
      complementaryHexCode = base.addSaturation(gradationRate * index).toCssHexCode()
      $(this).css("color", complementaryHexCode)
      $(this).text(complementaryHexCode)

    $("#complementary .complementary").css("color", originHexCode);
    $("#complementary .complementary").each (index) -> 
      complementaryHexCode = base.addSaturation(gradationRate * index).toCssHexCode()
      $(this).css("background-color", complementaryHexCode)
      $(this).text(complementaryHexCode)
    

###
# Analogous Block
###
class Analogous
  @colors = (origin) -> 
    [-3..3].map (i) ->
      origin.addHue i * 10

  @render = (origin) ->
    $("#analogous .origin").css("background-color", origin.toCssHexCode())
    $("#analogous .origin").text(origin.toCssHexCode())
    @colors(origin).zip($("#analogous").find(".analogous"))
      .forEach (a) ->
        color = a[0]
        $analogous = $(a[1])
        $analogous.css("background-color", color.toCssHexCode())
        $analogous.text(color.toCssHexCode())
    


###
# draw Triad color wheel
###
drawTriad = (origin) ->
  colors = [0..2].map (i) -> 
    origin.addHue i * 120
  drawColorWheel(papers.triadWheel, colors)

###
# draw Hexard color wheel
###
drawHexard = (origin) ->
  colors = [0..5].map (i) -> 
    origin.addHue i * 60
  drawColorWheel(papers.hexardWheel, colors)

###
# draw color wheel
###
draw12ColorWheel = (origin) ->
  colors = [0..11].map (i) ->
    origin.addHue i * 30
  drawColorWheel(papers.colorWheel, colors)
  
###
# draw color wheel
###
drawColorWheel = (paper, colors) -> 
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

###############################
# Raphael
###############################
window.RADIAN = Math.PI / 180;
window.Raphael.fn.circleSector = (cx, cy, r, startAngle, endAngle) ->
  x1 = cx + r * Math.cos(-startAngle * RADIAN)
  x2 = cx + r * Math.cos(-endAngle * RADIAN)
  y1 = cy + r * Math.sin(-startAngle * RADIAN)
  y2 = cy + r * Math.sin(-endAngle * RADIAN)
  this.path ["M", cx, cy
    "L", x1, y1
    "A", r, r
    0, +(endAngle - startAngle > 180), 0
    x2, y2, "z"]
