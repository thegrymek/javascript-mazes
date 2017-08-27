function draw_recursive_maze(grid) {
    let steps = [];
    let rows = grid.options.rows;
    let columns = grid.options.columns;

    function show_cells(cell) {
        cell.show();
    }
    grid.map_cells(show_cells);
    grid.clear_board_lines(grid.options.show_color);

    function recursiveDraw(start_row, start_column, end_row, end_column, orientation){
        if (end_row - start_row <= 1 || end_column - start_column <= 1) {
            return;
        }

        let coordinates = [start_row, start_column, end_row, end_column];

        if (orientation === 'horizontal')
        {
            let random_row = random_range(start_row + 1, end_row);
            steps.push([random_row, coordinates, orientation]);

            recursiveDraw(start_row, start_column, random_row, end_column, 'vertical');
            recursiveDraw(random_row, start_column, end_row, end_column, 'vertical');
        }
        else if (orientation === 'vertical')
        {
            let random_column = random_range(start_column + 1, end_column);
            steps.push([random_column, coordinates, orientation]);

            recursiveDraw(start_row, start_column, end_row, random_column, 'horizontal');
            recursiveDraw(start_row, random_column, end_row, end_column, 'horizontal');
        }
    }

    recursiveDraw(0, 0, rows, columns, 'vertical');

    function run() {
        if (steps.length === 0)
        {
            grid.stop();
            grid.set_deafult_cells();
            set_statistics();
            return;
        }
        let step = steps.shift();

        let random = step[0];
        let coordinates = step[1];
        let orientation = step[2];

        let start_row = coordinates[0];
        let start_column = coordinates[1];
        let end_row = coordinates[2];
        let end_column = coordinates[3];

        if (orientation === 'vertical') {
            for (let row = start_row; row < end_row; row++) {
                let cell = grid.cell(row, random);
                let neighbor = grid.cell(row, random - 1);
                if (neighbor)
                    cell.unmerge_line(neighbor, grid.options.line_color);
            }
            let random_row = random_range(start_row, end_row);
            let cell = grid.cell(random_row, random);
            let neighbor = grid.cell(random_row, random - 1);
            if (neighbor)
                cell.merge(neighbor, grid.options.show_color);
        }
        if (orientation === 'horizontal') {
            for (let column = start_column; column < end_column; column++) {
                let cell = grid.cell(random, column);
                let neighbor = grid.cell(random - 1, column);
                if (neighbor)
                    cell.unmerge_line(neighbor, grid.options.line_color);
            }
            let random_column = random_range(start_column, end_column);
            let cell = grid.cell(random, random_column);
            let neighbor = grid.cell(random - 1, random_column);
            if (neighbor)
                cell.merge(neighbor, grid.options.show_color);
        }
    }
    grid.start(run);
}
