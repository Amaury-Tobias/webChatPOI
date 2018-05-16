'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: { type: String, unique: true, lowercase: true },
    avatar: String,
    password: { type: String, select: false },
    gamePoints: String,
    estado: String,
    avatarEquipado: String,
    a1: Boolean,
    a2: Boolean,
    a3: Boolean,
    a4: Boolean,
    a5: Boolean,
    a6: Boolean,
    a7: Boolean,
    a8: Boolean
})

module.exports = mongoose.model('User', UserSchema)