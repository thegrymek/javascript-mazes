function draw_kruskal_maze(grid) {
    let rows = grid.options.rows;
    let columns = grid.options.columns;
    let color = grid.options.show_color;
    let edges = [];
    let sets = {};

    for(let row = 0; row < rows; row++)
        for (let column = 0; column < columns; column++) {
            let cell = grid.cell(row, column);
            for (let orientation of cell.get_orientations())
                if (grid.cell(row, column).get_neighbor_by_orientation(orientation))
                    edges.push([orientation, row, column]);
        }

    edges = shuffle(edges);

    function run() {
        if (edges.length === 0) {
            grid.stop();
            grid.set_deafult_cells();
            set_statistics();
            return;
        }

        let neighbor = null;

        while (!neighbor && edges.length > 0) {
            let edge = edges.pop();
            let orientation = edge[0];
            let row = edge[1];
            let column = edge[2];
            let cell = grid.cell(row, column);
            neighbor = cell.get_neighbor_by_orientation(orientation);

            if (!neighbor)
            {
                neighbor = null;
                continue
            }

            let cell_position = cell.position();
            let neighbor_position = neighbor.position();

            if (!(cell_position in sets))
                sets[cell_position] = new Set([cell_position]);

            if (!(neighbor_position in sets))
                sets[neighbor_position] = new Set([neighbor_position]);

            let set1 = sets[cell_position];
            let set2 = sets[neighbor_position];

            if (set1.difference(set2).size === 0){
                neighbor = null;
                continue;
            }

            set1.add(cell_position);
            set2.add(neighbor_position);

            let set3 = set1.union(set2);

            for(let pos of set3){
                sets[pos] = set3;
                grid.cell(pos[0], pos[1]).fill(color);
            }

            cell.show();
            neighbor.show();
            cell.merge(neighbor, grid.options.show_color);
        }
    }

    grid.start(run);
}
