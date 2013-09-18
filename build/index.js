(function() {
  window.drawColorWheel = function(paper, colors) {
    var animationMs, center, color, diffRad, end, i, start, txt, _i, _len;
    paper.clear();
    center = {
      x: paper.width / 2,
      y: paper.height / 2
    };
    diffRad = 360 / colors.length;
    for (i = _i = 0, _len = colors.length; _i < _len; i = ++_i) {
      color = colors[i];
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
      paper.circleSector(center.x, center.y, paper.width * 2 / 5, start, end).attr({
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
    }
    return paper.circle(center.x, center.y, paper.width / 3).attr({
      'fill': "#ffffff",
      'stroke-width': 0
    });
  };

}).call(this);
