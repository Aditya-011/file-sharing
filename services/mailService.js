const nodemailer = require("nodemailer");
module.exports = async({ from, to, subject, text, html }) => {
    const transporter = nodemailer.createTransport({
        service: 'SendinBlue', // no need to set host or port etc.
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASSWORD, // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `cloudShare <${from}>`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });
};