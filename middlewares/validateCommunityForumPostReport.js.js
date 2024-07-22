const Joi = require("joi");

const validateCommunityForumPostReport = (req, res, next) => {
    const schema = Joi.object().keys({
        postId: Joi.number().integer().required(),
        userId: Joi.number().integer().required(),
        reason: Joi.string().trim().required().messages({
            "string.empty": "Reason is required"
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

module.exports = validateCommunityForumPostReport;
