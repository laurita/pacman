// top level functions

function borderTemplates() {
  return {  v: new borderTemplate( [[1, 0], [1, 1], [1, 2]] ),
            h: new borderTemplate( [[0, 1], [1, 1], [2, 1]] ),
            tl: new borderTemplate( [[1, 1], [1, 2], [2, 1]] ),
            tr: new borderTemplate( [[0, 1], [1, 1], [1, 2]] ),
            br: new borderTemplate( [[1, 0], [0, 1], [1, 1]] ),
            bl: new borderTemplate( [[1, 0], [1, 1], [2, 1]] )
          };
}

function draw(conf, state, ctx) {
  ctx.clearRect(0, 0, conf.resolution.x, conf.resolution.y);
  // fill background
  ctx.fillRect(0, 0, conf.resolution.x, conf.resolution.y);
  // draw borders
  drawBorders(state.maze.borders, conf, ctx);
  // draw pills
  drawPills(state.maze.pills, conf, ctx);
  // draw food
  drawFoods(state.maze.food, conf, ctx);
  // draw ghosts
  drawGhosts(state.maze.ghosts, conf, ctx);
  // draw pacman
  drawPacman(conf.resolution.x / conf.resolution.fx, conf.resolution.y / conf.resolution.fy, ctx, state.maze.pacman);
}

function drawPacman(bwidth, bheight, ctx, pacman) {
  ctx.save();
  ctx.translate(bwidth * (pacman.loc.x - 0.33), bheight * pacman.loc.y);
  ctx.scale(bwidth / 2, bheight / 2);
  pacman.draw(ctx);
  ctx.restore();
}

function drawGhosts(ghosts, conf, ctx) {
  console.log('drawGhosts');
  console.log(JSON.stringify(ghosts));
  ctx.save();
  for (var i = 0; i < ghosts.length; i++) {
    drawGhost(conf.resolution.x / conf.resolution.fx, conf.resolution.y / conf.resolution.fy, ctx, ghosts[i]);
  }
  ctx.restore();
}

function drawGhost(bwidth, bheight, ctx, ghost) {
  console.log('drawGhost');
  console.log(JSON.stringify(ghost));
  ctx.save();
  ctx.translate(bwidth * ghost.loc.x + bwidth * 0.33, bheight * ghost.loc.y);
  ctx.scale(bwidth / 1.5, bheight / 1.5);
  ghost.draw(ctx);
  ctx.restore();
}

function drawBorder(bwidth, bheight, ctx, border) {
  ctx.save();
  ctx.translate(bwidth * border.loc.x , bheight * border.loc.y );
  ctx.scale(bwidth / 3, bheight / 3);
  border.draw(ctx);
  ctx.restore();
}

function drawBorders(borders, conf, ctx) {
  ctx.save();
  ctx.fillStyle = '#00F';
  for (var i = 0; i < borders.length; i++) {
    drawBorder(conf.resolution.x / conf.resolution.fx, conf.resolution.y / conf.resolution.fy, ctx, borders[i]);
  }
  ctx.restore();
}

function drawPill(bwidth, bheight, ctx, pill) {
  ctx.save();
  ctx.translate(bwidth * pill.loc.x, bheight * pill.loc.y );
  ctx.scale(bwidth / 3, bheight / 3);
  pill.draw(ctx);
  ctx.restore();
}

function drawPills(pills, conf, ctx) {
  ctx.save();
  for (var i = 0; i < pills.length; i++) {
    drawPill(conf.resolution.x / conf.resolution.fx, conf.resolution.y / conf.resolution.fy, ctx, pills[i]);
  }
  ctx.restore();
}

function drawFood(bwidth, bheight, ctx, food) {
  ctx.save();
  ctx.translate(bwidth * food.loc.x, bheight * food.loc.y );
  ctx.scale(bwidth / 3, bheight / 3);
  food.draw(ctx);
  ctx.restore();
}

function drawFoods(foods, conf, ctx) {
  ctx.save();
  for (var i = 0; i < foods.length; i++) {
    drawFood(conf.resolution.x / conf.resolution.fx, conf.resolution.y / conf.resolution.fy, ctx, foods[i]);
  }
  ctx.restore();
}

