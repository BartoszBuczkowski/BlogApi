const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 30,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 100,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 160,
    },
    avatar: {
        type: String,
        defaultd: null,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Users', UserSchema);
