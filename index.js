'use strict'

const app = require('./apps/appExpress')
const appSocket = require('./apps/appSocket')

const server = require('http').Server(app)
const io = require('socket.io')(server)

const mongoose = require('mongoose')
const config = require('./config')

var users = []

appSocket(io, users);

/*
io.on('connection', (socket) => {

  socket.on('add user', (data) => {
    winston.info(`User: ${data.user}, ${socket.id}`);
    users.push({
      user: data.user,
      id: socket.id
    });
    socket.emit('login', data);
    socket.broadcast.emit('usersList', users);
  });

  socket.on('new message', (data) => {
    io.to(data.to).emit('new message', {
      username: data.username,
      message: data.message
    });
  });
  

  
  socket.on('callFromTo', (data) =>{
    users.forEach(element => {
      if (element.user == data.callTO) {
        winston.info(`Call from ${data.callFrom} \nto ${element.id}`);
        io.to(element.id).emit('NewCall', data);
      }
    });
  });

  socket.on('stream', (data) => {
    io.emit('frameStream',data);
  });

  socket.on('disconnect', () => {
    users.splice(users.indexOf(socket.id), 1);
    socket.broadcast.emit('usersList', users);
    winston.info(users);
  });
});
*/


/*
mongoose.connect(config.db, (err, res) => {
  if (err) {
    return winston.info(`Error DB connection ${err}`)
  }
  winston.info('Connected to DB')
})
*/

server.listen(config.port, () => {
  console.log(`Servidor corriendo en http://localhost:${config.port}`)
})

