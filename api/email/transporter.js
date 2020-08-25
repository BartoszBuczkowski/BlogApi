const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'firanroom@gmail.com',
           pass: 'Eloelo320'
       }
   });

module.exports = transporter;