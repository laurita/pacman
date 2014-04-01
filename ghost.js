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
  
};