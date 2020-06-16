const makeClickRateLimiter = (delayVal) => {
  let lastUpdateTime = 0;

  return () => {
    let rightNow = Date.now() - lastUpdateTime;
    if (rightNow > delayVal) {
      lastUpdateTime = Date.now();
      return true;
    }
    return false;
  }
}

module.exports = makeClickRateLimiter