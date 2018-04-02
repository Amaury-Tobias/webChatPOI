'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const api = require('../routes')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('public'))
app.use('/api', api)

app.use(function (req, res, next) {
  res.status(404).send('Error 404')
})

module.exports = app