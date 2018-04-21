export function createVector (x, y) {
  return {
    x,
    y,
    changeBy (dx, dy) {
      return createVector(this.x + dx, this.y + dy)
    }
  }
}
