function draw_peano_maze(grid) {
    let aksjomat = 'X';
    let rules = {
        'X': 'XFYFX+F+YFXFY-F-XFYFX',
        'Y': 'YFXFY-F-XFYFX+F+YFXFY',
    };

    let rows = 0;
    let columns = 0;
    let l_iterations = grid.options.l_iterations || 3;
    switch (l_iterations) {
        case 2: rows = 3; columns = 3; break;
        case 3: rows = 9; columns = 9; break;
        case 4: rows = 27; columns = 27; break;
        case 5: rows = 81; columns = 81; break;
        default: throw new NotImplementedError('Level not implemented');
    }
    update_rows_column(rows, columns);
    grid.redraw();
    grid.draw_lsystem(0, 0, aksjomat, rules, l_iterations);
}
