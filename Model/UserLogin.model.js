const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserLogin = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp:{
        type: Number,
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    validTill:{
        type: Date,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const user = mongoose.model('UserLogin', UserLogin);

module.exports = user;