const Reply = require("../models/reply");

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
