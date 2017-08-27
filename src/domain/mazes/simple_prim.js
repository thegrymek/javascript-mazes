function draw_simple_prim_maze(grid) {
    let steps = [];
    let active_cells = [];

    let cell = grid.cell(0, 0);
    cell.activate();
    active_cells.push(cell);

    while (active_cells.length > 0) {
        let index = random_index_choice(active_cells);
        let cell = active_cells[index];
        let not_active_neighbors = cell.get_not_active_neighbors();

        if (not_active_neighbors.length > 0) {
            let neighbor = random_choice(not_active_neighbors);
            neighbor.activate();

            not_active_neighbors = neighbor.get_not_active_neighbors();
            if (not_active_neighbors.length > 0) {
                active_cells.push(neighbor);
            }

            steps.push([cell, neighbor]);
        }
        else {
            active_cells.splice(index, 1);
        }
    }

    function run() {
        if (steps.length === 0){
            grid.stop();
            grid.set_deafult_cells();
            set_statistics();
            return;
        }
        let step = steps.shift();
        let cell1 = step[0];
        let cell2 = step[1];

        cell1.show();
        cell2.show();
        cell1.merge(cell2, grid.options.show_color);
    }

    grid.start(run);
}
