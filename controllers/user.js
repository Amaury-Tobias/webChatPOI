'use strict'

const service = require('../services')

function signUp (req, res) {
    //DEberia ser con mongoose (internamente debe manejar la contraseña)
    let user = {
        username: req.body.username,
    }

    return res.status(200).send({ 
        message: 'signUped',
        token: service.createToken(user) 
    })
}

function signIn(req, res) {
    //busca en la base DB
    let user = {
        username: req.body.username,
    }

    return res.status(200).send({
        message: 'Te has logeado',
        token: service.createToken(user)
    })
}

module.exports = {
    signUp,
    signIn
}