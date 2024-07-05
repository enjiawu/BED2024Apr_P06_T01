const Joi = require("joi");// Validation schema for user registration

const registerUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).max(100).required(),
    role: Joi.string().valid('librarian', 'member').required()
});

// Validation schema for user login
const loginUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).max(100).required()
});

const validateRegisterUser = (req, res, next) => {
    const { error } = registerUserSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateLoginUser = (req, res, next) => {
    const { error } = loginUserSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {
    validateRegisterUser,
    validateLoginUser
};
