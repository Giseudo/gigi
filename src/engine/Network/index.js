import socketio from 'socket.io-client'
import { publish } from '@GMessenger'
import { PLAYER_CONNECTED, PLAYERS_CHANGED } from '@GEvents'

export default class Network {
  constructor () {
    this.socket = socketio('http://localhost:3000')

    this.createListeners()
  }

  createListeners() {
    this.socket.on('connected', this.onConnected)
    this.socket.on('changed:players', this.onPlayersChanged)
  }

  onConnected = (player) => {
    publish(PLAYER_CONNECTED, { player })
  }

  onPlayersChanged = (players) => {
    publish(PLAYERS_CHANGED, { players })
  }
}
