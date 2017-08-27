paper.install(window);


// singleton for keeping grid alive
mazeGrid = null;

function set_statistics(){
    let statistics = mazeGrid.get_statistics();
    $('#statistics-dead-ends').html(statistics['dead-ends']);
    $('#statistics-longest-path').html(statistics['longest-path']);
    $('#statistics-crossovers').html(statistics['crossovers']);
    $('#statistics-horizontal-cells').html(statistics['horizontals']);
    $('#statistics-vertical-cells').html(statistics['verticals']);
    $('#statistics-elbows').html(statistics['elbows']);
}

function update_rows_column(rows, columns) {
    mazeGrid.options.rows = rows;
    mazeGrid.options.columns = columns;
    $('#options-rows').html(mazeGrid.options.rows);
    $('#options-columns').html(mazeGrid.options.columns);
}


window.onload = function() {
    paper.setup('canvas');

    let cell = SquareCell;
    let current_maze_function = draw_dfs_maze;
    let current_solve_function = solve_dijkstra;
    let window_height = $(document).height();
    let window_width = $(document).width();
    let panel_width = 510;
    let grid_width = window_width - panel_width;

    let grid_options = {
        'x': panel_width + (grid_width / 2),
        'y': window_height / 2,
        'centered': true,
        'rows': 15,
        'columns': 15,
        'size': 20,
        'speed': -1,
        'l_iterations': 3,
        'cell': cell,
        'show_color': "#fedd8a",
        'finish_color': "#3e8d8a",
        'start_color': "#30d18a",
        'grid_color': "#fedd8a",
        'hide_color': "#fff",
        'highlight_color': "#00fd8a",
        'line_color': "#000",
        'longest_path_color': '#f41',
        'colorize': 'green',
        'show_cell_content': true,
    };

    mazeGrid = new Grid(grid_options);
    mazeGrid.redraw();
    mazeGrid.show_cell_content();

    $('#options-l-system').html(mazeGrid.options.l_iterations - 1);
    $('#options-rows').html(mazeGrid.options.rows);
    $('#options-columns').html(mazeGrid.options.columns);
    $('#options-size').html(mazeGrid.options.size + ' px');
    $('#options-speed').html(mazeGrid.options.speed + ' ms');

    $("#button-draw").click(function() {
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });

    $("#button-clear").click(function() {
        mazeGrid.redraw();
    });

    $("#button-solve").click(function() {
        if (mazeGrid.is_solved) {
            mazeGrid.uncolorize();
            mazeGrid.clear_cell_content();
            mazeGrid.is_solved = false;
        }
        else {
            current_solve_function(mazeGrid);
            mazeGrid.is_solved = true;
        }
    });

    $("#button-colorize").click(function() {
        if (mazeGrid.is_colored) {
            mazeGrid.uncolorize();
            mazeGrid.is_colored = false;
        }
        else {
            mazeGrid.colorize();
            mazeGrid.is_colored = true;
        }
    });

    $("#button-add-lsystem-iterations").click(function() {
        mazeGrid.increase_l_iterations();
        $('#options-l-system').html(mazeGrid.options.l_iterations - 1);
    });

    $("#button-remove-lsystem-iterations").click(function() {
        mazeGrid.decrease_l_iterations();
        $('#options-l-system').html(mazeGrid.options.l_iterations - 1);
    });

    $("#button-add-row").click(function() {
        mazeGrid.add_row();
        mazeGrid.redraw();
        $('#options-rows').html(mazeGrid.options.rows);
    });

    $("#button-remove-row").click(function() {
        mazeGrid.remove_row();
        mazeGrid.redraw();
        $('#options-rows').html(mazeGrid.options.rows);
    });

    $("#button-add-column").click(function() {
        mazeGrid.add_column();
        mazeGrid.redraw();
        $('#options-columns').html(mazeGrid.options.columns);
    });

    $("#button-remove-column").click(function() {
        mazeGrid.remove_column();
        mazeGrid.redraw();
        $('#options-columns').html(mazeGrid.options.columns);
    });

    $("#button-bigger-grid").click(function() {
        mazeGrid.increase_size();
        mazeGrid.redraw();
        $('#options-size').html(mazeGrid.options.size + ' px');
    });

    $("#button-smaller-grid").click(function() {
        mazeGrid.decrease_size();
        mazeGrid.redraw();
        $('#options-size').html(mazeGrid.options.size + ' px');
    });

    $("#button-more-speed").click(function() {
        if (mazeGrid.options.speed > -1)
        {
            mazeGrid.options.speed -= 25;
            mazeGrid.options.speed = Math.max(...[mazeGrid.options.speed, -1]);
            $('#options-speed').html(mazeGrid.options.speed + ' ms');
        }
    });

    $("#button-less-speed").click(function() {
        if (mazeGrid.options.speed === -1)
            mazeGrid.options.speed = 1;
        else
            mazeGrid.options.speed += 25;
        $('#options-speed').html(mazeGrid.options.speed + ' ms');
    });

    $("#menu-show-dead-ends").change(function() {
        let checked = $(this).prop('checked');
        if (checked)
            mazeGrid.show_dead_ends();
        else
            mazeGrid.hide_dead_ends();
    });

    $("#menu-show-longest-path").change(function() {
        let checked = $(this).prop('checked');
        if (checked)
            mazeGrid.show_longest_path();
        else
            mazeGrid.hide_longest_path();
    });

    $("#menu-show-vertical-cells").change(function() {
        let checked = $(this).prop('checked');
        if (checked)
            mazeGrid.show_vertical_cells();
        else
            mazeGrid.hide_vertical_cells();
    });

    $("#menu-show-horizontal-cells").change(function() {
        let checked = $(this).prop('checked');
        if (checked)
            mazeGrid.show_horizontal_cells();
        else
            mazeGrid.hide_horizontal_cells();
    });

    $("#menu-show-crossovers").change(function() {
        let checked = $(this).prop('checked');
        if (checked)
            mazeGrid.show_crossovers();
        else
            mazeGrid.hide_crossovers();
    });

    $("#menu-show-elbows").change(function() {
        let checked = $(this).prop('checked');
        if (checked)
            mazeGrid.show_elbows();
        else
            mazeGrid.hide_elbows();
    });

    $("#menu-maze-binary-tree").click(function() {
        current_maze_function = draw_binary_tree_maze;
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });

    $("#menu-maze-sidewinder").click(function() {
        current_maze_function = draw_sidewinder_maze;
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });

    $("#menu-maze-dfs").click(function() {
        current_maze_function = draw_dfs_maze;
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });

    $("#menu-maze-kruskal").click(function() {
        current_maze_function = draw_kruskal_maze;
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });

    $("#menu-maze-recursive").click(function() {
        current_maze_function = draw_recursive_maze;
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });

    $("#menu-maze-simple-prim").click(function() {
        current_maze_function = draw_simple_prim_maze;
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });

    $("#menu-maze-prim").click(function() {
        current_maze_function = draw_prim_maze;
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });

    $("#menu-maze-peano").click(function() {
        current_maze_function = draw_peano_maze;
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });

    $("#menu-maze-moor").click(function() {
        current_maze_function = draw_moor_maze;
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });

    $("#menu-maze-hilbert").click(function() {
        current_maze_function = draw_hilbert_maze;
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });

    $("#menu-figure-triangle").click(function() {
        mazeGrid.options.cell = TriangleCell;
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });

    $("#menu-figure-square").click(function() {
        mazeGrid.options.cell = SquareCell;
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });

    $("#menu-figure-hexagon").click(function() {
        mazeGrid.options.cell = HexCell;
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });

    $("#menu-figure-octagon").click(function() {
        mazeGrid.options.cell = OctagonCell;
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });

    $("#menu-figure-upsilon").click(function() {
        mazeGrid.options.cell = UpsilonCell;
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });

    $("#menu-figure-circle").click(function() {
        mazeGrid.options.cell = CircleCell;
        mazeGrid.redraw();
        current_maze_function(mazeGrid);
    });


    $("#menu-solve-dijkstra").click(function() {
        current_solve_function = solve_dijkstra;
    });

    $("#menu-color-red").click(function() {
        mazeGrid.options.colorize = 'red';
    });

    $("#menu-color-green").click(function() {
        mazeGrid.options.colorize = 'green';
    });

    $("#menu-color-blue").click(function() {
        mazeGrid.options.colorize = 'blue';
    });

    $("#menu-show-cell-text").change(function() {
        let checked = $(this).prop('checked');
        if (checked)
            mazeGrid.show_cell_content();
        else
            mazeGrid.hide_cell_content();
    });


    current_maze_function(mazeGrid);
};
