import React, { Component } from 'react'
import './App.css'
import { GameState } from './eventSources/gameState'
import { MainPlayer } from './blobs/mainPlayer'
import { SmolBlob } from './blobs/blob'
import { Chat } from './chat/chat'

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
      GameState.get('init').subscribe(this.initialize)
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
      GameState.get('np').subscribe(this.addPlayer(data.id)),
      GameState.get('rv')
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
      <SmolBlob key={blob.id} id={blob.id} location={blob.location} size={blob.size}/>
    ))

    return (
      <div>
        <MainPlayer/>
        {blobComponents}
        <Chat/>
      </div>
    )
  }
}

export default App
