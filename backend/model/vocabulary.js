const mongoose = require('mongoose');
const VocabularySchema = new mongoose.Schema({
    tokyoJapanese: {
        type: String,
        trim: true,
        required: true,
    },
    miyazakiJapanese: {
        type: String,
        trim: true,
        required: true,
    },
})

module.exports = mongoose.model('Vocabulary', VocabularySchema);