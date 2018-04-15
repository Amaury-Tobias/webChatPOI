'use strict'

var apiSocket = function (io, users) {
    
    io.on('connection', (socket) => {
        socket.on('add user', (data) => {
            //Buscar el data.user en la base de datos para tener su imagen de perfil
            //agregar picture: (resultado de la base de datos) al usuario
            users.push({
                user: data.user,
                id: socket.id,
              })
              io.sockets.emit('usersList', users)
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
                io.sockets.emit('usersList', users)
            }
        })

    })
}

module.exports = apiSocket