'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: { type: String, unique: true, lowercase: true },
    avatar: String,
    password: { type: String, select: false },
    gamePoints: Number,
    estado: String
})

module.exports = mongoose.model('User', UserSchema)