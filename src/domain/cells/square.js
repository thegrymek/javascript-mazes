function SquareCell(options) {
    Cell.call(this, options);

    this.x1 = this.x + this.column * this.size;
    this.y1 = this.y + this.row * this.size;
    this.x2 = this.x1 + this.size;
    this.y2 = this.y1 + this.size;

    let half_size = Math.floor(this.size / 2);
    this.cx = this.x1 + half_size;
    this.cy = this.y1 + half_size;
}

SquareCell.prototype.constructor = SquareCell;
SquareCell.prototype = Object.create(Cell.prototype);


SquareCell.prototype.draw = function() {
    let left_top = new paper.Point(this.x1, this.y1);
    let right_top = new paper.Point(this.x2, this.y1);
    let left_bottom = new paper.Point(this.x1, this.y2);
    let right_bottom = new paper.Point(this.x2, this.y2);

    let left_line = new paper.Path.Line(left_bottom, left_top);
    let top_line = new paper.Path.Line(left_top, right_top);
    let right_line = new paper.Path.Line(right_top, right_bottom);
    let bottom_line = new paper.Path.Line(right_bottom, left_bottom);

    left_line.strokeColor = this.line_color;
    top_line.strokeColor = this.line_color;
    right_line.strokeColor = this.line_color;
    bottom_line.strokeColor = this.line_color;

    this.lines['left'] = left_line;
    this.lines['top'] = top_line;
    this.lines['right'] = right_line;
    this.lines['bottom'] = bottom_line;

    let points = [left_top, right_top,  right_bottom, left_bottom];
    this.layers[0].activate();
    this.square = new paper.Path(points);
    this.set_events();
    this.layers[1].activate();
};


SquareCell.prototype.get_orientations = function() {
    return ['bottom', 'left', 'top', 'right'];
};


SquareCell.prototype.get_horizontal_orientations = function() {
    return ['left', 'right'];
};


SquareCell.prototype.get_vertical_orientations = function() {
    return ['top', 'bottom'];
};


SquareCell.prototype.get_neighbor_position = function(orientation) {
    let row = this.row;
    let column = this.column;

    if (orientation === 'top') {
        row -= 1;
    }
    if (orientation === 'left') {
        column -= 1;
    }
    if (orientation === 'bottom') {
        row += 1;
    }
    if (orientation === 'right') {
        column += 1;
    }

    if (0 <= row && row < this.rows)
        if (0 <= column && column < this.columns)
            return [row, column];
    return [];
};
