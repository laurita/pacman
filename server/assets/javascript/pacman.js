// pacman object
// dir - direction pacman is about to move: 1 - right, 2 - down, 3 - left, 4 - up
function pacman(loc, dir) {
  if (!(this instanceof pacman)) {
      return new pacman(loc, dir);
  }
  this.loc = loc;
  this.dir = dir;
}

pacman.prototype.draw = function(ctx) {
  ctx.save();
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.lineTo(1, 1);
  ctx.arc(1, 1, 1.5, 7 * Math.PI / 6, 17 * Math.PI / 6, false);
  ctx.closePath();
  ctx.fill();
  // set composite property
  ctx.restore();
};