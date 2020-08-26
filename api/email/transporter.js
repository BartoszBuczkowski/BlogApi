const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: process.env.SERVICE_EMAIL_ADDRESS, 
           pass: process.env.SERVICE_EMAIL_PASSWORD
       }
   });

module.exports = transporter;