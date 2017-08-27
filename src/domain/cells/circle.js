function CircleCell(options) {
    Cell.call(this, options);

    let x = this.x + (this.size * this.rows / 2);
    let y = this.y + (this.size * this.columns / 2);
    let size = this.size / 1.8;
    let theta = 2 * Math.PI / this.columns;
    let inner_radius = this.row * size;
    let outer_radius = (this.row + 1) * size;
    let inner_theta = this.column * theta;
    let outer_theta = (this.column + 1) * theta;
    let half_outer_theta = (this.column + 0.5) * theta;

    this.ax = x + (inner_radius * Math.cos(inner_theta));
    this.ay = y + (inner_radius * Math.sin(inner_theta));
    this.bx = x + (outer_radius * Math.cos(inner_theta));
    this.by = y + (outer_radius * Math.sin(inner_theta));

    this.cx = x + (inner_radius * Math.cos(outer_theta));
    this.cy = y + (inner_radius * Math.sin(outer_theta));
    this.dx = x + (outer_radius * Math.cos(outer_theta));
    this.dy = y + (outer_radius * Math.sin(outer_theta));

    this.ex = x + (inner_radius * Math.cos(half_outer_theta));
    this.ey = y + (inner_radius * Math.sin(half_outer_theta));
    this.fx = x + (outer_radius * Math.cos(half_outer_theta));
    this.fy = y + (outer_radius * Math.sin(half_outer_theta));
}

CircleCell.prototype.constructor = CircleCell;
CircleCell.prototype = Object.create(Cell.prototype);

CircleCell.prototype.draw = function() {
    let line_color = this.line_color;
    let point_a = new paper.Point(this.ax, this.ay);
    let point_b = new paper.Point(this.bx, this.by);
    let point_c = new paper.Point(this.cx, this.cy);
    let point_d = new paper.Point(this.dx, this.dy);
    let point_e = new paper.Point(this.ex, this.ey);
    let point_f = new paper.Point(this.fx, this.fy);

    let top_arc = new paper.Path.Arc(point_a, point_e, point_c);
    let bottom_arc = new paper.Path.Arc(point_b, point_f, point_d);
    let left_line = new paper.Path.Line(point_a, point_b);
    let right_line = new paper.Path.Line(point_c, point_d);

    bottom_arc.strokeColor = line_color;
    bottom_arc.strokeColor = line_color;
    left_line.strokeColor = line_color;
    right_line.strokeColor = line_color;

    this.lines['left'] = left_line;
    this.lines['top'] = top_arc;
    this.lines['right'] = right_line;
    this.lines['bottom'] = bottom_arc;

    this.layers[0].activate();
    this.square = new paper.Path.Arc(point_a, point_e, point_c);
    this.square.add(point_c);
    this.square.add(point_d);
    this.square.join(new paper.Path.Arc(point_b, point_f, point_d));
    this.square.add(point_a);
    this.set_events();
    this.layers[1].activate();
};


CircleCell.prototype.get_orientations = function() {
    return ['bottom', 'left', 'top', 'right'];
};


CircleCell.prototype.get_horizontal_orientations = function() {
    return ['left', 'right'];
};


CircleCell.prototype.get_vertical_orientations = function() {
    return ['top', 'bottom'];
};


CircleCell.prototype.get_neighbor_position = function(orientation) {
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

    if (column < 0)
        column = this.columns - 1;

    if (0 <= row && row < this.rows)
            return [row, column % this.columns];
    return [];
};
