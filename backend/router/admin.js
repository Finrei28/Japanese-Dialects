const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../Middleware/auth')
const {sendEmail, createAdmin, login, logout, registerVerification} = require('../controller/admin');

router.route('/sendEmail').post(authMiddleware, sendEmail)
router.route('/register').post(authMiddleware, createAdmin)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/verification').post(registerVerification)

module.exports = router