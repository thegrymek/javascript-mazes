function HexCell(options) {
    Cell.call(this, options);

    let s = this.size / 2;
    let a = Math.floor(s / 2.0);
    let b = Math.floor(s * Math.sqrt(3) / 2);
    let height = b * 2;

    let cx = this.x + s + 3 * a * this.column;
    let cy = this.y + b + this.row * height;
    if (this.column % 2 === 1) {
        cy += b;
    }
    // use for debug
    // let text = new PointText(new Point(cx - 12, cy));
    // text.content = [this.row, this.column];

    this.x_left = cx - s;
    this.x_mid_left = cx - a;
    this.x_mid_right = cx + a;
    this.x_right = cx + s;

    this.y_top = cy - b;
    this.y_mid = cy;
    this.y_bottom = cy + b;

    this.cx = cx;
    this.cy = cy;
}

HexCell.prototype.constructor = HexCell;
HexCell.prototype = Object.create(Cell.prototype);

HexCell.prototype.draw = function() {
    let line_color = this.line_color;
    let left_point = new Point(this.x_left, this.y_mid);
    let top_left_point = new Point(this.x_mid_left, this.y_top);
    let top_right_point = new Point(this.x_mid_right, this.y_top);

    let right_point = new Point(this.x_right, this.y_mid);
    let bottom_right_point = new Point(this.x_mid_right, this.y_bottom);
    let bottom_left_point = new Point(this.x_mid_left, this.y_bottom);

    let top_left_line = new paper.Path.Line(left_point, top_left_point);
    let top_line = new paper.Path.Line(top_left_point, top_right_point);
    let top_right_line = new paper.Path.Line(top_right_point, right_point);

    let bottom_right_line = new paper.Path.Line(right_point, bottom_right_point);
    let bottom_line = new paper.Path.Line(bottom_right_point, bottom_left_point);
    let bottom_left_line = new paper.Path.Line(bottom_left_point, left_point);

    top_left_line.strokeColor = line_color;
    top_line.strokeColor = line_color;
    top_right_line.strokeColor = line_color;

    bottom_right_line.strokeColor = line_color;
    bottom_line.strokeColor = line_color;
    bottom_left_line.strokeColor = line_color;

    this.lines['top_left'] = top_left_line;
    this.lines['top'] = top_line;
    this.lines['top_right'] = top_right_line;

    this.lines['bottom_right'] = bottom_right_line;
    this.lines['bottom'] = bottom_line;
    this.lines['bottom_left'] = bottom_left_line;

    let points = [
        left_point, top_left_point, top_right_point,
        right_point, bottom_right_point, bottom_left_point
    ];

    this.layers[0].activate();
    this.square = new paper.Path(points);
    this.set_events();
    this.layers[1].activate();
};


HexCell.prototype.get_orientations = function() {
    return [
        'top_left', 'top', 'top_right', 'bottom_right', 'bottom', 'bottom_left'
    ];
};


HexCell.prototype.get_horizontal_orientations = function() {
    return ['top_left', 'top_right', 'bottom_left', 'bottom_right']
};


HexCell.prototype.get_vertical_orientations = function() {
    return ['top', 'bottom'];
};


HexCell.prototype.get_neighbor_position = function(orientation) {
    let pos = null;

    if (orientation === 'top_left') {
        if (this.column % 2 === 0)
            pos = [this.row - 1, this.column - 1];
        else
            pos = [this.row, this.column - 1];
    }
    if (orientation === 'top') {
        pos = [this.row - 1, this.column];
    }
    if (orientation === 'top_right') {
        if (this.column % 2 === 0)
            pos = [this.row - 1, this.column + 1];
        else
            pos = [this.row, this.column + 1];
    }
    if (orientation === 'bottom_left') {
        if (this.column % 2 === 0)
            pos = [this.row, this.column - 1];
        else
            pos = [this.row + 1, this.column - 1];
    }
    if (orientation === 'bottom') {
        pos = [this.row + 1, this.column];
    }
    if (orientation === 'bottom_right') {
        if (this.column % 2 === 0)
            pos = [this.row, this.column + 1];
        else
            pos = [this.row + 1, this.column + 1];
    }

    if (0 <= pos[0] && pos[0] < this.rows)
        if (0 <= pos[1] && pos[1] < this.columns)
            return pos;
    return [];
};
