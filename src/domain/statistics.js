function get_total_dead_ends(grid) {
    let total_dead_ends = 0;
    function map_function(cell) {
        if (cell.is_dead_end())
            total_dead_ends += 1;
    }
    grid.map_cells(map_function);
    return total_dead_ends;
}


function get_longest_path(grid) {
    let distances = null;
    let max_distance = 0;
    let start_cell = grid.get_start_cell();
    let cell_max_distance = grid.get_start_cell();

    for(let i = 0; i < 2; i++) {
        grid.set_start_cell(cell_max_distance);
        let new_distances = calculate_distance_dijkstra(grid);
        let new_max_distance = Math.max(...Object.values(new_distances));

        let max_string_cell_positions = Object.keys(
            new_distances
        ).filter(function(key) {
            return new_distances[key] === new_max_distance;
        });


        let cell_position = JSON.parse('[' + max_string_cell_positions[0] + ']');
        cell_max_distance = grid.cell(cell_position[0], cell_position[1]);
        distances = new_distances;
        max_distance = new_max_distance;
    }

    let cell = cell_max_distance;
    let neighbor = null;

    cell.store('longest-path-start', true);
    cell.store('longest-path', true);
    let neighbors = cell.merged_cells.slice();
    let current_value = distances[cell.position()];

    while (neighbors.length > 0 && current_value > 0) {
        neighbor = neighbors.shift();
        let neighbor_pos = neighbor.position();
        let neighbor_value = distances[neighbor_pos];

        if (current_value > neighbor_value) {
            neighbor.store('longest-path', true);
            current_value = neighbor_value;
            neighbors = neighbor.merged_cells.slice();
        }
    }

    neighbor.store('longest-path-end', true);

    grid.set_start_cell(start_cell);
    return max_distance;
}


function get_total_vertical_cells(grid) {
    let total_vertical_cells = 0;
    function map_function(cell) {
        if (cell.is_vertical())
            total_vertical_cells += 1;
    }
    grid.map_cells(map_function);
    return total_vertical_cells;
}

function get_total_horizontal_cells(grid) {
    let total_horizontal_cells = 0;
    function map_function(cell) {
        if (cell.is_horizontal())
            total_horizontal_cells += 1;
    }
    grid.map_cells(map_function);
    return total_horizontal_cells;
}

function get_total_crossovers(grid) {
    let total_crossovers = 0;
    function map_function(cell) {
        if (cell.is_crossover())
            total_crossovers += 1;
    }
    grid.map_cells(map_function);
    return total_crossovers;
}


function get_total_elbows(grid) {
    let total_elbows = 0;
    function map_function(cell) {
        if (cell.is_elbow())
            total_elbows += 1;
    }
    grid.map_cells(map_function);
    return total_elbows;
}