function boardArray() {
  return [
          [3,2,2,2,2,2,2,2,2,2,2,2,2,4,3,2,2,2,2,2,2,2,2,2,2,2,2,4],
          [1,7,7,7,7,7,7,7,7,7,7,7,7,1,1,7,7,7,7,7,7,7,7,7,7,7,7,1],
          [1,7,3,2,2,4,7,3,2,2,2,4,7,1,1,7,3,2,2,2,4,7,3,2,2,4,7,1],
          [1,8,1,0,0,1,7,1,0,0,0,1,7,1,1,7,1,0,0,0,1,7,1,0,0,1,8,1],
          [1,7,5,2,2,6,7,5,2,2,2,6,7,5,6,7,5,2,2,2,6,7,5,2,2,6,7,1],
          [1,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,1],
          [1,7,3,2,2,4,7,3,4,7,3,2,2,2,2,2,2,4,7,3,4,7,3,2,2,4,7,1],
          [1,7,5,2,2,6,7,1,1,7,5,2,2,4,3,2,2,6,7,1,1,7,5,2,2,6,7,1],
          [1,7,7,7,7,7,7,1,1,7,7,7,7,1,1,7,7,7,7,1,1,7,7,7,7,7,7,1],
          [5,2,2,2,2,4,7,1,5,2,2,4,0,1,1,0,3,2,2,6,1,7,3,2,2,2,2,6],
          [0,0,0,0,0,1,7,1,3,2,2,6,0,5,6,0,5,2,2,4,1,7,1,0,0,0,0,0],
          [0,0,0,0,0,1,7,1,1,0,0,0,0,9,0,0,0,0,0,1,1,7,1,0,0,0,0,0],
          [0,0,0,0,0,1,7,1,1,0,3,2,2,0,0,2,2,4,0,1,1,7,1,0,0,0,0,0],
          [0,2,2,2,2,6,7,5,6,0,1,0,0,0,0,0,0,1,0,5,6,7,5,2,2,2,2,0],
          [0,0,0,0,0,0,7,0,0,0,1,0,0,0,0,0,0,1,0,0,0,7,0,0,0,0,0,0],
          [0,2,2,2,2,4,7,3,4,0,1,10,0,11,0,12,0,1,0,3,4,7,3,2,2,2,2,0],
          [0,0,0,0,0,1,7,1,1,0,5,2,2,2,2,2,2,6,0,1,1,7,1,0,0,0,0,0],
          [0,0,0,0,0,1,7,1,1,0,0,0,0,0,0,0,0,0,0,1,1,7,1,0,0,0,0,0],
          [0,0,0,0,0,1,7,1,1,0,3,2,2,2,2,2,2,4,0,1,1,7,1,0,0,0,0,0],
          [3,2,2,2,2,6,7,5,6,0,5,2,2,4,3,2,2,6,0,5,6,7,5,2,2,2,2,4],
          [1,7,7,7,7,7,7,7,7,7,7,7,7,1,1,7,7,7,7,7,7,7,7,7,7,7,7,1],
          [1,7,3,2,2,4,7,3,2,2,2,4,7,1,1,7,3,2,2,2,4,7,3,2,2,4,7,1],
          [1,7,5,2,4,1,7,5,2,2,2,6,7,5,6,7,5,2,2,2,6,7,1,3,2,6,7,1],
          [1,8,7,7,1,1,7,7,7,7,7,7,7,0,13,7,7,7,7,7,7,7,1,1,7,7,8,1],
          [5,2,4,7,1,1,7,3,4,7,3,2,2,2,2,2,2,4,7,3,4,7,1,1,7,3,2,6],
          [3,2,6,7,5,6,7,1,1,7,5,2,2,4,3,2,2,6,7,1,1,7,5,6,7,5,2,4],
          [1,7,7,7,7,7,7,1,1,7,7,7,7,1,1,7,7,7,7,1,1,7,7,7,7,7,7,1],
          [1,7,3,2,2,2,2,6,5,2,2,4,7,1,1,7,3,2,2,6,5,2,2,2,2,4,7,1],
          [1,7,5,2,2,2,2,2,2,2,2,6,7,5,6,7,5,2,2,2,2,2,2,2,2,6,7,1],
          [1,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,1],
          [5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6]  
         ];
}

