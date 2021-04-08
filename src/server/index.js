const express= require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
      origin: '*',
    }
})

io.on('connection', function (socket) {
    console.log(`Jogador ${socket.id} acabou de se conectar.`)

    socket.emit('connected', 'Conectado com sucesso!')
})

http.listen(3000, function(){
	console.log('listening on *:3000');
})