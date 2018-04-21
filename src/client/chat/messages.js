import React, { Component } from 'react'
import { GameState } from '../eventSources/gameState'
import { List } from 'immutable'

const listStyle = {
  width: '100%',
  height: '100%',
  overflowY: 'scroll',
  paddingRight: '17px'
}

const itemStyle = {
  overFlowWrap: 'word-break',
  marginTop: '.2em'
}

function Message ({from, content}) {
  return (
    <div style={itemStyle}>
      <b>{from}</b>: {content}
    </div>
  )
}

export class Messages extends Component {
  constructor () {
    super()

    this.state = {
      messages: List(),
      messageCount: 0
    }

    this.listRef = React.createRef()
  }

  componentDidMount () {
    this.subs = [GameState.get('init').subscribe(this.initialize)]
  }

  render () {
    return (
      <div ref={this.listRef}
        style={listStyle}>
        {this.state.messages}
      </div>
    )
  }

  componentWillUnmount () {
    this.subs.forEach(s => s.unsubscribe())
  }

  initialize = data => {
    this.setState(prevState => ({
      messages: prevState.messages.push(<Message key={prevState.messageCount}
        from={'server'}
        content={data.message} />),
      messageCount: prevState.messageCount + 1
    }))

    this.subs.push(
      GameState.get('ch').subscribe(this.newMessage)
    )
  }

  newMessage = event => {
    this.setState(prevState => {
      return {
        messages: prevState.messages.push(<Message key={prevState.messageCount}
          from={event.from}
          content={event.content} />),
        messageCount: prevState.messageCount + 1
      }
    })
    this.scrollToBottom()
  }

  scrollToBottom = () => {
    const messageList = this.listRef.current
    const scrollHeight = messageList.scrollHeight
    const height = messageList.clientHeight
    const maxScrollTop = scrollHeight - height
    messageList.scrollTop = maxScrollTop > 0
      ? maxScrollTop
      : 0
  }
}
