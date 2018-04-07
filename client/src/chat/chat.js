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
        .filter(value => this.state.currentMessage.length > 0)
        .subscribe(this.submit)
    )
  }

  startTyping = () => {
    this.inputRef.current.focus()
  }

  submit = () => {
    this.inputRef.current.blur()
    this.setState(prevState => {
      GameState.notify('chat', {
        from: this.state.playerId,
        content: this.state.currentMessage,
      })

      return {currentMessage: ''}
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
