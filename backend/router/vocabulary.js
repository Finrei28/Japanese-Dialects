const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../Middleware/auth')
const {getAllVocabs, addVocab, getTokyoVocab, getMiyazakiVocab} = require('../controller/vocabulary');

router.route('/').get(getAllVocabs).post(authMiddleware, addVocab)
router.route('/getTokyoVocabulary/:vocabulary').get(getTokyoVocab)
router.route('/getMiyazakiVocabulary/:vocabulary').get(getMiyazakiVocab)



module.exports = router