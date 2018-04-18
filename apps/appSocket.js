'use strict'

var apiSocket = function (io, users) {
    io.on('connection', (socket) => {
        io.to(socket.id).emit('test', '200 OK')

        socket.on('add user', (data) => {
            //Buscar el data.user en la base de datos para tener su imagen de perfil
            //agregar picture: (resultado de la base de datos) al usuario
            if (users.length === 0) {
                users.push({
                    user: data.user,
                    id: socket.id,
                    estado: data.estado
                })
            } else {
                let updateUser = users.find(item => {
                    return item.user === data.user
                })
                updateUser = users.indexOf(updateUser)
                if (updateUser != -1) {
                    users.splice(updateUser, 1)
                    users.push({
                        user: data.user,
                        id: socket.id,
                        estado: data.estado
                    })
                } else {
                    users.push({
                        user: data.user,
                        id: socket.id,
                        estado: data.estado
                    })
                }
            }
            io.sockets.emit('usersList', users)
        })

        socket.on('new message', (data) => {
            if (data.to === 'chatAll') {
                socket.broadcast.emit('new message', {
                   username: data.username,
                   message: data.message
               })
            } else {
                io.to(data.to).emit('new message', {
                    username: data.username,
                    message: data.message
                })
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

        socket.on('swift', data =>{
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
}

module.exports = apiSocket