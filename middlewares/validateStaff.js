const Joi = require("joi");

// Validation schema for staff registration
const registerStaffSchema = Joi.object({
    staffName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(100).required(),
    role: Joi.string().valid('admin', 'event').required()
});

// Validation schema for staff login
const loginStaffSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(100).required()
});

const validateRegisterStaff = (req, res, next) => {
    const { error } = registerStaffSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateLoginStaff = (req, res, next) => {
    const { error } = loginStaffSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {
    validateRegisterStaff,
    validateLoginStaff
};