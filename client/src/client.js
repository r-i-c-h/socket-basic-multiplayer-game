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

const getBoard = (canvas) => {
  const ctx = canvas.getContext('2d');

  const fillRect = (x, y, color = "lightblue") => {
    const rectSize = 20;
    const halfway = rectSize / 2;
    ctx.fillStyle = color;
    ctx.fillRect(x - halfway, y - halfway, rectSize, rectSize);
  }

  return { fillRect }
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
(() => {

  const sock = io(); // eslint-disable-line
  const canvas = document.querySelector('canvas');
  const { fillRect } = getBoard(canvas);

  const onClick = (e) => {
    const { x, y } = getClickCoordinates(canvas, e);
    // fillRect(x, y);
    sock.emit('turn', { x, y });
  }

  sock.on('message', log); // SHORT FOR sock.on('message', (text) => log(text));
  sock.on('turn', ({ x, y }) => fillRect(x, y));

  canvas.addEventListener('click', onClick);
  document
    .querySelector('#chat-form')
    .addEventListener('submit', onChatSubmitted(sock));
})();