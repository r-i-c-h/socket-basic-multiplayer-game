console.log('Hello Whirlds');

const log = txt => {
  const parent = document.querySelector('#events');
  const el = document.createElement('li');
  el.innerHTML = txt

  parent.appendChild(el);
  parent.scrollTop = parent.scrollHeight;
};

const onChatSubmitted = (sock) => e => {
  e.preventDefault();
  const input = document.querySelector('#chat');
  const txt = input.value
  input.value = '';
  sock.emit('message', txt);
}

(() => {
  const sock = io(); // eslint-disable-line

  sock.on('message', (text) => log(text));


  document
    .querySelector('#chat-form')
    .addEventListener('submit', onChatSubmitted(sock));
})();