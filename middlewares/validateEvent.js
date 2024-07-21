const Joi = require('joi');
const validateEvent = (req, res, next) => {
    const schema = Joi.object({
        userId: Joi.number().required().messages({
            'any.required': 'User ID is required'
        }),
        title: Joi.string().min(3).max(50).required().messages({
            'string.empty': 'Title is required',
            'string.min': 'Title should be at least 3 characters long',
            'string.max': 'Title should not exceed 50 characters'
        }),
        description: Joi.string().min(20).required().messages({
            'string.empty': 'Description is required',
            'string.min': 'Description should be at least 20 characters long'
        }),
        location: Joi.string().min(3).max(50).required().messages({
            'string.empty': 'Location is required',
            'string.min': 'Location should be at least 3 characters long',
            'string.max': 'Location should not exceed 50 characters'
        }),
        startDate: Joi.date().required().messages({
            'date.base': 'Start date is required',
            'any.required': 'Start date is required'
        }),
        startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
            'string.pattern.base': 'Start time must be in HH:mm format',
            'any.required': 'Start time is required'
        }),
        image: Joi.any().optional().messages({
            'any.optional': 'Image is optional'
        }),
        username: Joi.string().optional().messages({
            'string.optional': 'Username is optional'
        }),
        status: Joi.any().optional()
    });

    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({ message: 'Validation error', errors });
        console.log("Validation error:", errors);
        return;
    }

    next();
};

module.exports = validateEvent;