import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import Player from './Player.js'

const app = express()
const webserver = http.createServer(app)
const io = new Server(webserver, {cors: {origin: '*'}})

const players = []

io.on('connection', function (socket) {
  const player = new Player(socket.id)
  players.push(player)

  socket.emit('connected', player)
  socket.emit('players', players)

  io.emit('joined', player)

  socket.on('disconnect', () =>  {
    const index = players.indexOf(player)

    io.emit('disconnected', player)

    if (index >= 0) players.splice(index, 1)
  })

  /*io.emit('changed:players', players)

  socket.on('disconnect', () => {
    for (let i = 0; i < players.length; i++) {
      if (players[i].socketId != socket.id) {
        continue
      }

      players.splice(i, 1)
      io.emit('changed:players', players)

      break
    }
  })*/

  socket.on('move', (position) => {
    for (const i = 0; i < players.length; i++) {
      if (players[i].socketId != socket.id) {
        continue
      }

      players[i].setPosition(position.x, position.y, position.z)

      break;
    }

    io.emit('changed:players', players)
  })
})

webserver.listen(3000, function() {
  console.log('Server started at port 3000')
})
