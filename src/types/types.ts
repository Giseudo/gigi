import { Vector3 } from 'three'
export type Point = {
  x: number
  y: number
  z: number
}

export type PlayerData = {
  socketId: string
  position: Point
  direction: Vector3
}

export type GameState = {
  players: Array<PlayerData>
}
