function calculate_distance_dijkstra(grid, steps) {
    function push_step(type, cell, text) {
        let step = {
            'type': type,
            'cell': cell,
            'text': text,
        };
        steps.push(step);
    }

    let cell_distance = {};
    let cell = grid.get_start_cell();
    let cell_pos = cell.position();
    let cell_neighbors = cell.merged_cells.slice();

    cell_distance[cell_pos] = 0;

    if (steps) push_step('highlight', cell);
    if (steps) push_step('text', cell, 0);

    for(let neighbor of cell_neighbors) {
        let neighbor_pos = neighbor.position();
        cell_distance[neighbor_pos] = 1;
        if (steps) push_step('text', neighbor, 1);
    }

    while (cell_neighbors.length > 0) {
        let neighbor = cell_neighbors.shift();
        let neighbor_pos = neighbor.position();
        let neighbor_val = cell_distance[neighbor_pos];
        let neighbor_cells = neighbor.merged_cells.slice();

        if (steps) push_step('highlight', neighbor);

        for(let neighbor_neighbor of neighbor_cells) {
            let neighbor_neighbor_pos = neighbor_neighbor.position();
            if (neighbor_neighbor_pos in cell_distance)
                continue;

            let new_value = neighbor_val + 1;

            cell_distance[neighbor_neighbor_pos] = new_value;
            cell_neighbors.push(neighbor_neighbor);

            if (steps) push_step('text', neighbor_neighbor, new_value);
        }
    }
    return cell_distance;
}


function solve_dijkstra(grid) {
    let steps = [];
    function push_step(type, cell, text) {
        let step = {
            'type': type,
            'cell': cell,
            'text': text,
        };
        steps.push(step);
    }

    let cell_distance = calculate_distance_dijkstra(grid, steps);

    let finish_cell = grid.get_finish_cell();
    let finish_cell_pos = finish_cell.position();
    let current_value = cell_distance[finish_cell_pos];
    let neighbors = finish_cell.merged_cells.slice();

    push_step('solve', finish_cell);

    while (neighbors.length > 0 && current_value > 0) {
        let neighbor = neighbors.shift();
        let neighbor_pos = neighbor.position();
        let neighbor_value = cell_distance[neighbor_pos];

        if (current_value > neighbor_value) {
            current_value = neighbor_value;
            neighbors = neighbor.merged_cells.slice();
            push_step('solve', neighbor);
        }
    }

    let current_highlight = grid.get_start_cell();
    current_highlight.highlight();
    let current_solve = null;

    function run() {
        if (steps.length === 0){
            current_highlight.show();
            grid.stop();
            grid.set_deafult_cells();
            return;
        }

        let step = steps.shift();
        let cell = step.cell;

        if (step.type === 'text') {
            cell.set_text(step.text);
        }
        else if (step.type === 'highlight') {
            cell.highlight();
            current_highlight.show();
            cell.merge_line(current_highlight, grid.options.show_color);
            current_highlight = cell;
        }
        else if (step.type === 'solve') {
            cell.highlight();
            if (current_solve)
                current_solve.merge_line(cell, grid.options.highlight_color);
            current_solve = cell;
        }
    }

    grid.clear_cell_content();
    grid.start(run);
}
