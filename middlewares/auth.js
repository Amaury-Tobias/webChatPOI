'use strict'

const services = require('../services')

function isAuth (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'No tienes autorizacion' })
    }

    let token = req.headers.authorization.split(" ")[1]

    services.decodeToken(token)
        .then(response => {
            next()
        })
        .catch(response => {
            res.status(response.status).send(response.message)
        })

}

module.exports = isAuth