'use strict'

const nodemailer = require('nodemailer-promise')

function createTransport (fromUser, passUser) {
    return new Promise ((resolve, reject) => {
        try {
            let smtpTransport = nodemailer.config({
                host: "smtp.gmail.com",
                auth: {
                    user: fromUser,
                    pass: passUser
                }
            })
            resolve(smtpTransport)
        } catch (error) {
            reject("CreateTransport Error")
        }

    })
}

var sendMail = function (req, res, next) {
    console.log(req.query);
    
    createTransport(req.query.from, req.query.pass)
    .then((Sender) => {
        Sender({
            from: `"${req.query.alias}" <${req.query.from}>`,
            to: req.query.to,
            subject: req.query.subject,
            text: req.query.text,
            html: ""
        })
        .then( (info) => { console.log("Enviado"); next(); })
        .catch( (err) => { console.log("error transport"); res.status(500).end("error Transport");})
    })
    .catch((err) => {
        console.log(err)
        res.status(500).end(err)
    })

}

module.exports = sendMail