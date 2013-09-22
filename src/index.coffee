$ ->


  ###
  # svg 
  ###
  raphael = (id) -> Raphael(id, $("#" + id).width(), $("#" + id).height());
  window.papers = 
    triadWheel:　raphael("triad_wheel_svg")
    hexardWheel: raphael("hexard_wheel_svg")
    colorWheel: raphael("color_wheel_svg")

  ###
  # Initialize
  ###
  ColorControls.init()

###
Controls
###
class ColorControls
  @$imageColor = $("#base_color_selector .image-color");
  ###
  must be called on document.onload
  ###
  @init = ->
    # input support
    $("#base_color_hex").focus ->
      $("#type_hex").click()  # HACK

    $("#base_color_r, #base_color_g, #base_color_b").focus ->
      $("#type_rgb").click()  # HACK

    $("#base_color_h, #base_color_s, #base_color_v").focus ->
      $("#type_hsv").click()  # HACK

    # ex) 270 -> 14
    $("#color_controls .base_color_255").change ->
      val = ('' + $(@).val()).toFloatOrZero() % 256;
      $(@).val(val);

    # ex) 370 -> 10
    $("#color_controls .base_color_359").change ->
      val = ('' + $(@).val()).toFloatOrZero() % 360;
      $(@).val(val);

    # HACK!!!!!
    $("#base_color_hex").change ->
      @setColor $(@).val()

    $("#base_color_r, #base_color_g, #base_color_b").change =>
      @setColor 
        r: $("#base_color_r").val()
        g: $("#base_color_g").val()
        b: $("#base_color_b").val()

    $("#base_color_h, #base_color_s, #base_color_v").change =>
      @setColor 
        r: $("#base_color_h").val()
        g: $("#base_color_s").val()
        b: $("#base_color_v").val()

    #color Piker
    $("#base_color_selector").ColorPicker(
      color: @$imageColor.css('background-color')
      onShow: (colpkr) => 
        $(colpkr).fadeIn 500
        false
      onHide: (colpkr) =>
        $(colpkr).fadeOut 500
        false
      onChange: (hsb, hex, rgb) =>
        @setColor rgb
    )

    $("#execute").click (ev) =>
      @execute()
      false
  ###
  get origin color from inputs
  ###
  @getColor = ->
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
  update all
  ###
  @setColor = (val) ->
    color = if(val.h? && val.s? && val.v?)
      princessJs.Color.createFromHSV(val)
    else if(val.r? && val.g? && val.b?)
      princessJs.Color.createFromRGB(val)
    else 
      princessJs.Color.createFromHexCode(val)
    
    rgb = color.toRGB()
    hsv = color.toHSV()
    hexCode = color.toCssHexCode()
    @$imageColor.ColorPickerSetColor rgb
    @$imageColor.css('background-color', hexCode)
    # hex
    $("#base_color_hex").val hexCode
    # rgb
    $("#base_color_r").val rgb.r
    $("#base_color_g").val rgb.g
    $("#base_color_b").val rgb.b

    #hsv
    $("#base_color_h").val hsv.h
    $("#base_color_s").val hsv.s
    $("#base_color_v").val hsv.v

    if($("#auto_calc").checked())
      @execute()
    @

  ###
  calcurate and render
  ###
  @execute = ->
    origin = ColorControls.getColor()
    Complementary.render(origin)
    drawTriad(origin)
    drawHexard(origin)
    Analogous.render(origin)
    draw12ColorWheel(origin)
###
#
###
class Complementary
  gradationRate = 20 # FIX

  @base = (origin) -> origin.addHue 180
  @colors = (base) ->
    [-3..3].map (i) ->
      base.addSaturation i * gradationRate

  @render = (origin) ->
    base = @base(origin)
    originHexCode = origin.toCssHexCode()
    html = @colors.compose(@base)(origin).map (color) ->
      colorHexCode = color.toCssHexCode()
      "<div class='col-lg-6 color-compare' style='background-color:#{originHexCode};color:#{colorHexCode};'>
        #{originHexCode}
      </div>
      <div class='col-lg-6 color-compare'style='background-color:#{colorHexCode};color:#{originHexCode};'>
        #{colorHexCode}
      </div>" # TODO:
    $("#complementary .chart").html html

###
# Analogous Block
###
class Analogous
  @colors = (origin) -> 
    [-3..3].map (i) ->
      origin.addHue i * 10

  @render = (origin) ->
    originHexCode = origin.toCssHexCode()
    complementaryColorCode = origin.addHue(180).toCssHexCode()
    html = @colors(origin).map (color) ->
      colorHexCode = color.toCssHexCode()
      "<div class='col-lg-6 color-compare' style='background-color:#{originHexCode};color:#{complementaryColorCode}'>
        #{originHexCode}
      </div>
      <div class='col-lg-6 color-compare'style='background-color:#{colorHexCode};color:#{complementaryColorCode}'>
        #{colorHexCode}
      </div>" # TODO:
    $("#analogous .chart").html html

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
  colors.forEach (color, i) ->
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
