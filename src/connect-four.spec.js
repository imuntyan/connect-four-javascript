
const Board = require('./connect-four.js')

const board = new Board();

board.setBoard([
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,1,1,1,2,0,0],
    [0,2,1,1,2,0,0],
    [0,1,2,2,1,0,0]
].reverse());

winner = board.putToken(1, 1);
console.log(board.printBoard());
console.log(winner);
