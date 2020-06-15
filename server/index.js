const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
  console.log('New Connection');

  socket.emit('message', 'You are connected');

  socket.on('message', (txt) => io.emit('message', txt));
});

server.on('error', (err) => {
  console.error(err);
})

server.listen(PORT, () => {
  const now = new Date();
  console.log('~~~~~~~~~~~\nServer is listening on port ' + PORT + ' @ ' + now);
})