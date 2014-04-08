// borderTemplate object

function borderTemplate(cells) {
  // force creating object instance with "new"
  if (!(this instanceof borderTemplate)) {
      return new borderTemplate(cells);
  }
  this.cells = cells;
}

// eof
