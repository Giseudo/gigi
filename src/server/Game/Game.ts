import { SocketManager } from "../Network/SocketManager"
import { Player } from "./Player"

export class Game {

    public players: Array<Player> = []
    public static observers: Array<any> = []

    constructor() {
        this.initListeners()
    }

    public initListeners(): void {
        SocketManager.subscribe(this.onPlayerConnect)
        SocketManager.subscribe(this.onPlayerDisconnect)
    }

    onPlayerConnect = (payload: any): void => {
        if (payload.event != 'socket.connection') {
            return
        }

        const player: Player = new Player(payload.payload.who)

        this.players.push(player)

        console.log('Jogador %s acabou de se conectar ao servidor.', payload.payload.who)

        this.emmit('socket.connected', {
            who: payload.payload.who,
            to: 'player',
            data: player
        })

        this.emmit('socket.players', {
            who: 'server',
            to: 'all',
            data: this.players
        })
    }

    onPlayerDisconnect = (payload: any): void => {
        if (payload.event != 'socket.disconnect') {
            return
        }

        this.players.forEach((player: Player, index: number) => {
            if (player.socketId != payload.payload.who) {
                return
            }

            this.players.splice(index, 1)
        });

        console.log('Jogador %s acabou de desconectar.', payload.payload.who)
    }

    public emmit(eventName: string, payload: object) {
        const data = {
            event: eventName,
            payload: payload
        }
        
        Game.notifyAll(data)
    }

    public static subscribe(callback: any): void
    {
        Game.observers.push(callback)
    }

    public static notifyAll(command: any): void
    {
        for (const observer of Game.observers) {
            observer(command)
        }
    }
}
