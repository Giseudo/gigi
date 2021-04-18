export class Player {

    public socketId: string
    public position = {
        x: 0,
        y: 0,
        z: 10,
        o: 0
    }

    constructor (socketId: string) {
        this.socketId = socketId
    }
}
