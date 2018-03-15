
function createLocation(x, y) {
  return {
    x, y,
    changeBy(dx, dy) {
      return createLocation(this.x + dx, this.y + dy);
    }
  };
}

module.exports = {
  createLocation
};
