const Reply = require("../models/reply");
var nodemailer = require("nodemailer");
require("dotenv").config();

const getReplyById = async (req, res) => {
    const replyId = parseInt(req.params.id);
    try {
        const reply = await Reply.getReplyById(replyId);
        if (!reply) {
            return res.status(404).send("Reply not found");
        }
        res.json(reply);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving reply");
    }
};

const addReply = async (req, res) => {
    const newReply = req.body;

    try {
        var transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.RETHINK_REPLY_EMAIL,
                pass: process.env.RETHINK_REPLY_EMAIL_APP_PASS,
            },
        });

        var mailOptions = {
            from: process.env.RETHINK_REPLY_EMAIL,
            to: newReply.senderEmail,
            subject: "[ReThink] Your message has been replied to!",
            text:
                "Your Message: " +
                newReply.originalMessage +
                "\n" +
                "Staff Reply: " +
                newReply.replyDescription,
        };

        await transporter.sendMail(mailOptions);

        const addedReply = await Reply.addReply(newReply);
        res.status(201).json(addedReply);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding reply");
    }
};

module.exports = {
    getReplyById,
    addReply,
};
