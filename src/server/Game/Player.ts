const randomPos = (max: number, min: number) => Math.random() * (max - min + 1) - min

export class Player {
    public socketId: string
    public position = {
        x: 0,
        y: 0,
        z: randomPos(0, 20),
        o: 0
    }

    constructor (socketId: string) {
        this.socketId = socketId
    }
}
