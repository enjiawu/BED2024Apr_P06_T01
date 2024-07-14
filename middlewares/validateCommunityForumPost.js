const Joi = require("joi");

const validateCommunityForumPost = (req, res, next) => {
    const schema = Joi.object({
        userId: Joi.number().required(),
        title: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(20).required(),
        topicId: Joi.number().required()
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
