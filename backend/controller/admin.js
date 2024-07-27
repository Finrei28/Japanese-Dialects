const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const Admin = require('../model/admin');
const errors = require('../errors/index');
const { cookieToResponse, sendEmail, sendResetPasswordEmail, hashString } = require('../utils');
const {StatusCodes} = require('http-status-codes');
const crypto = require('crypto');

const verificationCodes = {};
const TwoFACodes = {};

const createAdmin = async (req, res) => {
    const {userName, password, email} = req.body
    const checkUserName = await Admin.findOne({ userName:userName });
    const checkEmail = await Admin.findOne({ email:email });
    if (checkUserName) {
        throw new errors.BadRequestError('This username already exists')
    }
    if (checkEmail) {
        throw new errors.BadRequestError('This email already exists')
    }
    if (userName.length < 5) {
        throw new errors.BadRequestError('Username needs to be at least 5 characters long')
    }

    if (password.length < 8) {
        throw new errors.BadRequestError('Password needs to be at least 8 characters long')
    }
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    verificationCodes[userName] = verificationCode;
    const message = `<p>Your verification code to complete registration is ${verificationCode}</p>`
    const subject = `Account Verification`;
    sendEmail(email, subject, message)
    
    await Admin.create({userName, password, email})
    res.status(StatusCodes.OK).json({msg: "We've sent you a verification code to your email"})
}

const resendVerificationCode = async (req, res) => {
    const {userName} = req.body
    const admin = await Admin.findOne({userName})
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    verificationCodes[userName] = verificationCode;
    const message = `<p>Your verification code to complete registration is ${verificationCode}</p>`
    const subject = `Account Verification`;
    console.log()
    sendEmail(admin.email, subject, message)
    res.status(StatusCodes.OK).json({msg: "Email Resent"})
}

const login = async (req, res) => {
    const {userName, password} = req.body;
    if (!userName | !password) {
        throw new errors.BadRequestError('Please provide username or password');
    }

    const checkAdmin = await Admin.findOne({ userName: userName});
    if (!checkAdmin) {
        throw new errors.UnauthenticatedError('Incorrect username or password');
    }
    const checkPassword = await checkAdmin.comparePassword(password);
    
    if (!checkPassword) {
        throw new errors.UnauthenticatedError('Incorrect username or password')
    }

    if (checkAdmin.isVerified == false) {
        return res.status(401).json({msg: 'notVerified'})
    }

    // const twoFACode = crypto.randomInt(100000, 999999).toString();
    // TwoFACodes[checkAdmin.userName] = twoFACode;
    // const message = `Your 2FA Code to login is ${twoFACode}`
    // sendEmail(checkAdmin.email, message)
    const admin = {adminID: checkAdmin._id, userName: checkAdmin.userName}
    const token = cookieToResponse({ res, admin: admin })
    console.log(token)
    res.status(StatusCodes.OK).json({admin:admin, token:req.signedCookies})
}

const registerVerification = async (req, res) => {
    const { userName, verificationCode} = req.body;
    if (!verificationCode) {
        throw new errors.BadRequestError('Please enter your verification code sent to your email')
    }

    const code = verificationCodes[userName];
    if (code !== verificationCode) {
        throw new errors.UnauthenticatedError('Invalid verification code')
    }
    await Admin.findOneAndUpdate({userName: userName}, {isVerified:true})
    delete verificationCodes[userName];
    res.status(StatusCodes.OK).json({msg: "Account verified"})

}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    res.status(StatusCodes.OK).json('logged out successfully')
}



    const forgotPassword = async (req, res) => {
        const { email } = req.body;
        if (!email) {
            throw new errors.BadRequestError('Please provide a valid email');
        }
        const admin = await Admin.findOne({ email });
        if (admin) {
            const passwordToken = crypto.randomBytes(70).toString('hex');
            
            sendResetPasswordEmail({email: email, token: passwordToken})

            const thirtyMinutes = 1000 * 60 * 30;
            const passwordTokenExpiryDate = new Date(Date.now() + thirtyMinutes);
            
            admin.passwordToken = hashString(passwordToken);
            admin.passwordTokenExpiryDate = passwordTokenExpiryDate;
            await admin.save();
        }

        res.status(StatusCodes.OK).json({msg: "We've sent you a password reset to your email"})
    }

    const resetPassword = async (req, res) => {
        const { token, email, password }  = req.body;
        console.log(token)
        console.log(email)
        console.log(password)
        if (!token || !email || !password ) {
            throw new errors.BadRequestError('Values missing')
        }
        if (password.length < 8) {
            throw new errors.BadRequestError('Password needs to be at least 8 characters long')
        }
        const admin = await Admin.findOne({email});
        if (admin) {
            const today = new Date();
            if (admin.passwordToken === hashString(token) && admin.passwordTokenExpiryDate > today) {
                console.log("true")
                admin.password = password;
                admin.passwordToken = null;
                admin.passwordTokenExpiryDate = null;
                await admin.save();
            }

        }
        res.status(StatusCodes.OK).json({msg: 'Password changed'})
    }

module.exports = {
    sendEmail,
    createAdmin,
    login,
    logout,
    registerVerification,
    forgotPassword,
    resetPassword,
    resendVerificationCode,
}

