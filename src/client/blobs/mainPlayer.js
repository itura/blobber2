import React, { Component } from 'react'
import { Directions, UserInput } from '../events/userInput'
import { ServerEvents } from '../events/serverEvents'
import { Blob } from './blob'
import { round } from '../../shared/util'
import { createVector } from '../../shared/vector'
import { Events } from '../../shared/events'
import { map } from 'rxjs/operators'

export class MainPlayer extends Component {
  constructor () {
    super()

    this.state = {
      id: 0,
      location: createVector(0, 0),
      lookDir: createVector(0, 0),
      size: 0.0
    }
  }

  componentDidMount () {
    this.subscriptions = [
      ServerEvents.get(Events.INIT).subscribe(this.initialize)
    ]
  }

  componentWillUnmount () {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  initialize = data => {
    this.setState(prevState => ({
      id: data.id,
      location: data.location,
      size: data.size
    }))

    this.subscriptions.push(
      ServerEvents.get(Events.PLAYER_MOVE, data.id).pipe(
        map(event => event.location))
        .subscribe(this.move),
      UserInput.mouseMove$.subscribe(this.mouseHandle(data.id)),
      UserInput.mouseDown$.subscribe(this.clickHandle(data.id)),
      UserInput.keyPress().subscribe(this.handleKeyPress(data.id))
    )
  }
  // User Input Handlers
  handleKeyPress = id => event => {
    const newDirection = createVector(0, 0)
    event.keyCombo().forEach(keyCode => {
      if (keyCode in Directions) {
        newDirection.x = newDirection.x + Directions[keyCode].x
        newDirection.y = newDirection.y + Directions[keyCode].y
      }
    })
    if (newDirection !== this.location) {
      const mag = Math.sqrt((newDirection.x * newDirection.x) + (newDirection.y * newDirection.y))
      newDirection.x = round(newDirection.x / mag, 3)
      newDirection.y = round(newDirection.y / mag, 3)
      ServerEvents.notify(Events.UPDATE_DIRECTION.with({id: id, direction: newDirection}))
    }
  }

  mouseHandle = id => location => {
    const newLookDirection = createVector(0, 0)
    const mag = Math.sqrt((location.x * location.x) + (location.y * location.y))
    newLookDirection.x = round(location.x / mag, 3)
    newLookDirection.y = round(location.y / mag, 3)
    ServerEvents.notify(Events.MOUSE_MOVE.with({id: id, direction: newLookDirection}))
  }

  clickHandle = id => location => {
    // pass
  }

  // Server Command Handlers
  move = newPosition => {
    this.setState(prevState => ({location: newPosition}))
  }

  msg = message => {
    console.log(message)
  }

  render () {
    return (
      <Blob location={this.state.location} size={this.state.size} top />
    )
  }
}
