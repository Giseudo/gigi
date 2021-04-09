import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import Player from './Player.js'

const app = express()
const webserver = http.createServer(app)
const io = new Server(webserver, {cors: {origin: '*'}})

const players = []
io.on('connection', function (socket) {
  
  players.push(new Player(socket.id))
  io.emit('refreshPlayersState', players)

  socket.on('disconnect', () => {
    for (let i = 0; i < players.length; i++) {
      if (players[i].socketId != socket.id) {
        continue
      }

      players.splice(i, 1)
      io.emit('refreshPlayersState', players)

      break
    }
  })

  socket.on('move', (position) => {
    for (const i = 0; i < players.length; i++) {
      if (players[i].socketId != socket.id) {
        continue
      }

      players[i].setPosition(position.X, position.Y, position.Z)

      break;
    }

    io.emit('refreshPlayersState', players)
  })
})

webserver.listen(3000, function() {
  console.log('Server started at port 3000')
})