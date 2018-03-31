'use strict'

// Requerimiento e inicializacion de modulo EXPRESS
const express = require('express')
const bodyParser = require('body-parser')
const api = require('../routes')
const app = express()

// USES modulo EXPRESS
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('public'))
app.use('/api', api)

app.use(function (req, res, next) {
  res.status(404).send('Error 404')
})



module.exports = app