import socketio from 'socket.io-client'
import { publish } from '@GMessenger'
import { PLAYER_CONNECTED, PLAYER_DISCONNECTED, PLAYER_JOINED, PLAYERS_INIT } from '@GEvents'

export default class Network {
  constructor () {
    this.socket = socketio('http://localhost:3000')

    this.createListeners()
  }

  createListeners() {
    this.socket.on('connected', this.onConnected)
    this.socket.on('disconnected', this.onDisconnected)
    this.socket.on('joined', this.onJoined)
    this.socket.on('players', this.onPlayersInit)
  }

  onConnected = (player) => {
    publish(PLAYER_CONNECTED, { player })
  }

  onDisconnected = (player) => {
    publish(PLAYER_DISCONNECTED, { player })
  }

  onJoined = (player) => {
    publish(PLAYER_JOINED, { player })
  }
 
  onPlayersInit = (players) => {
    publish(PLAYERS_INIT, { players })
  }
}
