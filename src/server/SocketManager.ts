import * as io from "socket.io"
import { SocketEvent } from "./SocketEvent"

export class SocketManager {

    private socketHandler: io.Server

    constructor(socket: io.Server) {
        this.socketHandler = socket

        this.initConnection()
    }

    initConnection = () => {
        this.socketHandler.on('connection', this.onConnection)
    }

    onConnection = (socket: any) => {
        // Emit connection started.
        console.log("The socket %s has connected.", socket.id)

        // Varre a lista de eventos pré-definidos, e o inicializia chamando um método como callback
        for (const event in SocketEvent) {
            const eventName: string = SocketEvent[event]
            const functionCode: any = this[eventName]
            
            if (functionCode) {
                socket.on(eventName, functionCode)
                continue;
            }

            socket.on(eventName, (data: any) => {
                // Emite globalmente pro projeto lidar com isto.
                this.emmit({
                    who: socket.id,
                    event: eventName,
                    payload: data,
                })
            })
        }
    }

    emmit(data: object) {
        // Emite para o projeto lidar com isto.
        console.log(data);
    }
}