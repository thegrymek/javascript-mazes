function draw_prim_maze(grid) {
    let rows = grid.options.rows;
    let columns = grid.options.columns;

    let weights = {};
    for(let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            let pos = [row, column];
            let weight = random_range(100);
            let cell = grid.cell(row, column);
            cell.set_text(weight);
            weights[pos] = weight;
        }

    }

    let steps = [];
    let active_cells = [];

    let cell = grid.cell(0, 0);
    cell.activate();
    active_cells.push(cell);

    while (active_cells.length > 0) {
        let lowest_cells = [];
        let lowest_weight = 101;

        //
        // looking for neighbors with minimal weights
        //
        for(let active_cell of active_cells) {
            let neighbors = active_cell.get_not_active_neighbors();

            for(let neighbor of neighbors) {
                let position = [neighbor.row, neighbor.column];
                let weight = weights[position];

                if (lowest_weight > weight) {
                    lowest_weight = weight;
                    lowest_cells = [[active_cell, neighbor]];
                }
                else if (lowest_weight === weight)
                    lowest_cells.push([active_cell, neighbor]);
            }
        }
        if (lowest_cells.length === 0)
            break;

        let cells = random_choice(lowest_cells);
        let cell = cells[0];
        let neighbor = cells[1];
        let not_active_neighbors = neighbor.get_not_active_neighbors();

        neighbor.activate();
        steps.push([cell, neighbor]);

        if (not_active_neighbors.length > 0) {
            active_cells.push(neighbor);
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
