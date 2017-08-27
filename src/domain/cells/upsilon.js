function UpsilonCell(options) {
    Cell.call(this, options);

    let is_odd_column = this.column % 2 === 1;
    let is_odd_row = this.row % 2 === 1;
    this.scale = 2;

    if (is_odd_column !== is_odd_row) {
        this.init_square();
        this.im_octagon = false;
    }
    else {
        this.init_octagon();
        this.im_octagon = true;
    }
}

UpsilonCell.prototype.constructor = UpsilonCell;
UpsilonCell.prototype = Object.create(Cell.prototype);


UpsilonCell.prototype.init_octagon = function() {
    let size = this.size / this.scale;
    let b = Math.floor(size / Math.sqrt(2));
    let d = size + 2 * b;

    // left
    this.x1 = this.x + (this.column / 2) * d + (this.column / 2) * size;
    this.y1 = this.y + (this.row / 2) * d + (this.row / 2) * size;
    // left top
    this.x2 = this.x1 ;
    this.y2 = this.y1 - size;
    // // top
    this.x3 = this.x2 + b;
    this.y3 = this.y2 - b;
    // top right
    this.x4 = this.x3 + size;
    this.y4 = this.y3;
    // right
    this.x5 = this.x4 + b;
    this.y5 = this.y4 + b;
    // bottom right
    this.x6 = this.x5;
    this.y6 = this.y5 + size;
    // bottom
    this.x7 = this.x6 - b;
    this.y7 = this.y6 + b;
    // bottom left
    this.x8 = this.x7 - size;
    this.y8 = this.y7;

    let half_size = Math.floor(size / 2);
    this.cx = this.x3 + half_size;
    this.cy = this.y3 + b + half_size;
};


UpsilonCell.prototype.init_square = function() {
    let size = this.size / this.scale;
    this.size = size;
    let b = Math.floor(size / Math.sqrt(2));
    let d = size + 2 * b;

    this.x1 = this.x + (this.column / 2) * d + (this.column / 2) * size + b;
    this.y1 = this.y + (this.row / 2) * d + (this.row / 2) * size - size;
    this.x2 = this.x1 + size;
    this.y2 = this.y1 + size;

    let half_size = Math.floor(this.size / 2);
    this.cx = this.x1 + half_size;
    this.cy = this.y1 + half_size;
};



UpsilonCell.prototype.draw = function() {
    if (this.im_octagon)
        this.draw_octagon();
    else
        this.draw_square();
};

UpsilonCell.prototype.draw_square = function() {
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

    let square_size = new paper.Size(this.size, this.size);
    this.layers[0].activate();
    this.square = new paper.Path.Rectangle(left_top, square_size);
    this.set_events();
    this.layers[1].activate();
};

UpsilonCell.prototype.draw_octagon = function() {
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


UpsilonCell.prototype.get_orientations = function() {
    if (this.im_octagon)
        return this.get_octagon_orientations();
    else
        return this.get_square_orientations();
};


UpsilonCell.prototype.get_horizontal_orientations = function() {
    if (this.im_octagon)
        return ['left', 'right'];
    else
        return ['left', 'right'];
};


UpsilonCell.prototype.get_vertical_orientations = function() {
    if (this.im_octagon)
        return ['top', 'bottom',];
    else
        return ['top', 'bottom'];
};


UpsilonCell.prototype.get_square_orientations = function() {
    return ['top', 'right', 'bottom', 'left'];
};


UpsilonCell.prototype.get_octagon_orientations = function() {
    return [
        'top_left', 'top', 'top_right',
        'right',
        'bottom_right', 'bottom', 'bottom_left',
        'left'
    ];
};


UpsilonCell.prototype.get_neighbor_position = function(orientation) {
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
    if (orientation === 'top_left') {
        row -= 1;
        column -= 1;
    }
    if (orientation === 'top_right') {
        row -= 1;
        column += 1;
    }
    if (orientation === 'bottom_left') {
        row += 1;
        column -= 1;
    }
    if (orientation === 'bottom_right') {
        row += 1;
        column += 1;
    }


    if (0 <= row && row < this.rows)
        if (0 <= column && column < this.columns)
            return [row, column];
    return [];
};
