'use strict'

const express = require('express')
const api = express.Router()
const mailMiddleware = require('../middlewares/mail')
const auth = require('../middlewares/auth')
const userCtl = require('../controllers/user')

const multer = require('multer')
const upload = multer({ dest: 'public/profilePictures/' })

api.get('/', auth, (req, res) => {
    res.status(200).send({ message: 'Soy el ROOT' })
})
api.post('/',(req, res) => {
    console.log(req.body)
})

api.get('/send', mailMiddleware, (req, res) => {
    res.status(200).end({ message: 'Correo Enviado' })
})

api.get('/private', auth, (req, res) => {
    res.status(200).send({ message: 'Entraste correctamente' })
})

api.post('/signup', userCtl.signUp)
api.post('/signin', auth, userCtl.signIn)
api.post('/signout', auth, (req, res) => {
    res.status(200).clearCookie('jwtUser', { path: '/' }).send({
        message: 'signedOut'
    })
})


api.post('/upload', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        console.log('no File')
        res.status(500).send({ message: 'error interno' })
    }else{
        console.log(req.file.filename)
        res.status(200).send({ message: 'archivo subido' })
    }
})


module.exports = api