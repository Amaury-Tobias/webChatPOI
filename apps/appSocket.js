'use strict'

const UserDB = require('../models/User')

var apiSocket = function (io, users) {

    var videoNSP = io.of('/video')

    io.on('connection', (socket) => {
        io.to(socket.id).emit('test', '200 OK')

        socket.on('add user', (data) => {
            UserDB.find({ username: data.user }, (err, resultUser) => {
                if (err) io.to(socket.id).emit('test', '500 EROR')
                if (!resultUser) io.to(socket.id).emit('test', '404 EROR(User Not Fount')

                if (users.length === 0) {
                    users.push({
                        user: resultUser[0].username,
                        id: socket.id,
                        estado: data.estado,
                        avatar: resultUser[0].avatar,
                        key: data.key
                    })
                } else {
                    let updateUser = users.find(item => {
                        return item.user === data.user
                    })
                    updateUser = users.indexOf(updateUser)
                    if (updateUser != -1) {
                        users.splice(updateUser, 1)
                        users.push({
                            user: resultUser[0].username,
                            id: socket.id,
                            estado: data.estado,
                            avatar: resultUser[0].avatar,
                            key: data.key
                        })
                    } else {
                        users.push({
                            user: resultUser[0].username,
                            id: socket.id,
                            estado: data.estado,
                            avatar: resultUser[0].avatar,
                            key: data.key
                        })
                    }
                }
                io.sockets.emit('usersList', users)
            })
        })

        socket.on('new message', (data) => {
            if (data.to === 'chatAll') {
                socket.broadcast.emit('new message', {
                   username: data.username,
                   message: `${data.message} en general`
               })
            } else {
                io.to(data.to).emit('new message', data)
            }
        })

        socket.on('disconnect', () => {
            let leftUser = users.find(item => {
                return item.id === socket.id
            })
            leftUser = users.indexOf(leftUser)
            if (leftUser != -1) {
                users.splice(leftUser, 1)
                io.sockets.emit('usersList', users)
            }
        })

        socket.on('swift', (data) =>{
            io.sockets.emit('new message', {
                username: data.username,
                message: data.message
            })
            console.log(data);
        })

        socket.on('print', () => {
            console.log('---------------');
            users.forEach(element => {
                console.log(element);
            });
        })
    })

    videoNSP.on('connection', (socket) => {
        
        socket.on('join', (data) => {
            socket.join(data)
        })

        socket.on('stream', (data) => {
            socket.in(data.room).broadcast.emit('frameStream', data)
        })
    })
}

module.exports = apiSocket