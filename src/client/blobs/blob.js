import React, { Component } from 'react'
import { ServerEvents } from '../eventSources/serverEvents'

export const Vector = {
  create (x = 0, y = 0) {
    return {x, y}
  }
}

export function round (value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
}

const style = function (x, y, zIndex) {
  return {
    position: 'absolute',
    left: x,
    top: y,
    overflow: 'visible',
    padding: 0,
    margin: 0,
    zIndex: zIndex
  }
}

export const Blob = ({location, size, top}) => {
  const baseRadius = (size / 2)
  const strokeWidth = 5

  if (baseRadius <= strokeWidth) {
    return null
  }

  const innerRadius = baseRadius - strokeWidth
  const outerRadius = baseRadius + strokeWidth

  // Adjust the coordinates left and up so that the circle is drawn
  // in the center of the canvas
  const adjustedX = location.x - outerRadius
  const adjustedY = location.y - outerRadius

  const zIndex = top ? 99 : 0

  return (
    <div style={style(adjustedX, adjustedY, zIndex)}>
      <svg width={size} height={size}>
        <circle cx={baseRadius} cy={baseRadius} r={innerRadius} stroke='navy' strokeWidth={strokeWidth} fill='blue' />
      </svg>
    </div>
  )
}

export class SmolBlob extends Component {
  constructor (props) {
    super(props)

    this.state = {
      id: props.id,
      location: props.location,
      size: props.size
    }
  }

  componentDidMount () {
    this.subscriptions = [
      ServerEvents.get('pm', this.state.id)
        .map(event => event.location)
        .subscribe(this.move)
    ]
  }

  componentWillUnMount () {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  move = newLocation => {
    this.setState(prevState => ({
      location: newLocation
    }))
  }

  render () {
    return (
      <Blob location={this.state.location} size={this.state.size} />
    )
  }
}
