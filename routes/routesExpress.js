'use strict'

const express = require('express')
const api = express.Router()
const mailMiddleware = require('../middlewares/mail')
const auth = require('../middlewares/auth')
const userCtl = require('../controllers/user')

const multer = require('multer')
const upload = multer({ dest: 'public/profilePictures/' })
var path = require('path')

const UserDB = require('../models/User')


api.get('/send', auth, mailMiddleware, (req, res) => {
    res.status(200).end('Correo Enviado')
})

api.get('/registrar', (req, res) => {
    res.sendFile('registrar.html', { root: path.join(__dirname, '../public') })
})

api.post('/signup', upload.single('avatar'), userCtl.signUp)

api.post('/signin', userCtl.signIn)

api.post('/signout', (req, res) => {
    res.status(200).clearCookie('jwtUser', { path: '/' }).send({
        message: 'signedOut'
    })
})


api.get('/v', (req, res) => {
    res.sendFile('video.html', { root: path.join(__dirname, '../public') })

})

api.get('/s', (req, res) => {
    res.sendFile('mail.html', { root: path.join(__dirname, '../public') })
})

api.get('/game', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../public/game') })
})

api.get('/gamification', (req, res) => {
    res.sendFile('gamification.html', { root: path.join(__dirname, '../public') })
})

api.post('/buy', (req, res) => {
    var UpdateA = req.body.avatarBuy
    console.log(UpdateA);
    
    switch (UpdateA) {
        case 'a1':
            UserDB.findOneAndUpdate({ username: req.body.username }, { a1: true }, (err, doc) => {
                if (err) res.status(500).end('ERROR')
                res.status(200).end('COMPRADO')
            })
            break;
        case 'a2':
            UserDB.findOneAndUpdate({ username: req.body.username }, { a2: true }, (err, doc) => {
                if (err) res.status(500).end('ERROR')
                res.status(200).end('COMPRADO')
            })
            break;
        case 'a3':
            UserDB.findOneAndUpdate({ username: req.body.username }, { a3: true }, (err, doc) => {
                if (err) res.status(500).end('ERROR')
                res.status(200).end('COMPRADO')
            })
            break;
        case 'a4':
            UserDB.findOneAndUpdate({ username: req.body.username }, { a4: true }, (err, doc) => {
                if (err) res.status(500).end('ERROR')
                res.status(200).end('COMPRADO')
            })
            break;
        case 'a5':
            UserDB.findOneAndUpdate({ username: req.body.username }, { a5: true }, (err, doc) => {
                if (err) res.status(500).end('ERROR')
                res.status(200).end('COMPRADO')
            })
            break;
        case 'a6':
            UserDB.findOneAndUpdate({ username: req.body.username }, { a6: true }, (err, doc) => {
                if (err) res.status(500).end('ERROR')
                res.status(200).end('COMPRADO')
            })
            break;
        case 'a7':
            UserDB.findOneAndUpdate({ username: req.body.username }, { a7: true }, (err, doc) => {
                if (err) res.status(500).end('ERROR')
                res.status(200).end('COMPRADO')
            })
            break;
        case 'a8':
            UserDB.findOneAndUpdate({ username: req.body.username }, { a8: true }, (err, doc) => {
                if (err) res.status(500).end('ERROR')
                res.status(200).end('COMPRADO')
                console.log(doc)
            })
            break;
        default:
            break;
    }

})

api.post('/equip', (req, res) => {
    UserDB.findOneAndUpdate({ username: req.body.username }, { avatarEquipado: req.body.avatar }, (err, doc) => {
        if (err) res.status(500).end('ERROR')
        res.status(200).end(`Equipado ${req.body.avatar}`)
    })
})



module.exports = api