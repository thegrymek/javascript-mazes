function Grid(options) {
    this.options = options;
    this.clear();
}

Grid.prototype.clear = function() {
    if (this.interval)
        this.stop();

    paper.project.clear();
    this.layers = [
        new paper.Layer(),  // 0 layer for fill color
        new paper.Layer(),  // 1 layer for lines
        new paper.Layer(),  // 2 layer for text and weights
        new paper.Layer()   // 3 layer for debug
    ];
    this.layers[1].activate();

    this.interval = null;
    this.lines = {};
    this.cells = {};
    this.start_cell = null;
    this.finish_cell = null;
    this.is_colored = false;
    this.is_solved = false;
};


Grid.prototype.start = function(drawing_func) {
    let self = this;
    let timeout = this.options.speed;
    if (timeout < 0) {
        this.stop_drawing = false;
        while(this.stop_drawing === false) {
            drawing_func();
        }
    }
    else {
        let current_time = new Date().getTime();

        function interval_draw() {
            let now = new Date().getTime();
            let diff = (now - current_time);
            let timeout = self.options.speed;

            if (diff > timeout) {
                drawing_func();
                current_time = now;
            }
        }

        this.interval = setInterval(interval_draw, 1);
    }
};


Grid.prototype.stop = function() {
    this.stop_drawing = true;
    if (this.interval)
        clearInterval(this.interval);

};


Grid.prototype.cell = function(x, y) {
    return this.cells[[x, y]];
};


Grid.prototype.map_cells = function(map_function) {
    let rows = this.options['rows'];
    let columns = this.options['columns'];
    for(let row = 0; row < rows; row++)
        for(let column = 0; column < columns; column++) {
            let cell = this.cell(row, column);
            map_function(cell);
        }
};


Grid.prototype.redraw = function() {
    this.clear();
    this.draw_empty_grid();
};


Grid.prototype.add_row = function() {
    this.options.rows += 1;
};


Grid.prototype.remove_row = function() {
    if (this.options.rows > 2)
        this.options.rows -= 1;
};


Grid.prototype.add_column = function() {
    this.options.columns += 1;
};


Grid.prototype.remove_column = function() {
    if (this.options.columns > 2)
        this.options.columns -= 1;
};


Grid.prototype.increase_size = function(size) {
    if (!size) {
        size = 5;
    }
    this.options.size += size;
};


Grid.prototype.decrease_size = function(size) {
    if (!size) {
        size = 5;
    }
    if (this.options.size > 10)
        this.options.size -= size;
};


Grid.prototype.increase_l_iterations = function() {
    if (this.options.l_iterations < 7)
        this.options.l_iterations += 1;
};


Grid.prototype.decrease_l_iterations = function() {
    if (this.options.l_iterations > 2)
        this.options.l_iterations -= 1;
};


Grid.prototype.draw_empty_grid = function() {
    let x = 0;
    let y = 0;
    let size = this.options['size'];
    let rows = this.options['rows'];
    let columns = this.options['columns'];
    let line_color = this.options['line_color'] || 'black';
    let cell_class = this.options['cell'];
    let centered = this.options['centered'];

    if (centered) {
        let total_width = size * columns;
        let total_height = size * rows;
        x = this.options['x'] - (total_width / 2);
        y = this.options['y'] - (total_height / 2);
    } else {
        x = this.options['x'];
        y = this.options['y'];
    }

    let cell_options = {
        x: x,
        y: y,
        row: null,
        column: null,
        rows: rows,
        columns: columns,
        size: size,
        line_color: line_color,
        show_color: this.options.show_color,
        finish_color: this.options.finish_color,
        start_color: this.options.start_color,
        grid_color: this.options.grid_color,
        hide_color: this.options.hide_color,
        highlight_color: this.options.highlight_color,
        layers: this.layers,
        grid: this,
    };

    for(let row = 0; row < rows; row++)
        for(let column = 0; column < columns; column++)
        {
            let index = [row, column];
            cell_options.row = row;
            cell_options.column = column;
            let cell = new cell_class(cell_options);
            cell.draw();
            this.cells[index] = cell;
        }
};


Grid.prototype.set_deafult_cells = function() {
    let start_cell = this.get_start_cell();
    let finish_cell = this.get_finish_cell();
    this.set_start_cell(start_cell);
    this.set_finish_cell(finish_cell);
};


Grid.prototype.show_cell_content = function() {
    function map_function(cell) {
        cell.show_text();
    }
    this.map_cells(map_function);
    this.options.show_cell_content = true;
};


Grid.prototype.hide_cell_content = function() {
    function map_function(cell) {
        cell.hide_text();
    }
    this.map_cells(map_function);
    this.options.show_cell_content = false;
};


