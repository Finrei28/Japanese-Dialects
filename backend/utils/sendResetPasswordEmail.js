const sendEmail = require('./sendEmail');

const sendResetPasswordEmail = async ({ email, token }) => {
    const URL = `${process.env.FRONTEND}/admin/resetPassword?token=${token}&email=${email}`;
    const message = `<p>Please click the following link to reset your password: <a href="${URL}">Reset Password</a></p>`;
    const subject = "Reset Password"
    return sendEmail(email, subject, message);
}

module.exports = sendResetPasswordEmail