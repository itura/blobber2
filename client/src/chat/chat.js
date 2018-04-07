import React, { Component } from 'react'
import { GameState } from '../eventSources/gameState'
import { List } from 'immutable'

function Message ({from, content}) {
  return <li><b>{from}</b>: {content}</li>
}

export class Chat extends Component {

  constructor () {
    super()

    this.state = {
      messages: List(),
      currentMessage: '',
      playerId: null,
      messageCount: 0,
    }
  }

  componentDidMount () {
    this.subs = [GameState.get('initialize').subscribe(this.initialize)]
  }

  componentWillUnmount () {
    this.subs.forEach(s => s.unsubscribe())
  }

  initialize = data => {
    this.setState(prevState => ({
      playerId: data.id,
      messages: prevState.messages.push(<Message key={prevState.messageCount}
                                                 from={'server'}
                                                 content={data.message}/>),
      messageCount: prevState.messageCount + 1
    }))

    this.subs.push(
      GameState.get('chat').subscribe(this.newMessage),
    )
  }

  newMessage = event => {
    this.setState(prevState => {
      return {
        messages: prevState.messages.push(<Message key={prevState.messageCount}
                                                   from={event.from}
                                                   content={event.content}/>),
        messageCount: prevState.messageCount + 1
      }
    })
  }

  submit = event => {
    event.preventDefault()
    console.log('submit', event.target)

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

  render () {
    return (
      <div>
        <ul>
          {this.state.messages}
        </ul>
        <form onSubmit={this.submit}>
          <input type="text"
                 value={this.state.currentMessage}
                 onChange={this.handleChange}/>
        </form>
      </div>
    )
  }
}
