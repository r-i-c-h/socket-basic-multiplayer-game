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

  const fillRect = (x, y, color) => {
    const halfway = cellSize / 2;
    ctx.fillStyle = color;
    ctx.fillRect(x - halfway, y - halfway, cellSize, cellSize);
  }

  const drawGrid = (color = '#444444') => {
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
  return { fillRect, drawGrid }
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
(() => {

  const sock = io(); // eslint-disable-line
  const canvas = document.querySelector('canvas');
  const { fillRect, drawGrid } = getBoard(canvas);

  const onClick = (e) => {
    const { x, y } = getClickCoordinates(canvas, e);
    // fillRect(x, y);
    sock.emit('turn', { x, y });
  }

  drawGrid();
  sock.on('message', log); // SHORT FOR sock.on('message', (text) => log(text));
  sock.on('turn', ({ x, y, playerColor }) => fillRect(x, y, playerColor));

  canvas.addEventListener('click', onClick);
  document
    .querySelector('#chat-form')
    .addEventListener('submit', onChatSubmitted(sock));
})();