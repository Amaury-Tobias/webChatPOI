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
            let leftUser = users.find(item => {
                return item.id === socket.id
            })
            leftUser = users.indexOf(leftUser)
            if (leftUser != -1) {
                users.splice(leftUser, 1)
                io.sockets.emit('usersList', users);
            }
        })
    })
}