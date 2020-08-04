const express = require('express');
const router = express.Router();
const verifyToken = require('../auth/verifyToken');
const Comment = require('../models/Comment');
const Article = require('../models/Article');

router.post('/:articleId', verifyToken, async (req, res) => {
    const comment = new Comment({
        article: req.params.articleId,
        author: req.body.author,
        body: req.body.body,
    });
    try {
        const savedComment = await comment.save();
        const updateArticle = await Article.updateOne(
            { _id: req.params.articleId },
            {
                $push: {
                    comments: `${savedComment._id}`,
                },
            }
        );
        res.json(savedComment);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;
