export default class Player {
    constructor (socketId) {
        this.socketId = socketId
        this.setInitialPosition()
    }

    setInitialPosition () {
        this.setPosition(0, 0, 105)
    }

    setPosition (positionX, positionY, positionZ) {
        this.position = {
            X: positionX,
            Y: positionY,
            Z: positionZ
        }
    }

    getPosition () {
        return this.position
    }
}