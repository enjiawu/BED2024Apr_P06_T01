const Message = require("../models/message");

const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.getAllMessages();
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving messages");
    }
};

const getMessageById = async (req, res) => {
    const messageId = parseInt(req.params.id);
    try {
        const message = await Message.getMessageById(messageId);
        if (!message) {
            return res.status(404).send("Message not found");
        }
        res.json(message);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving message");
    }
};

const sendMessage = async (req, res) => {
    const newMessage = req.body;
    console.log("Received message data:", newMessage); // Debug: Log received data

    try {
        const sendedMessage = await Message.sendMessage(newMessage);
        res.status(201).json({ id: sendedMessage });
    } catch (error) {
        console.error("Error details:", error);
        res.status(500).send("Error sending message: " + error.message);
    }
};

module.exports = {
    getAllMessages,
    getMessageById,
    sendMessage
};
