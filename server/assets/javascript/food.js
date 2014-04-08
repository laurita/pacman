// food object

function food(loc) {
  if (!(this instanceof food)) {
      return new food(loc);
  }
  this.loc = loc;
}

food.prototype.draw = function(ctx) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.restore();
};