import React, { Component } from 'react'
import { GameState } from '../eventSources/gameState'
import { Messages } from './messages'
import { UserInput } from '../eventSources/userInput'

export class Chat extends Component {

  constructor () {
    super()

    this.state = {
      currentMessage: '',
      playerId: null
    }

    this.inputRef = React.createRef()
  }

  componentDidMount () {
    this.subs = [GameState.get('initialize').subscribe(this.initialize)]
  }

  render () {
    return (
      <div>
        <Messages/>
        <input ref={this.inputRef}
               hidden={true}
               type="text"
               value={this.state.currentMessage}
               onChange={this.handleChange}/>
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

    this.subs.push(
      UserInput.startTyping().subscribe(this.startTyping),
      UserInput.stopTyping()
        .subscribe(this.submit)
    )
  }

  startTyping = () => {
    this.inputRef.current.hidden = false
    this.inputRef.current.focus()
  }

  submit = () => {
    this.inputRef.current.hidden = true
    this.setState(prevState => {
      let newState = {typing: false}

      if (prevState.currentMessage.length > 0) {
        GameState.notify('chat', {
          from: prevState.playerId,
          content: prevState.currentMessage,
        })

        newState = Object.assign(newState, {currentMessage: ''})
      }

      return newState
    })
  }

  handleChange = event => {
    // setState runs the given callback later, so we have to persist the event
    event.persist()

    this.setState(prevState => {
      let newState = {}

      if (prevState.currentMessage.length <= 140) {
        newState = Object.assign(newState, {
          currentMessage: event.target.value
        })
      }

      return newState
    })
  }
}
