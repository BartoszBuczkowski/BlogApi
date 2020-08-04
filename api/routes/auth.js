const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation/auth');

router.post('/register', async (req, res) => {
    const { error } = registerValidation.validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist)
        return res.status(400).json({ message: 'Email already exist!' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const register = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    try {
        const savedUser = await register.save();
        res.json({ user: savedUser._id });
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation.validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).json({
            message: `Email doesn't exist!`,
        });
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
        return res.status(400).json({ message: 'Invalid password!' });

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;
