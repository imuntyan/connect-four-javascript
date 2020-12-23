
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
        const offset1 = Math.min(rowNum, colNum);
        const offset2 = Math.min(rowNum, COL_NUM - 1 - colNum);
        const win = [
            {rowIter: iter(rowNum, i => i),                     colIter: iter(0, i => i + 1)},
            {rowIter: iter(0, i => i + 1),                colIter: iter(colNum, i => i)},
            {rowIter: iter(rowNum - offset1, i => i + 1), colIter: iter(colNum - offset1, i => i + 1)},
            {rowIter: iter(rowNum - offset2, i => i + 1), colIter: iter(colNum + offset2, i => i - 1)}
        ].some(iters => {
            return checkRow(iters.rowIter, iters.colIter, playerNum);
        });

        if (win) return playerNum;
        else return undefined;
    }

    function* iter(initial, f) {
        let i = initial;
        while (true) {
            yield i;
            i = f(i);
        }
    }

    function checkRow(rowIterator, colIterator, playerNum) {
        let count = 0;
        let row = rowIterator.next().value;
        let col = colIterator.next().value;
        while(row >= 0 && row < ROW_NUM && col >= 0 && col < COL_NUM) {
            if (board[row][col] == playerNum) {
                count += 1;
                if (count == MAX_IN_A_ROW) return true;
            }
            else {
                count = 0;
            }
            row = rowIterator.next().value;
            col = colIterator.next().value;
        }
        return false;
    }

    this.printBoard = function() {
        let str = "";
        for (let rowNum = 0; rowNum < board.length; rowNum++)
            str += JSON.stringify(board[board.length - rowNum - 1]) + "\n"
        return str
    }
}

module.exports = Board;