function makeBoard(templates) {
  var ba = boardArray();
  var borders = [];
  var pills = [];
  var foods = [];
  var pac;
  var ghosts = [];
  for (i in ba) {
    for (j in ba[i]) {
      var elem = ba[i][j];
      var loc = {x: parseInt(j), y: parseInt(i) };
      // borders
      if (elem >= 1 && elem <= 6) {
        var temp = (elem == 1) ? templates.v :                // vertical border
                  ((elem == 2) ? templates.h :                // horizontal
                  ((elem == 3) ? templates.tl :               // top left corner
                  ((elem == 4) ? templates.tr :               // top right corner
                  ((elem == 5) ? templates.bl :               // bottom left corner
                  templates.br))));                           // bottom right corner
        borders.push(new border( loc, temp   ));
      }
      // pills 
      else if (elem == 7) {
        pills.push( new pill( loc ) );
      }
      // food
      else if (elem == 8) {
        foods.push( new food( loc ) );
      }
      else if (elem >= 9 && elem <= 12) {
        var color = (elem == 9) ? '#d00' :
                   ((elem == 10) ? '#6ff' :
                   ((elem == 11) ? '#f99' :
                   '#f90'));
        ghosts.push( new ghost( loc, 1, color) );
      } else if (elem == 13) {
        pac = new pacman( loc, 1);
      }
    }
  }
  return { borders: borders, pills: pills, food: foods, ghosts: ghosts, pacman: pac};
}

function getNextCellLocation(pacman, board, keycode) {
  var pac_new_loc = pacman.loc;
  switch(keycode)
  {
    // left
    case 37: {
      console.log("left");
      pac_new_loc = { x: pacman.loc.x - 1, y: pacman.loc.y };
      break;
    } 
    // up
    case 38: {
      console.log("up");
      pac_new_loc = { x: pacman.loc.x, y: pacman.loc.y - 1 };
      break;
    }
    // right
    case 39: {
      console.log("right");
      pac_new_loc = { x: pacman.loc.x + 1, y: pacman.loc.y };
      break;
    }
    // down
    case 40: {
      console.log("down");
      pac_new_loc = { x: pacman.loc.x, y: pacman.loc.y + 1 };
      break;
    }
    default: {
      console.log("other");
      break;
    }
  }
  console.log("next cell location: " + JSON.stringify(pac_new_loc));
  return pac_new_loc;
}

function performEvent(next_loc, state) {
  switch(state.board[next_loc.y][next_loc.x])
  {
    // empty
    case 0: {
      // move pacman to this cell, i.e. change two board array cell values
      // and update pacman state
      var pac = state.maze.pacman;
      state.board[pac.loc.y][pac.loc.x] = 0;
      state.board[next_loc.y][next_loc.x] = 13;
      console.log("pacman loc before "+ JSON.stringify(pac.loc));
      // and update pacman in JSON
      state.maze.pacman.loc = next_loc;
      console.log("pacman loc after "+ JSON.stringify(pac.loc));
      break;
    }
    // pill
    case 7: {
      // remove pill from JSON, i.e. from state.maze.pills
      console.log("before removing pill")
      console.log(state.maze.pills.length)
      removeElemInJSON(next_loc, state.maze.pills);
      console.log("after removing pill")
      console.log(state.maze.pills.length)
      // increase score
      state.score++;
      // move pacman to this cell, i.e. change two board array cell values
      // and update pacman state
      var pac = state.maze.pacman;
      state.board[pac.loc.y][pac.loc.x] = 0;
      state.board[next_loc.y][next_loc.x] = 13;
      console.log("pacman loc before "+ JSON.stringify(pac.loc));
      // and update pacman in JSON
      state.maze.pacman.loc = next_loc;
      console.log("pacman loc after "+ JSON.stringify(pac.loc));
      break;
    }
    // food
    case 8: {
      // remove pill from JSON, i.e. from state.maze.pills
      console.log("before removing food")
      console.log(state.maze.food.length)
      removeElemInJSON(next_loc, state.maze.food);
      console.log("after removing food")
      console.log(state.maze.food.length)
      // increase score
      state.score += 10;
      // move pacman to this cell, i.e. change two board array cell values
      // and update pacman state
      var pac = state.maze.pacman;
      state.board[pac.loc.y][pac.loc.x] = 0;
      state.board[next_loc.y][next_loc.x] = 13;
      console.log("pacman loc before "+ JSON.stringify(pac.loc));
      // and update pacman in JSON
      state.maze.pacman.loc = next_loc;
      console.log("pacman loc after "+ JSON.stringify(pac.loc));
      break;
    }
    // border
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6: {
      console.log("bump");
      break;
    }
  }
  console.log("score: "+ state.score);
  return state;
}

function removeElemInJSON(loc, elems) {
  var i = elems.findIndex( function(el) { if ( el.loc.x == loc.x && el.loc.y == loc.y) return pill;});
  elems.splice(i, 1);
  //return pills;
}

function moveGhosts(state) {
  var ghosts = state.maze.ghosts;
  for (var i = 0; i < ghosts.length; i++) {
    ghosts[i].move(state);
  }
  
}

