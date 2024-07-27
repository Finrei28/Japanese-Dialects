const sgMail = require('@sendgrid/mail');

const sendEmail = async (to, subject, html) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to, 
        from: 'miyazakidialect@gmail.com', 
        subject,
        html,
      }
      return await sgMail
        .send(msg)
    }

module.exports = sendEmail