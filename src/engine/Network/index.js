import socketio from 'socket.io-client'

export default class Network {
    constructor () {
        this.socket = socketio('http://localhost:3000')

        this.createListeners()
    }

    createListeners() {
        this.socket.on('connected', this.onConnected)
    }

    onConnected = (message) => {
        console.log(this.socket)
    }
}