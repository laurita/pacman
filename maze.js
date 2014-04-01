// maze object

function maze(borders, pacman, ghosts, pills, food) {
  if (!(this instanceof maze)) {
      return new maze(borders, pacman, ghosts, pills, food);
  }
  this.borders = borders;
  this.pacman = pacman;
  this.ghosts = ghosts;
  this. pills = pills;
  this.food = food;
}

maze.prototype.draw = function(ctx) {
  
};
