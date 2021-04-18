import * as io from "socket.io"
import { Game } from "../Game/Game"
import { SocketEvent } from "./SocketEvent"

export class SocketManager {

    public static observers: Array<any> = []
    public sockets: Array<any> = []
    private socketHandler: io.Server

    constructor(socket: io.Server) {
        this.socketHandler = socket

        this.initConnection()
        this.initListeners()
    }

    initConnection = () => {
        this.socketHandler.on('connection', this.onConnection)
    }

    initListeners(): void {
        Game.subscribe(this.sendMessage)
    }

    sendMessage = (payload: any): void => {
        if (payload.event.split(".")[0] != 'socket') {
            return;
        }

        if (payload.payload.to == 'all') {
            this.sendMessageToAll(payload)
        }

        if (payload.payload.to == 'player') {
            this.sendMessageToPlayer(payload)
        }
    }

    sendMessageToAll = (payload: any): void => {
        this.socketHandler.emit(payload.event.split(".")[1], payload.payload.data)
    }

    sendMessageToPlayer = (payload: any): void => {
        const socketId = payload.payload.who

        this.sockets.forEach((socket: any, index: number) => {
            if (socket.id != socketId) {
                return
            }

            socket.emit(payload.event.split(".")[1], payload.payload.data)
        });
    }

    onConnection = (socket: any) => {

        this.sockets.push(socket)

        this.emmit('socket.connection', {
            who: socket.id,
            data: {},
        })

        // Varre a lista de eventos pré-definidos, e o inicializia chamando um método como callback
        for (const event in SocketEvent) {
            const eventName: string = SocketEvent[event]
            const functionCode: any = this[eventName]
            
            if (functionCode) {
                socket.on(eventName, functionCode)
                continue
            }

            socket.on(eventName, (data: any) => {
                // Emite globalmente pro projeto lidar com isto.
                this.emmit(`socket.${eventName}`, {
                    who: socket.id,
                    data: data,
                })
            })
        }
    }

    public emmit(eventName: string, payload: object) {
        const data = {
            event: eventName,
            payload: payload
        }
        
        SocketManager.notifyAll(data)
    }

    public static subscribe(callback: any)
    {
        SocketManager.observers.push(callback)
    }

    public static notifyAll(command: any)
    {
        for (const observer of SocketManager.observers) {
            observer(command)
        }
    }
}
