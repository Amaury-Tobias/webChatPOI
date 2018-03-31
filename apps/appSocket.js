'use strict'
const winston = require('winston')

module.exports = function (io, users) {
    io.on('connection', (socket) => {
        socket.on('add user', (data) => {
            winston.info(`newUser: ${data.user}, ${socket.id}`);
            users.push({
                user: data.user,
                id: socket.id
              })
              io.sockets.emit('usersList', users);
        })

        socket.on('new message', (data) => {
            io.to(data.to).emit('new message', {
            username: data.username,
            message: data.message
            })
        })

        socket.on('disconnect', () => {
            winston.info(users)
            users.splice(users.indexOf(socket.id), 1)
            winston.info('-----------')
            winston.info(users)
            io.sockets.emit('usersList', users);
            //winston.info(users);
        });
    })
}