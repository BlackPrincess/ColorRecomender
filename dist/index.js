(function() {
  var Analogous, Complementary, draw12ColorWheel, drawColorWheel, drawHexard, drawTriad, getOriginColor, resultRender;

  $(function() {
    /*
    input support
    */

    var raphael;
    $("#base_color_hex").focus(function() {
      return $("#type_hex").click();
    });
    $("#base_color_r").focus(function() {
      return $("#type_rgb").click();
    });
    $("#base_color_h").focus(function() {
      return $("#type_hsv").click();
    });
    $(".base_color_255").change(function() {
      var val;
      val = ('' + $(this).val()).toFloatOrZero() % 256;
      return $(this).val(val);
    });
    $(".base_color_359").change(function() {
      var val;
      val = ('' + $(this).val()).toFloatOrZero() % 360;
      return $(this).val(val);
    });
    /*
    event ?
    */

    $("#execute").click(function(ev) {
      resultRender();
      return false;
    });
    /*
    # svg
    */

    raphael = function(id) {
      return Raphael(id, $("#" + id).width(), $("#" + id).height());
    };
    return window.papers = {
      triadWheel: 　raphael("triad_wheel_svg"),
      hexardWheel: raphael("hexard_wheel_svg"),
      colorWheel: raphael("color_wheel_svg")
    };
  });

  /*
  # render all blocks
  */


  resultRender = function() {
    var origin;
    origin = getOriginColor();
    Complementary.render(origin);
    drawTriad(origin);
    drawHexard(origin);
    Analogous.render(origin);
    return draw12ColorWheel(origin);
  };

  /*
  # get origin color from inputs
  */


  getOriginColor = function() {
    var type;
    type = $("input[name=type]:checked").val().toLowerCase();
    switch (type) {
      case "hex":
        return princessJs.Color.createFromHexCode($("#base_color_hex").val());
      case "rgb":
        return princessJs.Color.create($("#base_color_r").val().toInt(), $("#base_color_g").val().toInt(), $("#base_color_b").val().toInt());
      case "hsv":
        return princessJs.Color.createFromHSV($("#base_color_h").val().toInt(), $("#base_color_s").val().toInt(), $("#base_color_v").val().toInt());
    }
  };

  /*
  #
  */


  Complementary = (function() {
    var gradationRate;

    function Complementary() {}

    gradationRate = 20;

    Complementary.base = function(origin) {
      return origin.addHue(180);
    };

    Complementary.colors = function(base) {
      return [-3, -2, -1, 0, 1, 2, 3].map(function(i) {
        return base.addSaturation(i * gradationRate);
      });
    };

    Complementary.render = function(origin) {
      var base, html, originHexCode;
      base = this.base(origin);
      originHexCode = origin.toCssHexCode();
      html = this.colors.compose(this.base)(origin).map(function(color) {
        var colorHexCode;
        colorHexCode = color.toCssHexCode();
        return "<div class='col-lg-6 color-compare' style='background-color:" + originHexCode + ";color:" + colorHexCode + ";'>        " + originHexCode + "      </div>      <div class='col-lg-6 color-compare'style='background-color:" + colorHexCode + ";color:" + originHexCode + ";'>        " + colorHexCode + "      </div>";
      });
      return $("#complementary .chart").html(html);
    };

    return Complementary;

  })();

  /*
  # Analogous Block
  */


  Analogous = (function() {
    function Analogous() {}

    Analogous.colors = function(origin) {
      return [-3, -2, -1, 0, 1, 2, 3].map(function(i) {
        return origin.addHue(i * 10);
      });
    };

    Analogous.render = function(origin) {
      var complementaryColorCode, html, originHexCode;
      originHexCode = origin.toCssHexCode();
      complementaryColorCode = origin.addHue(180).toCssHexCode();
      html = this.colors(origin).map(function(color) {
        var colorHexCode;
        colorHexCode = color.toCssHexCode();
        return "<div class='col-lg-6 color-compare' style='background-color:" + originHexCode + ";color:" + complementaryColorCode + "'>        " + originHexCode + "      </div>      <div class='col-lg-6 color-compare'style='background-color:" + colorHexCode + ";color:" + complementaryColorCode + "'>        " + colorHexCode + "      </div>";
      });
      return $("#analogous .chart").html(html);
    };

    return Analogous;

  })();

  /*
  # draw Triad color wheel
  */


  drawTriad = function(origin) {
    var colors;
    colors = [0, 1, 2].map(function(i) {
      return origin.addHue(i * 120);
    });
    return drawColorWheel(papers.triadWheel, colors);
  };

  /*
  # draw Hexard color wheel
  */


  drawHexard = function(origin) {
    var colors;
    colors = [0, 1, 2, 3, 4, 5].map(function(i) {
      return origin.addHue(i * 60);
    });
    return drawColorWheel(papers.hexardWheel, colors);
  };

  /*
  # draw color wheel
  */


  draw12ColorWheel = function(origin) {
    var colors;
    colors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function(i) {
      return origin.addHue(i * 30);
    });
    return drawColorWheel(papers.colorWheel, colors);
  };

  /*
  # draw color wheel
  */


  drawColorWheel = function(paper, colors) {
    var center, diffRad;
    paper.clear();
    center = {
      x: paper.width / 2,
      y: paper.height / 2
    };
    diffRad = 360 / colors.length;
    colors.forEach(function(color, i) {
      var animationMs, end, start, txt;
      start = (90 - diffRad / 2) + i * diffRad;
      end = start + diffRad;
      animationMs = {
        'txt': 100,
        'circle': 1000
      };
      txt = paper.text(center.x, center.y, color.toCssHexCode()).attr({
        'font-size': "20px",
        'fill': "#899299",
        'opacity': 0
      });
      return paper.circleSector(center.x, center.y, paper.width * 2 / 5, start, end).attr({
        'fill': color.toCssHexCode(),
        'stroke-width': 0
      }).mouseover(function() {
        var transform;
        transform = {
          'transform': "s1.1 1.1 " + center.x + " " + center.y
        };
        this.stop().animate(transform, animationMs.circle, "elastic");
        txt.toFront();
        return txt.stop().animate({
          opacity: 1
        }, animationMs.txt, "elastic");
      }).mouseout(function() {
        this.stop().animate({
          transform: ""
        }, animationMs.circle, "elastic");
        return txt.stop().animate({
          opacity: 0
        }, animationMs.txt, "elastic");
      });
    });
    return paper.circle(center.x, center.y, paper.width / 3).attr({
      'fill': "#ffffff",
      'stroke-width': 0
    });
  };

  window.RADIAN = Math.PI / 180;

  window.Raphael.fn.circleSector = function(cx, cy, r, startAngle, endAngle) {
    var x1, x2, y1, y2;
    x1 = cx + r * Math.cos(-startAngle * RADIAN);
    x2 = cx + r * Math.cos(-endAngle * RADIAN);
    y1 = cy + r * Math.sin(-startAngle * RADIAN);
    y2 = cy + r * Math.sin(-endAngle * RADIAN);
    return this.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]);
  };

}).call(this);
