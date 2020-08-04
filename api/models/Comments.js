const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    body: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Comments', CommentSchema);
