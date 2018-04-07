import React, { Component } from 'react'
import { GameState } from '../eventSources/gameState'
import { List } from 'immutable'

function Message ({from, content}) {
  return <li><b>{from}</b>: {content}</li>
}

const listStyle = {
  height: '10em',
  overflow: 'scroll',
}

export class Messages extends Component {

  constructor () {
    super()

    this.state = {
      messages: List(),
      messageCount: 0,
    }

    this.listRef = React.createRef()
  }

  componentDidMount () {
    this.subs = [GameState.get('initialize').subscribe(this.initialize)]
  }

  render () {
    return (
      <ul ref={this.listRef}
          style={listStyle}>
        {this.state.messages}
      </ul>
    )
  }

  componentWillUnmount () {
    this.subs.forEach(s => s.unsubscribe())
  }

  initialize = data => {
    this.setState(prevState => ({
      messages: prevState.messages.push(<Message key={prevState.messageCount}
                                                 from={'server'}
                                                 content={data.message}/>),
      messageCount: prevState.messageCount + 1,
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
        messageCount: prevState.messageCount + 1,
      }
    })
    this.scrollToBottom()
  }

  scrollToBottom = () => {
    const messageList = this.listRef.current;
    const scrollHeight = messageList.scrollHeight
    const height = messageList.clientHeight
    const maxScrollTop = scrollHeight - height
    messageList.scrollTop = maxScrollTop > 0
      ? maxScrollTop
      : 0
  }
}