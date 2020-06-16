
const logCountOfUsersOnServer = (clients) => {
  let count = clients.server.engine.clientsCount;
  let clientIDs = (Object.keys(clients.sockets));
  console.log(`${count} connections: ${clientIDs}`);
  return
}

module.exports = { logCountOfUsersOnServer }