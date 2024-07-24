const Joi = require("joi");

const validateCommunityForumPost = (req, res, next) => {
    // Make sure all the inputs are valid
    const schema = Joi.object({
        userId: Joi.number().required().messages({
            'any.required': 'User ID is required'
        }),
        title: Joi.string().min(3).max(100).required().messages
        ({
            "string.empty": "Title is required",
            "string.min": "Title should be at least 3 characters long",
            "string.max": "Title should not exceed 100 characters"
        }),
        description: Joi.string().min(20).required().messages({
            "string.empty": "Description is required",
            "string.min": "Description should be at least 20 characters long"
        }),
        topicId: Joi.number().required().messages({
            'any.required': 'Topic ID is required'
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

module.exports = validateCommunityForumPost;
