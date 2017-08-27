function OctagonCell(options) {
    Cell.call(this, options);

    let size = this.size / 2.5;
    let b = Math.floor(size / Math.sqrt(2));
    let d = size + 2 * b;

    // left
    this.x1 = this.x + this.column * d + d;
    this.y1 = this.y + this.row * d + d;
    // left top
    this.x2 = this.x1;
    this.y2 = this.y1 - size;
    // // top
    this.x3 = this.x2 + b;
    this.y3 = this.y2 - b;
    // // top right
    this.x4 = this.x3 + size;
    this.y4 = this.y3;
    // // right
    this.x5 = this.x4 + b;
    this.y5 = this.y4 + b;
    // // bottom right
    this.x6 = this.x5;
    this.y6 = this.y5 + size;
    // // bottom
    this.x7 = this.x6 - b;
    this.y7 = this.y6 + b;
    // // bottom left
    this.x8 = this.x7 - size;
    this.y8 = this.y7;

    let half_size = Math.floor(size / 2);
    this.cx = this.x3 + half_size;
    this.cy = this.y3 + b + half_size;
}

OctagonCell.prototype.constructor = OctagonCell;
OctagonCell.prototype = Object.create(Cell.prototype);


OctagonCell.prototype.draw = function() {
    let left = new paper.Point(this.x1, this.y1);
    let top_left = new paper.Point(this.x2, this.y2);
    let top = new paper.Point(this.x3, this.y3);
    let top_right = new paper.Point(this.x4, this.y4);
    let right = new paper.Point(this.x5, this.y5);
    let bottom_right = new paper.Point(this.x6, this.y6);
    let bottom  = new paper.Point(this.x7, this.y7);
    let bottom_left  = new paper.Point(this.x8, this.y8);

    let left_line = new paper.Path.Line(left, top_left);
    let top_left_line = new paper.Path.Line(top_left, top);
    let top_line = new paper.Path.Line(top, top_right);
    let top_right_line = new paper.Path.Line(top_right, right);
    let right_line = new paper.Path.Line(right, bottom_right);
    let bottom_right_line = new paper.Path.Line(bottom_right, bottom);
    let bottom_line = new paper.Path.Line(bottom, bottom_left);
    let bottom_left_line = new paper.Path.Line(bottom_left, left);

    left_line.strokeColor = this.line_color;
    top_left_line.strokeColor = this.line_color;
    top_line.strokeColor = this.line_color;
    top_right_line.strokeColor = this.line_color;
    right_line.strokeColor = this.line_color;
    bottom_right_line.strokeColor = this.line_color;
    bottom_line.strokeColor = this.line_color;
    bottom_left_line.strokeColor = this.line_color;

    this.lines['left'] = left_line;
    this.lines['top_left'] = top_left_line;
    this.lines['top'] = top_line;
    this.lines['top_right'] = top_right_line;
    this.lines['right'] = right_line;
    this.lines['bottom_right'] = bottom_right_line;
    this.lines['bottom'] = bottom_line;
    this.lines['bottom_left'] = bottom_left_line;

    let points = [
        left, top_left, top,
        top_right, right, bottom_right,
        bottom, bottom_left
    ];
    this.layers[0].activate();
    this.square = new paper.Path(points);
    this.set_events();
    this.layers[1].activate();
};


OctagonCell.prototype.get_orientations = function() {
    return ['top', 'right', 'bottom', 'left'];
};


OctagonCell.prototype.get_horizontal_orientations = function() {
    return ['left', 'right'];
};


OctagonCell.prototype.get_vertical_orientations = function() {
    return ['top', 'bottom'];
};


OctagonCell.prototype.get_neighbor_position = function(orientation) {
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
