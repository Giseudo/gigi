export type Point = {
  x: number
  y: number
  z: number
}

export type PlayerData = {
  socketId: string
  position: Point
}

export type GameState = {
  players: Array<PlayerData>
}
