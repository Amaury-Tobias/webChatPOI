'use strict'

const express = require('express')
const api = express.Router()

api.get('/', (req, res) => {
    res.status(200).json({ message: "Hola Mundo" })
})
api.post('/', (req, res) => {
    console.log(req.body)
})
api.post('/u', (req, res) => {

})

module.exports = api