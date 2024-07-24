const Joi = require('joi');

const validateCarbonFootprintAction = (req, res, next) => {
    // Make sure all the inputs are valid
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required().messages({
            'string.empty': 'Title is required',
            'string.min': 'Title should be at least 3 characters long',
            'string.max': 'Title should not exceed 50 characters'
        }),
        description: Joi.string().min(5).required().messages({
            'string.empty': 'Description is required',
            'string.min': 'Description should be at least 5 characters long'
        }),
        grade: Joi.string().required().valid('good', 'average', 'poor').messages({ // Grade should be one of the following: good, average, poor
            'string.empty': 'Grade is required',
        }),
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

module.exports = validateCarbonFootprintAction;