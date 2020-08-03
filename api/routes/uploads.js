const express = require('express');
const router = express.Router();
const base64Img = require('base64-img');
const verifyToken = require('../auth/verifyToken');
const User = require('../models/User');

router.post('/avatar/:userId', verifyToken, async (req, res) => {
    const { avatar } = req.body;

    try {
        const upload = await base64Img.img(
            avatar,
            './server/public',
            Date.now(),
            async (err, filepath) => {
                const pathArr = filepath.split('/');
                const fileName = pathArr[pathArr.length - 1];

                const updatedUser = await User.findOneAndUpdate(
                    req.params.userId,
                    {
                        $set: {
                            avatar: `/${fileName}`,
                        },
                    }
                );
            }
        );
        res.json({ success: 'User has been updated.' });
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;
