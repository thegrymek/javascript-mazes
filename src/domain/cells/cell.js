function Cell(options) {
    this.options = options;
    this.is_active = false;
    this.storage = {};

    this.line_color = options.line_color;
    this.show_color = options.show_color;
    this.hide_color = options.hide_color;
    this.highlight_color = options.highlight_color;
    this.start_color = options.start_color;
    this.finish_color = options.finish_color;

    this.layers = options.layers;
    this.grid = options.grid;
    this.lines = {};
    this.merged_cells = [];
    this.square = null;

    this.size = options.size;
    this.x = options.x;
    this.y = options.y;
    this.row = options.row;
    this.column = options.column;
    this.rows = options.rows;
    this.columns = options.columns;

    // for debug purpose
    this.text = null;
    this.cx = null;
    this.cy = null;
}


Cell.prototype.draw = function() {
    throw new NotImplementedError('draw');
};
Cell.prototype.get_orientations = function() {
    throw new NotImplementedError('get_orientations');
};
Cell.prototype.get_horizontal_orientations = function() {
    throw new NotImplementedError('get_horizontal_orientations');
};
Cell.prototype.get_vertical_orientations = function() {
    throw new NotImplementedError('get_vertical_orientations');
};
Cell.prototype.get_neighbor_position = function(orientation) {
    throw new NotImplementedError('get_neighbor_position');
};


Cell.prototype.position = function() {
    return [this.row, this.column];
};


Cell.prototype.fill = function(color) {
    let square = this.get_square();
    if (square)
        square.fillColor = color;
};


Cell.prototype.show = function() {
    this.fill(this.show_color);
};


Cell.prototype.hide = function() {
    this.fill(this.hide_color);
};


Cell.prototype.start = function() {
    this.fill(this.start_color);
};


Cell.prototype.finish = function() {
    this.fill(this.finish_color);
};


Cell.prototype.highlight = function() {
    this.fill(this.highlight_color);
};


Cell.prototype.activate = function() {
    this.is_active = true;
};


Cell.prototype.deactivate = function() {
    this.is_active = false;
};


Cell.prototype.color = function() {
    let square = this.get_square();
    if (square)
        return square.fillColor;
};


Cell.prototype.get_line = function(orientation) {
    return this.lines[orientation];
};


Cell.prototype.get_square = function() {
    return this.square;
};


Cell.prototype.is_visible_line = function(orientation) {
    let line = this.get_line(orientation);
    if (line)
        return line.visible && (!line.strokeColor || line.strokeColor.equals(new paper.Color(this.line_color)));
};


Cell.prototype.show_line = function(orientation, line_color) {
    let line = this.get_line(orientation);
    if (line)
        if (line_color)
            line.strokeColor = line_color;
        else
            line.visible = true;
};


Cell.prototype.hide_line = function(orientation, line_color) {
    let line = this.get_line(orientation);
    if (line) {
        if (line_color)
            line.strokeColor = line_color;
        else
            line.visible = false;
    }
};


Cell.prototype.get_neighbor_by_orientation = function(orientation) {
    let pos = this.get_neighbor_position(orientation);
    if (pos.length > 0)
        return this.grid.cell(pos[0], pos[1]);
};


Cell.prototype.get_neighbors = function() {
    let orientations = this.get_orientations();
    let neighbors = [];

    for (let orientation of orientations) {
        let neighbor = this.get_neighbor_by_orientation(orientation);
        if (neighbor)
            neighbors.push(neighbor);
    }

    return neighbors;
};


Cell.prototype.get_not_active_neighbors = function() {
    function not_active(c) {
        return !c.is_active;
    }

    let neighbors = this.get_neighbors();
    return neighbors.filter(not_active);
};


Cell.prototype.get_neighbor_orientation = function(cell) {
    let cell_pos = cell.position();

    for(let orientation of this.get_orientations()) {
        let pos = this.get_neighbor_position(orientation);
        if (arraysEqual(cell_pos, pos)) {
            return orientation;
        }
    }
};


Cell.prototype.unmerge_line = function(cell, line_color) {
    let cell_orientation = this.get_neighbor_orientation(cell);
    let this_orientation = cell.get_neighbor_orientation(this);

    this.show_line(cell_orientation, line_color);
    cell.show_line(this_orientation, line_color);
};


Cell.prototype.merge_line = function(cell, line_color) {
    let cell_orientation = this.get_neighbor_orientation(cell);
    let this_orientation = cell.get_neighbor_orientation(this);

    this.hide_line(cell_orientation, line_color);
    cell.hide_line(this_orientation, line_color);
};


Cell.prototype.merge = function(cell, line_color) {
    this.merge_line(cell, line_color);
    this.merged_cells.push(cell);
    cell.merged_cells.push(this);
};


Cell.prototype.set_text = function(s) {
    if (!this.grid.options.show_cell_content) {
        return;
    }
    if (this.text) {
        this.text.content = s;
    }
    else {
        let left_shift = Math.floor(this.size / 5);
        this.layers[2].activate();
        let p = new Point(this.cx - left_shift, this.cy);
        let text = new paper.PointText(p);
        text.fillColor = 'black';
        text.content = s;
        this.text = text;
        this.layers[1].activate();
    }
};


Cell.prototype.clear_text = function() {
    if (this.text) {
        this.text.content = '';
    }
};


Cell.prototype.show_text = function() {
    if (this.text) {
        this.text.visible = true;
    }
};


Cell.prototype.hide_text = function() {
    if (this.text) {
        this.text.visible = false;
    }
};


Cell.prototype.set_events = function() {
    let self = this;
    this.square.onDoubleClick = function(event) {
        self.grid.set_start_cell(self);
    };

    this.square.onClick = function(event) {
        self.grid.set_finish_cell(self);
    };
};


Cell.prototype.is_crossover = function() {
    return this.merged_cells.length > 2;
};


Cell.prototype.is_elbow = function() {
    let orientations = new Set();

    for(let merged_neighbor of this.merged_cells) {
        let orientation = this.get_neighbor_orientation(merged_neighbor);
        orientations.add(orientation);
    }

    let has_vertical_neighbors = false;
    let has_horizontal_neighbors = false;

    let vertical_orientations = this.get_vertical_orientations();
    let horizontal_orientations = this.get_horizontal_orientations();

    for (let orientation of orientations) {
        if (vertical_orientations.indexOf(orientation) >= 0)
            has_vertical_neighbors = true;
        if (horizontal_orientations.indexOf(orientation) >= 0)
            has_horizontal_neighbors = true;
    }

    return  [...orientations].length === 2 && has_horizontal_neighbors && has_vertical_neighbors;
};


Cell.prototype.is_dead_end = function() {
    return this.merged_cells.length === 1;
};


Cell.prototype.is_horizontal = function() {
    let orientations = this.get_horizontal_orientations();
    for (let orientation of orientations)
        if (!this.is_visible_line(orientation))
            return true;
    return false;
};


Cell.prototype.is_vertical = function() {
    let orientations = this.get_vertical_orientations();
    for (let orientation of orientations)
        if (!this.is_visible_line(orientation))
            return true;
    return false;
};


Cell.prototype.store = function(key, value) {
    this.storage[key] = value;
};


Cell.prototype.get = function(key) {
    return this.storage[key];
};
