'use strict'

const service = require('../services')

function signUp (req, res) {    
    //Deberia ser con mongoose (internamente debe manejar la contraseña)
    if (typeof(req.body.username) != 'undefined') {
        let user = {
            username: req.body.username,
        }
        return res.status(200).cookie('jwtUser', service.createToken(user), {expire : new Date() + 9999}).send({ 
            message: '[OK] signUp',
            token: service.createToken(user) 
        })
    } else {
        return res.status(300).send({
            message: '[FAIL]'
        })
    }
}

function signIn(req, res) {
    //busca en la base DB
    
    if (typeof(req.body.username) != 'undefined') {
        let user = {
            username: req.body.username,
        }
        return res.status(200).cookie('jwtUser', service.createToken(user), {expire : new Date() + 9999}).send({
            message: '[OK] signIn',
            token: service.createToken(user)
        })
    } else {
        
    }



}

module.exports = {
    signUp,
    signIn
}