Grid.prototype.is_visible_line = function(x, y, orientation) {
    return this.cells[[x, y]].is_visible_line(orientation);
};


Grid.prototype.hide_line = function(x, y, orientation) {
    return this.cells[[x, y]].hide_line(orientation);
};


Grid.prototype.show_line = function(x, y, orientation) {
    return this.cells[[x, y]].show_line(orientation);
};


Grid.prototype.set_start_cell = function(cell) {
    if (this.start_cell && this.start_cell !== this.get_finish_cell())
        this.start_cell.show();
    cell.start();
    this.start_cell = cell;
};

Grid.prototype.get_start_cell = function() {
    return this.start_cell || this.cell(0, 0);
};


Grid.prototype.set_finish_cell = function(cell) {
    if (this.finish_cell && this.finish_cell !== this.get_start_cell())
        this.finish_cell.show();
    cell.finish();
    this.finish_cell = cell;
};


Grid.prototype.get_finish_cell = function() {
    return this.finish_cell || this.cell(this.options.rows - 1, this.options.columns - 1);
};


Grid.prototype.clear_cell_content = function() {
    function map_function(cell) {
        cell.clear_text();
    }
    this.map_cells(map_function);
};


Grid.prototype.clear_board_lines = function(line_color) {
    let self = this;
    function map_function(cell) {
        let cell_on_right = cell.grid.cell(cell.row, cell.column + 1);
        let cell_on_bottom = cell.grid.cell(cell.row + 1, cell.column);
        if (cell_on_right) cell.merge_line(cell_on_right, line_color);
        if (cell_on_bottom) cell.merge_line(cell_on_bottom, line_color);
    }
    this.map_cells(map_function);
};


Grid.prototype.uncolorize = function () {
    let visited_cells = {};

    for(let cell_pos in this.cells) {
        let cell = this.cells[cell_pos];
        cell.show();
        let neighbors = cell.merged_cells.slice();
        for (let neighbor of neighbors) {
            cell.merge_line(neighbor, this.options.show_color);
        }
    }

    this.set_deafult_cells();
};


Grid.prototype.colorize = function(color) {
    let visited_cells = {};
    let current = this.get_start_cell();
    let current_pos = current.position();
    let merged_neighbors = current.merged_cells.slice();

    visited_cells[current_pos] = 0;

    for(let neighbor of merged_neighbors) {
        let neighbor_pos = neighbor.position();
        visited_cells[neighbor_pos] = 1;
    }

    while (merged_neighbors.length > 0) {
        let neighbor = merged_neighbors.shift();
        let neighbor_pos = neighbor.position();
        let neighbor_distance = visited_cells[neighbor_pos];
        let neighbor_cells = neighbor.merged_cells.slice();

        for(let neighbor_neighbor of neighbor_cells) {
            let neighbor_neighbor_pos = neighbor_neighbor.position();
            if (neighbor_neighbor_pos in visited_cells)
                continue;

            visited_cells[neighbor_neighbor_pos] = neighbor_distance + 1;
            merged_neighbors.push(neighbor_neighbor);
        }
    }

    let cell_values = Object.values(visited_cells);
    let max_value = Math.max(...cell_values);

    for(let row = 0; row < this.options['rows']; row++)
        for(let column = 0; column < this.options['columns']; column++)
        {
            let cell = this.cell(row, column);
            let position = [row, column];
            let distance = visited_cells[position] || 0;

            let intensity = 1 - (distance / max_value);
            let dark = Math.floor(255 * intensity);
            let bright = 128 + Math.floor(127 * intensity);

            let cell_color = color;
            if (!cell_color) {
                if (this.options.colorize === 'red') cell_color = rgb(bright, dark, dark);
                if (this.options.colorize === 'green') cell_color = rgb(dark, bright, dark);
                if (this.options.colorize === 'blue') cell_color = rgb(dark, dark, bright);
            }
            cell.fill(cell_color);
            let neighbors = cell.merged_cells.slice();
            for (let neighbor of neighbors) {
                cell.merge_line(neighbor, cell_color);
            }
        }
};


