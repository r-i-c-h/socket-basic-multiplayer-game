const log = txt => {
  const parent = document.querySelector('#events');
  const el = document.createElement('li');
  el.innerHTML = txt

  parent.appendChild(el);
  parent.scrollTop = parent.scrollHeight;
};

const onChatSubmitted = (sock) => e => { // keeps socket OUT of Global Scope
  e.preventDefault();
  const input = document.querySelector('#chat');
  const txt = input.value
  input.value = '';
  sock.emit('message', txt);
}

const getClickCoordinates = (elem, e) => {
  const { top, left } = elem.getBoundingClientRect();
  const { clientX, clientY } = e;
  return {
    x: clientX - left,
    y: clientY - top
  }
}

const getBoard = (canvas, numCells = 20) => {
  const ctx = canvas.getContext('2d');
  const rawCellSize = Math.min((canvas.width / numCells), (canvas.height / numCells));
  const cellSize = Math.floor(rawCellSize);

  const getCellCoords = (x, y) => {
    return {
      x: Math.floor(x / cellSize),
      y: Math.floor(y / cellSize),
    }
  }

  // const fillRect = (x, y, color) => {
  //   const halfway = cellSize / 2;
  //   ctx.fillStyle = color;dss
  //   ctx.fillRect(x - halfway, y - halfway, cellSize, cellSize);
  // }
  const fillCell = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  }

  const drawBaseGrid = (color = '#444444') => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let i = 0; i < numCells + 1; i++) {
      ctx.moveTo(i * cellSize, 0); // x-value
      ctx.lineTo(i * cellSize, cellSize * numCells);
      ctx.moveTo(0, i * cellSize); // y-value
      ctx.lineTo(cellSize * numCells, i * cellSize);
    }
    ctx.stroke();
  }

  const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  const renderBoard = (board) => {
    board.forEach((row, yCoord) => {
      row.forEach((playerColor, xCoord) => {
        if (playerColor) { // arr value is NOT null
          fillCell(yCoord, xCoord, playerColor);
        }
      })
    })
  }
  const updateBoard = (board = []) => {
    clearCanvas();
    drawBaseGrid();
    renderBoard(board);
  }
  const reset = () => {
    clearCanvas();
    drawBaseGrid();
  }


  return { fillCell, updateBoard, reset, getCellCoords }
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
(() => {

  const sock = io(); // eslint-disable-line
  const canvas = document.querySelector('canvas');
  const { fillCell, reset, updateBoard, getCellCoords } = getBoard(canvas);

  const onClick = (e) => {
    const { x, y } = getClickCoordinates(canvas, e);
    sock.emit('turn', getCellCoords(x, y));
  }
  const resetClick = e => {
    e.preventDefault();
    sock.emit('newGame', (board) => {
      reset();
      console.log(board);
      updateBoard(board);
    })
  }

  reset();
  sock.on('message', log); // SHORT FOR sock.on('message', (text) => log(text));
  sock.on('board', updateBoard); // shortcut for board => reset(board);
  sock.on('turn', ({ x, y, playerColor }) => fillCell(x, y, playerColor));

  canvas.addEventListener('click', onClick);
  canvas.onselectstart = function () { return false; } // Stops double clicks from highlighting page text

  document
    .querySelector('#reset_button')
    .addEventListener('click', e => resetClick(e));
  document
    .querySelector('#chat-form')
    .addEventListener('submit', onChatSubmitted(sock));
})();