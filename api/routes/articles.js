const express = require('express');
const router = express.Router();
const verifyToken = require('../auth/verifyToken');
const Article = require('../models/Article');
const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (err) {
        res.json({ message: err });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const article = new Article({
        title: req.body.title,
        description: req.body.description,
        body: req.body.body,
        author: req.body.author,
    });
    try {
        const savedPost = await article.save();
        const updateUser = await User.updateOne(
            { _id: req.body.author },
            {
                $push: {
                    articles: `${savedPost._id}`,
                },
            }
        );
        res.json(savedPost);
    } catch (err) {
        res.json({ message: err });
    }
});

router.get('/:articleId', async (req, res) => {
    try {
        const article = await Article.findById(req.params.articleId).populate(
            'comments'
        );
        res.json(article);
    } catch (err) {
        res.json({ message: err });
    }
});

router.delete('/:articleId', verifyToken, async (req, res) => {
    try {
        const removedArticle = await Article.findByIdAndDelete(
            req.params.articleId
        );
        res.json(removedArticle);
    } catch (err) {
        res.json({ message: err });
    }
});

router.patch('/:articleId', verifyToken, async (req, res) => {
    try {
        const updatedArticle = await Article.findOneAndUpdate(
            req.params.articleId,
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                },
            }
        );
        res.json({ success: 'Article has been updated.' });
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;
