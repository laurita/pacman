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
  
};