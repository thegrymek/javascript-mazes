function TriangleCell(options) {
    Cell.call(this, options);

    let size = this.size * 1.2;
    let half_width = Math.floor(size / 2);
    let height = Math.floor(size * Math.sqrt(3) / 2);
    let half_height = Math.floor(height / 2);

    let cx = this.x + half_height + this.column * half_width;
    let cy = this.y + half_height + this.row * height;

    this.is_upper = this.row % 2;
    this.west_x = cx - half_width;
    this.mid_x = cx;
    this.east_x = cx + half_width;

    if (this.column % 2 === this.is_upper) {
        this.base_y = cy + half_height;
        this.upper_y = cy - half_height;
        this.cy = cy + half_height / 2;
    } else {
        this.base_y = cy - half_height;
        this.upper_y = cy + half_height;
        this.cy = cy - half_height / 3;
    }

    this.cx = cx;
}


TriangleCell.prototype.constructor = TriangleCell;
TriangleCell.prototype = Object.create(Cell.prototype);


TriangleCell.prototype.draw = function() {
    let line_color = this.line_color;
    let point1 = new Point(this.west_x, this.base_y);
    let point2 = new Point(this.mid_x, this.upper_y);
    let point3 = new Point(this.east_x, this.base_y);

    let point1_line = new paper.Path.Line(point1, point2);
    let point2_line = new paper.Path.Line(point2, point3);
    let point3_line = new paper.Path.Line(point3, point1);

    point1_line.strokeColor = line_color;
    point2_line.strokeColor = line_color;
    point3_line.strokeColor = line_color;

    this.lines['left'] = point1_line;
    this.lines['right'] = point2_line;

    if (this.column % 2 === this.is_upper)
        this.lines['bottom'] = point3_line;
    else
        this.lines['top'] = point3_line;

    let points = [point1, point2, point3];
    this.layers[0].activate();
    this.square = new paper.Path(points);
    this.set_events();
    this.layers[1].activate();
};


TriangleCell.prototype.get_orientations = function() {
    if (this.column % 2 === this.is_upper)
        return ['left', 'right', 'bottom'];
    else
        return ['left', 'top', 'right',];
};


TriangleCell.prototype.get_horizontal_orientations = function() {
    if (this.column % 2 === this.is_upper)
        return ['left', 'right'];
    else
        return ['left', 'right'];
};


TriangleCell.prototype.get_vertical_orientations = function() {
    if (this.column % 2 === this.is_upper)
        return ['bottom'];
    else
        return ['top'];
};


TriangleCell.prototype.get_neighbor_position = function(orientation) {
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
