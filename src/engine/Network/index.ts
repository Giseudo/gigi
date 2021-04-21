import socketio from 'socket.io-client'
import { Vector3 } from 'three'
import { PlayerEntity } from '@/entities'
import { World, publish } from '@/engine'
import { PLAYER_CONNECTED, PLAYER_DISCONNECTED, PLAYER_JOINED, PLAYERS_INIT } from '@/engine/Messenger/events'

export default class Network {
  socket: any
  players: Array<any> = []
  player: any

  constructor() {
    this.socket = socketio('http://localhost:3000')
  }

  init() {
    this.createListeners()
  }

  destroy() {
    this.unsubscribeListeners()
    this.players = []
    this.player = {}
    this.socket.disconnect()
  }

  createListeners() {
    this.socket.on('connected', this.onConnected)
    this.socket.on('disconnected', this.onDisconnected)
    this.socket.on('joined', this.onJoined)
    this.socket.on('players', this.onPlayersUpdate)
  }

  unsubscribeListeners() {
    // TODO
  }

  onConnected = (data: any) => {
    this.player = data

    publish(PLAYER_CONNECTED, { player: this.player })
  }

  onDisconnected = ({ who }: any) => {
    let disconnectedPlayer

    this.players.forEach((player: any, index: number) => {
      if (player.socketId === who) {
        disconnectedPlayer = player
        this.players.splice(index, 1)
      }
    })

    publish(PLAYER_DISCONNECTED, { player: disconnectedPlayer })
  }
 
  onPlayersUpdate = async (players: any) => {
    // update existing positions
    for (let i = 0; i < players.length; i++) {
      const { socketId, position } = players[i]
      const player = this.players.find(p => p.socketId === socketId)

      if (player) {
        const { x: x1, y: y1, z: z1 } = player.position
        const { x: x2, y: y2, z: z2 } = position
        const initialPosition = new Vector3(x1, y1, z1)
        const finalPosition = new Vector3(x2, y2, z2)

        if (initialPosition.clone().sub(finalPosition).lengthSq() > .1) {
          const direction = initialPosition
          .sub(finalPosition)
          .normalize()

          player.direction = direction
        }

        player.position = position
      } else {
        this.onJoined(players[i])
      }
    }
  }

  async onJoined (player: any) {
    if (player.socketId === this.player.socketId) return

    this.players.push(player)

    publish(PLAYER_JOINED, { player })
  }

  updatePlayerPosition (position: Vector3) {
    this.socket.emit('move', position)
  }
}
