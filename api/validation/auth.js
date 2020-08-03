const Joi = require('@hapi/joi');

const registerValidation = Joi.object({
    name: Joi.string().min(6).max(30).required(),
    email: Joi.string().min(6).max(100).required().email(),
    password: Joi.string().min(6).max(160).required(),
});

const loginValidation = Joi.object({
    email: Joi.string().max(100).required().email(),
    password: Joi.string().max(160).required(),
});

module.exports = { registerValidation, loginValidation };
