export default class Player {
  constructor (socketId) {
    this.socketId = socketId
    this.setInitialPosition()
  }

  setInitialPosition (x, y, z) {
    this.setPosition(x, y, z)
  }

  setPosition (x, y, z) {
    this.position = { x, y, z }
  }

  getPosition = () => this.position
}
