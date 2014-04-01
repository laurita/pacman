// pill object

function pill(loc) {
  if (!(this instanceof pill)) {
      return new pill(loc);
  }
  this.loc = loc;
}

pill.prototype.draw = function(ctx) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(1, 1, 0.5, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.restore();
};