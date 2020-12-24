
function Board() {

    const MAX_IN_A_ROW = 4;
    const ROW_NUM = 6;
    const COL_NUM = 7;

    // [[1,2,0,0,1,0,1], [1,0,2,0,1,0,1], ..., []]
    let board = []
    for (let i = 0; i < ROW_NUM; i++) {
        const row = new Array(COL_NUM).fill(0);
        board[i] = row;
    }

    // column is in range 0 - (COL_NUM - 1)
    // playerNum is 1 or 2
    this.putToken = function(playerNum, column) {
        if (playerNum != 1 && playerNum != 2) throw new Error("wrong playerNum: " + playerNum);
        if (column < 0 || column >= COL_NUM) throw new Error("wrong column: " + column);
        let rowNum = 0;
        let done = false;
        while (!done) {
            if (rowNum == ROW_NUM) throw new Error("column " + column + " is full");
            const row = board[rowNum];
            if (row[column] != 0) {
                rowNum += 1;
            }
            else {
                row[column] = playerNum;
                done = true;
            }
        }
        return checkWin(playerNum, rowNum, column);
    }

    this.setBoard = function(brd) {
        if (brd.length != ROW_NUM) throw new Error("wrong number of rows");
        if (brd[0].length != COL_NUM) throw new Error("wrong number of columns");
        board = brd;
    }

    function checkWin(playerNum, rowNum, colNum) {
        const incr = i => i + 1;
        const decr = i => i - 1;
        const stay = i => i;
        const win = [
            {
                dir1: iter(rowNum, stay, colNum, incr),
                dir2: iter(rowNum, stay, colNum, decr)},
            {
                dir1: iter(rowNum, incr, colNum, stay),
                dir2: iter(rowNum, decr, colNum, stay)},
            {
                dir1: iter(rowNum, incr, colNum, incr),
                dir2: iter(rowNum, decr, colNum, decr)},
            {
                dir1: iter(rowNum, decr, colNum, incr),
                dir2: iter(rowNum, incr, colNum, decr)}
        ].some(iters => {
            return checkRow(iters, playerNum);
        });

        if (win) return playerNum;
        else return undefined;
    }

    function* iter(rowInit, rowChange, colInit, colChange) {
        let row = rowInit;
        let col = colInit;
        while (true) {
            row = rowChange(row);
            col = colChange(col);
            yield [row, col];
        }
    }

    function checkRow(iters, playerNum) {
        const dir1 = iters.dir1;
        let target = getCount(dir1, playerNum, MAX_IN_A_ROW - 1);
        if (target === 0) return true;
        const dir2 = iters.dir2;
        target = getCount(dir2, playerNum, target);
        if (target === 0) return true;
        return false;
    }

    function getCount(iter, playerNum, target) {
        let count = target;
        while(true) {
            const [row, col] = iter.next().value;
            if (row < 0 || row >= ROW_NUM || col < 0 || col >= COL_NUM)
                return count;
            if (board[row][col] != playerNum)
                return count;
            count -= 1;
            if (count === 0)
                return count;
        }
    }

    this.printBoard = function() {
        let str = "";
        for (let rowNum = 0; rowNum < board.length; rowNum++)
            str += JSON.stringify(board[board.length - rowNum - 1]) + "\n"
        return str
    }
}

module.exports = Board;
