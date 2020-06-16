const createBoard = (size) => {

  let board;
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  //** GAME WIN LOGIC: **/

  const inBounds = (x, y) => { // helper
    return y >= 0 && x >= 0 && y < board.length && x < board[y].length
  }

  const numOfCellColorMatches = (x, y, dx, dy) => { // -1 0 1
    let i = 1; // 0 is cell itself
    while (
      inBounds(x + (i * dx), y + (i * dy)) &&
      board[y + (i * dy)][x + (i * dx)] === board[y][x]
    ) {
      i++;
    }
    return i - 1;
  }

  const isWinningTurn = (x, y) => {
    for (let dx = -1; dx < 2; dx++) {
      for (let dy = -1; dy < 2; dy++) {
        if (dx === 0 && dy === 0) {
          continue;
        }
        const count = numOfCellColorMatches(x, y, dx, dy) + numOfCellColorMatches(x, y, -dx, -dy) + 1;
        if (count >= 5) {
          return true;
        }
      }
    }

    return false;
  }

  const clear = () => {
    board = Array(size).fill().map(x => Array(size).fill(null))
    // foo = [...Array(size).fill([...Array(size).fill(null)])]
  }

  const takeTurn = (x, y, color) => {
    board[y][x] = color; // yes, it's inverted intentionally
    return isWinningTurn(x, y);
  }

  const getBoard = () => board;

  clear(); //! IMPORTANT: initializes first board
  return { clear, takeTurn, getBoard }
}

module.exports = createBoard;