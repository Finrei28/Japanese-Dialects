const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const Admin = require('../model/admin');
const errors = require('../errors/index');
const { cookieToResponse } = require('../utils');
const {StatusCodes} = require('http-status-codes');
const crypto = require('crypto');

const verificationCodes = {};
const TwoFACodes = {};

const createAdmin = async (req, res) => {
    console.log(req.body)
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
    const message = `Your verification code to complete registration is ${verificationCode}`
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: email, // Change to your recipient
        from: 'miyazakidialect@gmail.com', // Change to your verified sender
        subject: 'MiyazakiDialect',
        text: 'You are getting an email from MiyazakiDialect',
        html: message,
      }
      const info = await sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
    console.log(message)
    console.log(email)
    
    await Admin.create({userName, password, email})
    res.status(StatusCodes.OK).json({msg: "We've sent you a verification code to your email"})
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


const sendEmail = async (req, res) => {
    const {email, message} = req.body
    console.log(req.body)
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: email, // Change to your recipient
        from: 'miyazakidialect@gmail.com', // Change to your verified sender
        subject: 'MiyazakiDialect',
        text: 'You are getting an email from MiyazakiDialect',
        html: message,
      }
      const info = await sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
          res.status(200).json({ message: 'Email sent successfully' });
        })
        .catch((error) => {
          console.error(error)
          res.status(500).json({ message: 'Failed to send email' });
        })
    }

module.exports = {
    sendEmail,
    createAdmin,
    login,
    logout,
    registerVerification,
}

