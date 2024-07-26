const Joi = require("joi");

const validateReply = (req, res, next) => {
    console.log("TEST");
    const schema = Joi.object({
        submissionId: Joi.number().integer().required(),
        staffId: Joi.number().integer().required(),
        originalMessage: Joi.string().min(3).required(),
        replyDescription: Joi.string().min(3).required(),
        senderEmail: Joi.string().email().required(),
    });

    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({ message: "Validation error", errors });
        return;
    }

    next();
};

module.exports = validateReply;
