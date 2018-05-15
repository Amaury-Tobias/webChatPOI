'use strict'

const User = require('../models/User')
const services = require('../services')


function signUp (req, res) {
    console.log(req.body);
    
    let user = new User({
        username: req.body.username,
        avatar: req.file.filename,
        password: req.body.password,
        gamePoinst: 0
    })

    user.save((err) => {
        if(err) {
            return res.status(500).send({ message: '[FAIL]' })
        }

        return res.status(201)
        .cookie('jwtUser', services.createToken([user]), { expire: new Date() + 9999 })
        .send({ message: '[OK]', token: services.createToken([user]) })
    })
}

function signIn(req, res) {
    
    if (req.body.session == '0') {
        User.find({ username: req.body.username, password: req.body.password }, (err, user) => {
            if (err) return res.status(500).send({ message: err })
            if (!user) return res.status(404).send({ message: 'user not found' })

            res.status(200)
            .cookie('jwtUser', services.createToken(user), { maxAge: 1000*60*60*24*14 })
            .send({ message: '[OK]', token: services.createToken(user), dataUser: user })
        })
    } else if (!req.cookies.jwtUser) {
        return res.status(403).send({ message: 'No tienes token de autorizacion' })
    } else {
        let token = req.cookies.jwtUser
        
        services.decodeToken(token)
        .then(response => {            
            User.find({ username: response.sub }, (err, user) => {
            if (err) return res.status(500).send({ message: err })
            if (!user) return res.status(404).send({ message: 'user not found' })
            
            res.status(200)
            .cookie('jwtUser', services.createToken(user), { expire: new Date() + 9999 })
            .send({ message: '[OK]', token: services.createToken(user), dataUser: user })
            })
        })
        .catch(response => {
            res.status(response.status).send(response.message)
        })
    }
}

module.exports = {
    signUp,
    signIn
}