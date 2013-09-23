(function() {
  var Analogous, Color12, ColorControls, ColorWheel, Complementary, Hexard, Tone8, Triad, drawColorWheel, _ref, _ref1, _ref2, _ref3,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $(function() {
    /*
    # Initialize
    */

    ColorControls.init();
    Triad.init();
    Hexard.init();
    Color12.init();
    return Tone8.init();
  });

  /*
  Controls
  */


  ColorControls = (function() {
    function ColorControls() {}

    ColorControls.$imageColor = $("#base_color_selector .image-color");

    /*
    must be called on document.onload
    */


    ColorControls.init = function() {
      var _this = this;
      _this = this;
      $("#base_color_hex").focus(function() {
        return $("#type_hex").click();
      });
      $("#base_color_r, #base_color_g, #base_color_b").focus(function() {
        return $("#type_rgb").click();
      });
      $("#base_color_h, #base_color_s, #base_color_v").focus(function() {
        return $("#type_hsv").click();
      });
      $("#color_controls .base_color_255").change(function() {
        var val;
        val = ('' + $(this).val()).toFloatOrZero() % 256;
        return $(this).val(val);
      });
      $("#color_controls .base_color_359").change(function() {
        var val;
        val = ('' + $(this).val()).toFloatOrZero() % 360;
        return $(this).val(val);
      });
      $("#base_color_hex").change(function() {
        return _this.setColor($(this).val());
      });
      $("#base_color_r, #base_color_g, #base_color_b").change(function() {
        return _this.setColor({
          r: $("#base_color_r").val(),
          g: $("#base_color_g").val(),
          b: $("#base_color_b").val()
        });
      });
      $("#base_color_h, #base_color_s, #base_color_v").change(function() {
        return _this.setColor({
          r: $("#base_color_h").val(),
          g: $("#base_color_s").val(),
          b: $("#base_color_v").val()
        });
      });
      $("#base_color_selector").ColorPicker({
        color: this.$imageColor.css('background-color'),
        onShow: function(colpkr) {
          $(colpkr).fadeIn(500);
          return false;
        },
        onHide: function(colpkr) {
          $(colpkr).fadeOut(500);
          return false;
        },
        onChange: function(hsb, hex, rgb) {
          return _this.setColor(rgb);
        }
      });
      return $("#execute").click(function(ev) {
        _this.execute();
        return false;
      });
    };

    /*
    get origin color from inputs
    */


    ColorControls.getColor = function() {
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
    update all
    */


    ColorControls.setColor = function(val) {
      var color, hexCode, hsv, rgb;
      color = (val.h != null) && (val.s != null) && (val.v != null) ? princessJs.Color.createFromHSV(val) : (val.r != null) && (val.g != null) && (val.b != null) ? princessJs.Color.createFromRGB(val) : princessJs.Color.createFromHexCode(val);
      rgb = color.toRGB();
      hsv = color.toHSV();
      hexCode = color.toCssHexCode();
      this.$imageColor.ColorPickerSetColor(rgb);
      this.$imageColor.css('background-color', hexCode);
      $("#base_color_hex").val(hexCode);
      $("#base_color_r").val(rgb.r);
      $("#base_color_g").val(rgb.g);
      $("#base_color_b").val(rgb.b);
      $("#base_color_h").val(hsv.h);
      $("#base_color_s").val(hsv.s);
      $("#base_color_v").val(hsv.v);
      if ($("#auto_calc").checked()) {
        this.execute();
      }
      return this;
    };

    /*
    calcurate and render
    */


    ColorControls.execute = function() {
      var origin;
      origin = ColorControls.getColor();
      Complementary.render(origin);
      Triad.render(origin);
      Hexard.render(origin);
      Analogous.render(origin);
      Color12.render(origin);
      Tone8.render(origin);
      return this;
    };

    return ColorControls;

  })();

  /*
  # Complementary
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
        return "<div><div class='col-lg-6 color-compare' style='background-color:" + originHexCode + ";color:" + colorHexCode + ";'>        " + originHexCode + "      </div>      <div class='col-lg-6 color-compare'style='background-color:" + colorHexCode + ";color:" + originHexCode + ";'>        " + colorHexCode + "      </div></div>";
      });
      return $("#complementary .chart").html(html.join(''));
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
        return "<div><div class='col-lg-6 color-compare' style='background-color:" + originHexCode + ";color:" + complementaryColorCode + "'>        " + originHexCode + "      </div>      <div class='col-lg-6 color-compare' style='background-color:" + colorHexCode + ";color:" + complementaryColorCode + "'>        " + colorHexCode + "      </div></div>";
      });
      return $("#analogous .chart").html(html.join(''));
    };

    return Analogous;

  })();

  /*
  Color Wheel base class
  */


  ColorWheel = (function() {
    function ColorWheel() {}

    ColorWheel.createRaphael = function(id) {
      return Raphael(id, $("#" + id).width(), $("#" + id).height());
    };

    ColorWheel.dtdd = function(origin) {
      return this.colors(origin).map(function(color) {
        var colorHexCode;
        colorHexCode = color.toCssHexCode();
        return "<dt style='background-color:" + colorHexCode + ";'></dt>      <dd>" + colorHexCode + "</dd>";
      });
    };

    ColorWheel.draw = function(origin) {
      return drawColorWheel(this.paper, this.colors(origin));
    };

    return ColorWheel;

  })();

  /*
  Triad Weel
  */


  Triad = (function(_super) {
    __extends(Triad, _super);

    function Triad() {
      _ref = Triad.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Triad.init = function() {
      return this.paper = this.createRaphael("triad_wheel_svg");
    };

    Triad.colors = function(origin) {
      return [0, 1, 2].map(function(i) {
        return origin.addHue(i * 120);
      });
    };

    Triad.render = function(origin) {
      this.draw(origin);
      return $("#triad dl.color-list").html(this.dtdd(origin).join(''));
    };

    return Triad;

  })(ColorWheel);

  /*
  Hexard Wheel
  */


  Hexard = (function(_super) {
    __extends(Hexard, _super);

    function Hexard() {
      _ref1 = Hexard.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Hexard.init = function() {
      return this.paper = this.createRaphael("hexard_wheel_svg");
    };

    Hexard.colors = function(origin) {
      return [0, 1, 2, 3, 4, 5].map(function(i) {
        return origin.addHue(i * 60);
      });
    };

    Hexard.render = function(origin) {
      this.draw(origin);
      return $("#hexard dl.color-list").html(this.dtdd(origin).join(''));
    };

    return Hexard;

  })(ColorWheel);

  /*
  Color Wheel
  */


  Color12 = (function(_super) {
    __extends(Color12, _super);

    function Color12() {
      _ref2 = Color12.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    Color12.init = function() {
      return this.paper = this.createRaphael("color_wheel_svg");
    };

    Color12.colors = function(origin) {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function(i) {
        return origin.addHue(i * 30);
      });
    };

    Color12.render = function(origin) {
      this.draw(origin);
      return $("#color_wheel dl.color-list").html(this.dtdd(origin).join(''));
    };

    return Color12;

  })(ColorWheel);

  /*
  Tone Color
  */


  Tone8 = (function(_super) {
    __extends(Tone8, _super);

    function Tone8() {
      _ref3 = Tone8.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    Tone8.init = function() {
      return this.paper = this.createRaphael("tone_8_wheel_svg");
    };

    Tone8.colors = function(origin) {
      return [0, 1, 2, 3, 4, 5, 6, 7].map(function(i) {
        return origin.setSaturation(i * 32);
      });
    };

    Tone8.render = function(origin) {
      this.draw(origin);
      return $("#tone_8_wheel dl.color-list").html(this.dtdd(origin).join(''));
    };

    return Tone8;

  })(ColorWheel);

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
