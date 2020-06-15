const createBoard = (size) => {

  let board;

  const clear = () => {
    board = Array(size).fill().map(x => Array(size).fill(null))
    // foo = [...Array(size).fill([...Array(size).fill(null)])]
  }

  const makeTurn = (x, y, color) => {
    board[y][x] = color; // yes, it's inverted intentionally
  }

  const getBoard = () => board;

  clear(); // initialize first board.

  return { clear, makeTurn, getBoard }
}

module.exports = createBoard;