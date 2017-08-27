function draw_dfs_maze(grid) {
    let steps = [];
    let path = [];

    let cell = grid.cell(0, 0);
    cell.activate();
    path.push(cell);

    while (path.length > 0) {
        let not_active_neighbors = cell.get_not_active_neighbors();

        if (not_active_neighbors.length > 0) {
            let neighbor = random_choice(not_active_neighbors);
            neighbor.activate();
            path.push(cell);
            path.push(neighbor);
            steps.push(['forward', cell, neighbor]);
            cell = neighbor;
        }
        else {
            let previous = path.pop();
            steps.push(['back', cell, previous]);
            cell = previous;
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
        let move = step[0];
        let cell1 = step[1];
        let cell2 = step[2];

        if (move === 'forward') {
            cell1.highlight();
            cell2.highlight();
            cell1.merge(cell2, grid.options.highlight_color);
        }

        if (move === 'back') {
            cell1.show();
            cell2.show();
            cell1.merge_line(cell2, grid.options.show_color);
        }
    }

    grid.start(run);
}
