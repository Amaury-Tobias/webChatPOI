'use strict'

const express = require('express')
const api = express.Router()
const mailMiddleware = require('../middlewares/mail')
const auth = require('../middlewares/auth')
const userCtl = require('../controllers/user')

const multer = require('multer')
const upload = multer({ dest: 'public/profilePictures/' })
var path = require('path')

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


module.exports = api