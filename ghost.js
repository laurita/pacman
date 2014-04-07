// ghost object
// dir - direction pacman is about to move: 1 - right, 2 - down, 3 - left, 4 - up
function ghost(loc, dir, color) {
  if (!(this instanceof ghost)) {
      return new ghost(loc, dir, color);
  }
  this.loc = loc;
  this.dir = dir;
  this.color = color;
}

ghost.prototype.draw = function(ctx) {
  console.log('ghost.draw');
  console.log(JSON.stringify(this));
  ctx.save();
  ctx.beginPath();
  ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);
  ctx.fillStyle = this.color;
  ctx.fill();
  ctx.restore();
};