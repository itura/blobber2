
function createLocation(x, y) {
  return {
    x, y,
    changeBy(dx, dy) {
      return createLocation(this.x + dx, this.y + dy);
    }
  };
}

function createDirection(x, y) {
  return {
		x, y,
		changeDir(x, y) {
			return createDirection(this.x + dx, this.y + dy);
		}
	};
}

module.exports = {
  createLocation,
  createDirection
};
