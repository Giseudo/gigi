import { Vector3 } from 'three'

export type PlayerData = {
  id: string
  position: Vector3
}

export type GameState = {
  players: Array<PlayerData>
}
