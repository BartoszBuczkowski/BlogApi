const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
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
    confirmed: {
        type: Boolean,
        default: false,
    },
    emailCodeVerify: {
        type: String,
    },
    articles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Article',
        },
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
});

module.exports = mongoose.model('Users', UserSchema);
