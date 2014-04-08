// border object

function border(loc, template) {
  if (!(this instanceof border)) {
      return new border(type, loc);
  }
  this.loc = loc;
  this.template = template;
}

border.prototype.draw = function(ctx) {
  var cells = this.template.cells;
  ctx.save();
  for (var i = 0; i < cells.length; i++ ) {
    //ctx.translate(cells[i][0], cells[i][1]);
    ctx.fillRect(cells[i][0], cells[i][1], 1, 1);
  }
  ctx.restore();
};