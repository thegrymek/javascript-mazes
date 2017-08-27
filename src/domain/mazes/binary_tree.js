function draw_binary_tree_maze(grid) {
    let steps = [];
    let rows = grid.options.rows;
    let columns = grid.options.columns;

    for(let row = 0; row < rows; row++)
        for(let column = 0; column < columns; column++) {
            let cell = grid.cell(row, column);
            let neighbor = null;
            let go_right = random_boolean();

            if (row === 0 && (column + 1) === columns)
                continue;
            else if (row === 0){
                neighbor = grid.cell(row, column + 1);
            }
            else if  ((column + 1) === columns) {
                neighbor = grid.cell(row - 1, column);
            }
            else if (go_right) {
                neighbor = grid.cell(row, column + 1);
            }
            else {
                neighbor = grid.cell(row - 1, column);
            }

            let step = [cell, neighbor];
            steps.push(step);
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
