const sendgridMail = require('@sendgrid/mail');

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendMail(from, to, subject, text, html) {
  sendgridMail.send({
    from,
    to,
    subject,
    text,
    html,
  });
}

module.exports = sendMail;
