import React, { Component } from 'react'
import { ServerEvents } from '../events/serverEvents'
import { Messages } from './messages'
import { UserInput } from '../events/userInput'

const containerStyle = {
  position: 'fixed',
  left: 0,
  bottom: 0,
  zIndex: 998,
  padding: '1em',
  width: '20em',
  fontFamily: 'Tahoma, Geneva, sans-serif',
  fontSize: '14px'
}

const messagesStyle = {
  width: '100%',
  height: '10em',
  overflow: 'hidden'
}

const inputStyle = {
  width: '100%',
  fontFamily: 'Tahoma, Geneva, sans-serif',
  fontSize: '14px',
  marginTop: '1em'
}

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
    this.subs = [ServerEvents.get('init').subscribe(this.initialize)]
  }

  render () {
    return (
      <div style={containerStyle}>
        <div style={messagesStyle}>
          <Messages />
        </div>
        <input ref={this.inputRef}
          style={inputStyle}
          hidden
          type='text'
          value={this.state.currentMessage}
          onChange={this.handleChange} />
      </div>
    )
  }

  componentWillUnmount () {
    this.subs.forEach(s => s.unsubscribe())
  }

  initialize = data => {
    this.setState(prevState => ({
      playerId: data.id
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
        ServerEvents.notify('ch', {
          from: prevState.playerId,
          content: prevState.currentMessage
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
