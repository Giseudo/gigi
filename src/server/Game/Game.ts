import { SocketManager } from "../Network/SocketManager"
import { Player } from "./Player"

export class Game {

    public players: Array<Player> = []
    public static observers: Array<any> = []

    constructor() {
        this.initListeners()
    }

    /**
     * Inicia todos os escutadores de evento do Game.
     *
     * @returns void
     */
    public initListeners(): void {
        SocketManager.subscribe(this.onPlayerConnect)
        SocketManager.subscribe(this.onPlayerDisconnect)
        SocketManager.subscribe(this.onPlayerMove)
    }

    /**
     * Código executado sempre que recebemos um evento de conexão do jogador.
     * 
     * @param payload 
     * @returns void
     */
    public onPlayerConnect = (payload: any): void => {
        if (payload.event != "socket.connection") {
            return
        }

        const player: Player = new Player(payload.payload.who)

        this.players.push(player)

        console.log("Jogador %s acabou de se conectar ao servidor.", payload.payload.who)

        this.emmit("socket.connected", {
            who: payload.payload.who,
            to: "player",
            data: player
        })

        this.emmit("socket.players", {
            who: "server",
            to: "all",
            data: this.players
        })
    }

    /**
     * Código executado sempre que recebemos um evento de desconexão do jogador.
     * 
     * @param payload 
     * @returns void
     */
    public onPlayerDisconnect = (payload: any): void => {
        if (payload.event != "socket.disconnect") {
            return
        }

        this.players.forEach((player: Player, index: number) => {
            if (player.socketId != payload.payload.who) {
                return
            }

            this.players.splice(index, 1)
        })

        console.log("Jogador %s acabou de desconectar.", payload.payload.who)
    }

    /**
     * Código executado sempre que recebemos um evento de movimento do jogador.
     * 
     * @param payload
     * @returns void
     */
    public onPlayerMove = (payload: any): void => {
        if (payload.event != "socket.move") {
            return
        }

        this.players.forEach((player: Player, index: number) => {
            if (player.socketId != payload.payload.who) {
                return
            }

            this.players[index].position = payload.payload.data
        })

        this.emmit("socket.players", {
            who: "server",
            to: "all",
            data: this.players
        })
    }

    /**
     * Emite o evento que foi recebido por parâmetro para todos que estão ouvindo
     * os eventos de Game.
     * 
     * @param eventName 
     * @param payload
     * @returns void
     */
    public emmit(eventName: string, payload: object): void {
        const data = {
            event: eventName,
            payload: payload
        }
        
        Game.notifyAll(data)
    }

    /**
     * Método recebe um callback que deve ser executado sempre que nós executamos
     * disparamos evento. Quem está ouvindo (o callback) deve sempre fazer o
     * tratamento da mensagem para verificar qual mensagem ele quer ouvir.
     * 
     * @param callback 
     * @returns void
     */
    public static subscribe(callback: any): void
    {
        Game.observers.push(callback)
    }

    /**
     * Executa todos os callbacks das entidades que estão nos escutando
     * (e que foram previamente cadastradas). Quem está ouvindo (o callback)
     * deve sempre fazer o tratamento da mensagem para verificar qual mensagem
     * ele quer ouvir.
     * 
     * @param command 
     * @returns void
     */
    public static notifyAll(command: any): void
    {
        for (const observer of Game.observers) {
            observer(command)
        }
    }
}
