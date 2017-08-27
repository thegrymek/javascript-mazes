function draw_moor_maze(grid) {
    let aksjomat = 'XFX+F+XFX';
    let rules = {
        'X': '-YF+XFX+FY-',
        'Y': '+XF-YFY-FX+',
    };

    let rows = 0;
    let columns = 0;
    let start_column = 0;

    let l_iterations = grid.options.l_iterations || 3;
    switch (l_iterations) {
        case 2: start_column = 1; rows = 4; columns = 4; break;
        case 3: start_column = 3; rows = 8; columns = 8; break;
        case 4: start_column = 7; rows = 16; columns = 16; break;
        case 5: start_column = 15; rows = 32; columns = 32; break;
        case 6: start_column = 31; rows = 64; columns = 64; break;
        default: throw new NotImplementedError('Level not implemented');
    }
    update_rows_column(rows, columns);
    grid.redraw();
    grid.draw_lsystem(0, start_column, aksjomat, rules, l_iterations);
}
