const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation/auth');
const transporter = require('../email/transporter');
const codeGenerator = require('../utils/codeGenerator');

router.post('/register', async (req, res) => {
    const { error } = registerValidation.validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({ email: req.body.email });

    if (emailExist)
        return res.status(400).json({ message: 'Email already exist!' });

    const emailCodeVerify = codeGenerator(12);

    transporter.sendMail(
        {
            from: 'Firanroom',
            to: req.body.email,
            subject: 'Weryfikacja konta',
            html: `<div>
            <b>Witaj ${req.body.name}</b>
            </div>
            <div>
                <p>Wejdź pod ten adres:</p>
                <a>http://localhost:3001/api/users/${emailCodeVerify}</a>
            </div>`,
        },
        (err) => {
            if (err) return console.log(err);
        }
    );

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const register = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        emailCodeVerify,
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
    if (!user.confirmed)
        return res
            .status(400)
            .json({ message: 'Please confirm your email to login!' });
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

router.get('/:emailToken', async (req, res) => {
    try {
        if (!req.params.emailToken)
            return res.status(404).json({ message: 'Page does not exist!' });

        const user = await User.findOneAndUpdate(
            { emailCodeVerify: req.params.emailToken },
            { confirmed: true }
        );

        res.json({ message: 'Success!' });
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;
