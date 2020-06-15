const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { getPlayerColor } = require('./utils/playerColors');
const createBoard = require('./utils/game-board-state');
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);
const { clear, makeTurn, getBoard } = createBoard(20);

io.on('connection', (socket) => {

  const playerColor = getPlayerColor();

  console.log('New Connection');
  let count = io.clients().server.engine.clientsCount;
  let clientIDs = (Object.keys(io.clients().sockets));
  console.log(`${count} connections: ${clientIDs}`);

  socket.emit('message', 'You are connected');
  socket.emit('board', getBoard());

  socket.on('message', (txt) => io.emit('message', txt));
  socket.on('turn', ({ x, y }) => {
    makeTurn(x, y, playerColor);
    io.emit('turn', { x, y, playerColor })
  });
});

server.on('error', (err) => {
  console.error(err);
})

server.listen(PORT, () => {
  const now = new Date();
  console.log('~~~~~~~~~~~\nServer is listening on port ' + PORT + ' @ ' + now);
})