// maze object

function maze(board) {
  if (!(this instanceof maze)) {
      return new maze(borders, pacman, ghosts, pills, food);
  }
  this.borders = board.borders;
  this.pacman = board.pacman;
  this.ghosts = board.ghosts;
  this. pills = board.pills;
  this.food = board.food;
}

maze.prototype.draw = function(ctx) {
  
};
