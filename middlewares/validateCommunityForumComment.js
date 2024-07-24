const Joi = require("joi");

const validateCommunityForumComment = (req, res, next) => {
    // Make sure all the inputs are valid
    const schema = Joi.object({
        userId: Joi.number().required().messages({
            'any.required': 'User ID is required'
        }),
        description: Joi.string().min(1).required().messages({
            "string.empty": "Description is required",
            "string.min": "Description should be at least 1 characters long"
        }),
    });

    const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message); //Errors are extracteed and formatted into an array of messages
        res.status(400).json({ message: "Validation error", errors });
        return; // Terminate middleware execution on validation error
    }

    next(); // If validation passes, proceed to the next route handler
};

module.exports = validateCommunityForumComment;
