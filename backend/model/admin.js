const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const AdminSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        validator: {
            validator: validator.isEmail,
            message: 'Please provide a valid email'
        }
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
})

AdminSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

AdminSchema.methods.comparePassword = async function (testpassword) {
    const isEqual = await bcrypt.compare(testpassword, this.password)
    return isEqual;
}

module.exports = mongoose.model('Admin', AdminSchema);