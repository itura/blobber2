export function createVector (x, y) {
  return {
    x,
    y,
    changeBy (dx, dy) {
      return createVector(this.x + dx, this.y + dy)
    }
  }
}

export function round (value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
}
