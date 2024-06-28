const Topic = require("../models/communityForumTopics");

const getAllTopics = async (req, res) => {
    try {
        const topics = await Topic.getAllTopics();
        res.status(200).json(topics);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving topics");
    }
}

const getTopicById = async (req, res) => {
    const topicId = parseInt(req.params.id);
    try {
        const topic = await Topic.getTopicById(topicId);
        if (!topic) {
            return res.status(404).send("Topic not found");
        }
        res.json(topic);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving topic");
    }
}

const getTopicCount = async (req, res) => {
    try {
        const topicCount = await Topic.getTopicCount();
        res.json(topicCount);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving topic count");
    }
}

module.exports = {
    getAllTopics,
    getTopicById,
    getTopicCount
};
