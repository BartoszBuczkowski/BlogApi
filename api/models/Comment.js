const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = Schema({
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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

module.exports = mongoose.model('Comment', CommentSchema);
