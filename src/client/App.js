import React, { Component } from 'react'
import './App.css'
import { ServerEvents } from './events/serverEvents'
import { MainPlayer } from './blobs/mainPlayer'
import { SmolBlob } from './blobs/blob'
import { Chat } from './chat/chat'
import { Events } from '../shared/events'

class App extends Component {
  constructor () {
    super()

    this.state = {
      blobs: [],
      mainPlayerId: 0
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
      blobs: data.blobs.filter(blob => blob.id !== data.id),
      mainPlayerId: data.id
    }))

    this.subscriptions.push(
      ServerEvents.get(Events.NEW_PLAYER).subscribe(this.addPlayer(data.id)),
      ServerEvents.get(Events.REMOVE_PLAYER)
        .map(event => event.id)
        .subscribe(this.removePlayer))
  }

  addPlayer = id => player => {
    this.setState(prevState => {
      let blobs = prevState.blobs

      if (player.id !== id) {
        blobs.push(player)
      }

      return {blobs}
    })
  }

  removePlayer = id => {
    this.setState(prevState => {
      const blob = prevState.blobs.find(blob => blob.id === id)
      if (blob) {
        const index = prevState.blobs.indexOf(blob)
        prevState.blobs.splice(index, 1)
        return {
          blobs: prevState.blobs
        }
      }
    })
  }

  render () {
    const blobComponents = this.state.blobs.map(blob => (
      <SmolBlob key={blob.id} id={blob.id} location={blob.location} size={blob.size} />
    ))

    return (
      <div>
        <MainPlayer />
        {blobComponents}
        <Chat />
      </div>
    )
  }
}

export default App
