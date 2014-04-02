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
  // draw pacman
  drawPacman(conf.resolution.x / conf.resolution.fx, conf.resolution.y / conf.resolution.fy, ctx, state.maze.pacman);
}

function drawPacman(bwidth, bheight, ctx, pacman) {
  ctx.save();
  ctx.translate(bwidth * pacman.loc.x, bheight * pacman.loc.y);
  ctx.scale(bwidth / 3, bheight / 3);
  pacman.draw(ctx);
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
          [0,0,0,0,0,1,7,1,1,0,0,0,0,0,0,0,0,0,0,1,1,7,1,0,0,0,0,0],
          [0,0,0,0,0,1,7,1,1,0,3,2,2,2,2,2,2,4,0,1,1,7,1,0,0,0,0,0],
          [0,2,2,2,2,6,7,5,6,0,1,0,0,0,0,0,0,1,0,5,6,7,5,2,2,2,2,0],
          [0,0,0,0,0,0,7,0,0,0,1,0,0,0,0,0,0,1,0,0,0,7,0,0,0,0,0,0],
          [0,2,2,2,2,4,7,3,4,0,1,0,0,0,0,0,0,1,0,3,4,7,3,2,2,2,2,0],
          [0,0,0,0,0,1,7,1,1,0,5,2,2,2,2,2,2,6,0,1,1,7,1,0,0,0,0,0],
          [0,0,0,0,0,1,7,1,1,0,0,0,0,0,0,0,0,0,0,1,1,7,1,0,0,0,0,0],
          [0,0,0,0,0,1,7,1,1,0,3,2,2,2,2,2,2,4,0,1,1,7,1,0,0,0,0,0],
          [3,2,2,2,2,6,7,5,6,0,5,2,2,4,3,2,2,6,0,5,6,7,5,2,2,2,2,4],
          [1,7,7,7,7,7,7,7,7,7,7,7,7,1,1,7,7,7,7,7,7,7,7,7,7,7,7,1],
          [1,7,3,2,2,4,7,3,2,2,2,4,7,1,1,7,3,2,2,2,4,7,3,2,2,4,7,1],
          [1,7,5,2,4,1,7,5,2,2,2,6,7,5,6,7,5,2,2,2,6,7,1,3,2,6,7,1],
          [1,8,7,7,1,1,7,7,7,7,7,7,7,7,13,7,7,7,7,7,7,7,1,1,7,7,8,1],
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
        var color = (elem == 9) ? '#F00' :
                   ((elem == 10) ? '#0F0' :
                   ((elem == 11) ? '#00F' :
                   '#220'));
        ghosts.push( new ghost( loc, color, 1) );
      } else if (elem == 13) {
        pac = new pacman( loc, 1);
      }
    }
  }
  return { borders: borders, pills: pills, food: foods, ghosts: ghosts, pacman: pac};
}

