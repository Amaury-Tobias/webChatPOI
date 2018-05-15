'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')

function createToken (user) {    
    let payload = {
        sub: user[0].username,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    }

    return jwt.encode(payload, config.SECRET_TOKEN)
}

function decodeToken (token) {
    let decoded = new Promise ((resolve, reject) => {
        try {
            var payload = jwt.decode(token, config.SECRET_TOKEN)
            if (payload.exp <= moment().unix()) {
                reject({
                    status: 401,
                    message: 'Token expirado'
                })
            }
            resolve(payload)
        } catch (err) {
            reject({
                status: 500,
                message: 'invalid Token'
            })
        }
    })
    return decoded
}

module.exports = {
    createToken,
    decodeToken
}