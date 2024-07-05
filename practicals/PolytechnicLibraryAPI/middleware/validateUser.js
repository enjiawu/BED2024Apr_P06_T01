const Joi = require("joi");

const schema = Joi.object({
    username: Joi.string().min(3).max(30).alphanum().required(),
    password: Joi.string().min(8).max(100).required(),
    role: Joi.string().valid('member', 'librarian').required()
});

module.exports = validateUser;