Grid.prototype.draw_lsystem = function(x, y, aksjomat, rules, iterations) {
    let steps = [];
    let self = this;
    let cell = this.cell(x, y);
    let orientations = this.get_orientations();
    let orientation_idx = 0;

    function forward() {
        let orientation = orientations[orientation_idx];
        let neighbor = cell.get_neighbor_by_orientation(orientation);

        if (!neighbor)
            return;

        neighbor.activate();
        steps.push([cell, neighbor]);
        cell = neighbor;
    }

    function turn_left() {
        orientation_idx -= 1;
        if (orientation_idx < 0)
            orientation_idx = orientations.length - 1;

    }

    function turn_right() {
        orientation_idx += 1;
        if (orientation_idx === orientations.length)
            orientation_idx = 0;
    }

    function iter_rule(rule, max_iterations) {
        if (max_iterations === 0) {
            return;
        }

        for (let letter of rule) {
            switch (letter) {
                case 'F': forward(); break;
                case '+': turn_left(); break;
                case '-': turn_right(); break;
                default: {
                    let new_rule = rules[letter];
                    iter_rule(new_rule, max_iterations - 1);
                }
            }
        }
    }


    cell.activate();
    iter_rule(aksjomat, iterations);

    function run() {
        if (steps.length === 0){
            self.stop();
            self.set_deafult_cells();
            set_statistics();
            return;
        }
        let step = steps.shift();
        let cell1 = step[0];
        let cell2 = step[1];

        cell1.show();
        cell2.show();
        cell1.merge(cell2, self.options.show_color);
    }

    this.start(run);
};


Grid.prototype.get_orientations = function() {
    let orientations = new Set();

    // triangle cell has different orientations in some rows
    for (let orientation of this.cell(0, 0).get_orientations())
        orientations.add(orientation);

    for (let orientation of this.cell(0, 1).get_orientations())
        orientations.add(orientation);

    return Array.from(orientations);
};


Grid.prototype.get_statistics = function() {
    return {
        'dead-ends': get_total_dead_ends(this),
        'crossovers': get_total_crossovers(this),
        'horizontals': get_total_horizontal_cells(this),
        'verticals': get_total_vertical_cells(this),
        'longest-path': get_longest_path(this),
        'elbows': get_total_elbows(this),
    };
};


Grid.prototype.show_dead_ends = function() {
    function map_function(cell) {
        if (cell.is_dead_end())
            cell.fill('pink');
    }
    this.map_cells(map_function);
};

Grid.prototype.hide_dead_ends = function() {
    function map_function(cell) {
        if (cell.is_dead_end())
            cell.fill(cell.show_color);
    }
    this.map_cells(map_function);
    this.set_deafult_cells();
};


Grid.prototype.show_longest_path = function() {
    function map_function(cell) {
        if (cell.get('longest-path'))
            cell.fill('pink');
        if (cell.get('longest-path-start'))
            cell.fill(cell.start_color);
        if (cell.get('longest-path-end'))
            cell.fill(cell.finish_color);
    }
    this.map_cells(map_function);
};


Grid.prototype.hide_longest_path = function() {
    function map_function(cell) {
        if (cell.get('longest-path'))
            cell.fill(cell.show_color);
        if (cell.get('longest-path-start'))
            cell.fill(cell.show_color);
        if (cell.get('longest-path-end'))
            cell.fill(cell.show_color);
    }
    this.map_cells(map_function);
    this.set_deafult_cells();
};


Grid.prototype.show_vertical_cells = function() {
    function map_function(cell) {
        if (cell.is_vertical())
            cell.fill('pink');
    }
    this.map_cells(map_function);
};

Grid.prototype.hide_vertical_cells = function() {
    function map_function(cell) {
        if (cell.is_vertical())
            cell.fill(cell.show_color);
    }
    this.map_cells(map_function);
    this.set_deafult_cells();
};


Grid.prototype.show_horizontal_cells = function() {
    function map_function(cell) {
        if (cell.is_horizontal())
            cell.fill('pink');
    }
    this.map_cells(map_function);
};


Grid.prototype.hide_horizontal_cells = function() {
    function map_function(cell) {
        if (cell.is_horizontal())
            cell.fill(cell.show_color);
    }
    this.map_cells(map_function);
    this.set_deafult_cells();
};


Grid.prototype.show_crossovers = function() {
    function map_function(cell) {
        if (cell.is_crossover())
            cell.fill('pink');
    }
    this.map_cells(map_function);
};


Grid.prototype.hide_crossovers = function() {
    function map_function(cell) {
        if (cell.is_crossover())
            cell.fill(cell.show_color);
    }
    this.map_cells(map_function);
    this.set_deafult_cells();
};


Grid.prototype.show_elbows = function() {
    function map_function(cell) {
        if (cell.is_elbow())
            cell.fill('pink');
    }
    this.map_cells(map_function);
};


Grid.prototype.hide_elbows = function() {
    function map_function(cell) {
        if (cell.is_elbow())
            cell.fill(cell.show_color);
    }
    this.map_cells(map_function);
    this.set_deafult_cells();
};
