export type Point = {
  x: number
  y: number
  z: number
}

export type PlayerData = {
  id: string
  position: Point
}

export type GameState = {
  players: Array<PlayerData>
}
