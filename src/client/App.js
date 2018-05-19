import React, { Component } from 'react'
import { MainPlayer } from './blobs/mainPlayer'
import { GameState } from './gameState'
import { Chat } from './chat/chat'
import './App.css'

class App extends Component {
  render () {
    return (
      <div>
        <MainPlayer />
        <GameState />
        <Chat />
      </div>
    )
  }
}

export default App
