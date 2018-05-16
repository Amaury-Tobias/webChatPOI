'use strict'

const app = require('./apps/appExpress')
const appSocket = require('./apps/appSocket')

const server = require('http').Server(app)
const io = require('socket.io')(server)

const mongoose = require('mongoose')
const config = require('./config')

var users = []

appSocket(io, users)

mongoose.connect(config.db, (err, res) => {
  if (err) {
    return console.log(`Error DB connection ${err}`)
  }
  console.log('Connected to DB')
})


server.listen(config.port, () => {
  console.log(`Servidor corriendo en http://localhost:${config.port}`)
})

