import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const webserver = http.createServer(app)
const io = new Server(webserver, {cors: {origin: '*'}})

io.on('connection', function (socket) {
  console.log(`Jogador ${socket.id} acabou de se conectar.`)
  socket.emit('connected', `Você acabou de se conectar com o id ${socket.id}`)
})

webserver.listen(3000, function() {
  console.log('Server started at port 3000')
})