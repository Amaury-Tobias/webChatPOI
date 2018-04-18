'use strict'

const services = require('../services')

function isAuth (req, res, next) {
    if (!req.cookies.jwtUser) {
        return res.status(403).send({ message: 'No tienes autorizacion' })
    }

    let token = req.cookies.jwtUser

    services.decodeToken(token)
        .then(response => {
            next()
        })
        .catch(response => {
            res.status(response.status).send(response.message)
        })

}

module.exports = isAuth