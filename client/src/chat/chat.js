import React, { Component } from 'react'
import { GameState } from '../eventSources/gameState'
import { Messages } from './messages'

export class Chat extends Component {

  constructor () {
    super()

    this.state = {
      currentMessage: '',
      playerId: null
    }
  }

  componentDidMount () {
    this.subs = [GameState.get('initialize').subscribe(this.initialize)]
  }

  render () {
    return (
      <div>
        <Messages/>
        <form onSubmit={this.submit}>
          <input type="text"
                 value={this.state.currentMessage}
                 onChange={this.handleChange}/>
        </form>
      </div>
    )
  }

  componentWillUnmount () {
    this.subs.forEach(s => s.unsubscribe())
  }

  initialize = data => {
    this.setState(prevState => ({
      playerId: data.id,
    }))
  }

  submit = event => {
    event.preventDefault()
    // console.log('submit', event.target)

    this.setState(prevState => {
      GameState.notify('chat', {
        from: this.state.playerId,
        content: this.state.currentMessage,
      })

      return {
        currentMessage: '',
      }
    })
  }

  handleChange = event => {
    // setState runs the given callback later, so we have to persist the event
    event.persist()

    this.setState(prevState => {
      return {
        currentMessage: event.target.value,
      }
    })
  }
}
