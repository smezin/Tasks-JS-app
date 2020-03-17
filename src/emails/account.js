const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'smezin@gmail.com',
        subject: 'Welcome to the best task manager in the universe',
        text: `Welcome to the app ${name}! \n We are happy to have you!`
        //html: (optional)
    })
}
const sendByebyeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'smezin@gmail.com',
        subject: 'Sorry to see you leave',
        text: `${name} why did you leave???`,
    })
}



module.exports = {
    sendWelcomeEmail: sendWelcomeEmail,
    sendByebyeMail: sendByebyeMail
}
