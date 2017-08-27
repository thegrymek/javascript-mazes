function draw_sidewinder_maze(grid) {
    let steps = [];
    let rows = grid.options.rows;
    let columns = grid.options.columns;

    for(let row = 0; row < rows; row++) {
        let start = 0;

        for (let column = 0; column < columns; column++) {
            let cell = grid.cell(row, column);
            let do_passage = (row === 0) || random_boolean();

            if (do_passage && (column + 1) < columns) {
                let neighbor = grid.cell(row, column+1);
                let step = [cell, neighbor];
                steps.push(step);
            }
            else if (row > 0) {
                let random_column = random_range(start, column);
                let cell1 = grid.cell(row-1, random_column);
                let cell2 = grid.cell(row, random_column);

                steps.push([cell1, cell2]);
                start = column + 1;
            }
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
