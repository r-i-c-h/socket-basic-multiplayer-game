const colorsStore = [];
const randomColor = require('randomcolor');


const getPlayerColor = () => {
  const playerColor = randomColor();
  while (colorsStore.find(x => x === playerColor)) {
    playerColor = randomColor();
  }
  return playerColor;
}

module.exports = { getPlayerColor };