import {createServer, Server} from 'http'
import { Server as io } from 'socket.io'
import { SocketManager } from './SocketManager'

export class SocketServer {

    private serverPort: number = 3000
    private httpConnection: Server
    private socketHandler: io
    private socketManager: SocketManager

    constructor() {
        this.httpConnection = createServer()
        this.socketHandler = new io(this.httpConnection, {cors: {origin: '*'}})
        this.socketManager = new SocketManager(this.socketHandler)
        this.listen()
    }

    private listen(): void {
        this.httpConnection.listen(this.serverPort, () => {
            console.log("Server is opened at port %d", this.serverPort)
        })
    }
}