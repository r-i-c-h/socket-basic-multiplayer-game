const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { getPlayerColor } = require('./utils/playerColors');
const { logCountOfUsersOnServer } = require('./utils/server-status-utils');
const createBoard = require('./utils/game-board-state');
const makeClickRateLimiter = require('./utils/click-limiter');

const PORT = process.env.PORT || 5000;
const BOARD_SIZE = 20;


const app = express();
app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);
const { clear, takeTurn, getBoard } = createBoard(BOARD_SIZE);

io.on('connection', (socket) => {

  console.log('New Connection');
  logCountOfUsersOnServer(io.clients());

  const playerColor = getPlayerColor();



  socket.emit('message', `You are connected @ ${Date.now()}. You are to be known as ${playerColor}.`);
  socket.emit('board', getBoard());

  socket.on('newGame', (_) => {
    clear();
    console.log('%c New Game Request', 'color:green; background:black; font-size:22px;');
    io.emit('board', getBoard());
  });

  socket.on('message', (txt) => io.emit('message', txt));
  socket.on('turn', ({ x, y }) => {
    if (clickRateLimit()) {
      const playerWon = takeTurn(x, y, playerColor);
      io.emit('turn', { x, y, playerColor })

      if (playerWon) {
        socket.emit('message', 'You Win!');
        io.emit('message', `${playerColor} Won! Play Again?`);
      }
    }
  });
});

server.on('error', (err) => {
  console.error(err);
})

server.listen(PORT, () => {
  const now = new Date();
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nServer is listening on port ' + PORT + ' @ ' + now);
})