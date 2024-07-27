const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../Middleware/auth')
const {sendEmail, createAdmin, login, logout, registerVerification, forgotPassword, resetPassword, resendVerificationCode} = require('../controller/admin');

router.route('/sendEmail').post(authMiddleware, sendEmail)
router.route('/register').post(authMiddleware, createAdmin)
router.route('/login').post(login)
router.route('/logout').post(authMiddleware, logout)
router.route('/verification').post(registerVerification)
router.route('/forgotPassword').post(forgotPassword)
router.route('/reset-password').post(resetPassword)
router.route('/resendVerificationCode').post(resendVerificationCode)

module.exports = router