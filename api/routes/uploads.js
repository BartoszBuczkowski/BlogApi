const express = require('express');
const router = express.Router();
const base64Img = require('base64-img');
const verifyToken = require('../auth/verifyToken');
const User = require('../models/User');

router.post('/avatar/:userId', verifyToken, async (req, res) => {
    const avatar = req.body.avatar;

    const name = Date.now();

    try {
        base64Img.img(avatar, './public', name, (err, filepath) => {
            const pathArr = filepath.split('/');
            const fileName = pathArr[pathArr.length - 1];
            return console.log(fileName);
        });

        const updatedUser = await User.updateOne(
            { _id: req.params.userId },
            {
                $set: {
                    avatar: `/public/${name}`,
                },
            }
        );

        res.json({ success: 'User has been updated.' });
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;
