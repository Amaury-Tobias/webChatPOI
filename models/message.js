'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
    userId: String,
    username: String,
    message: String,
    encoded: Boolean
})


module.exports = mongoose.model('Message', messageSchema)