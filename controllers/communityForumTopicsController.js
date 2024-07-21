const Topic = require("../models/communityForumTopics");

const getAllTopics = async (req, res) => {
    try {
        const topics = await Topic.getAllTopics();
        res.status(200).json(topics);
    } catch (error) {
        console.error('Error in getAllTopics:', error);
        res.status(500).json({error: "Error retrieving topics"});
    }
}

const getTopicById = async (req, res) => {
    const topicId = parseInt(req.params.id);
    try {
        const topic = await Topic.getTopicById(topicId);
        if (!topic) {
            return res.status(404).json({ error: "Topic not found"});
        }
        res.status(200).json(topic);
    } catch (error) {
        console.error('Error in getTopicById:', error);
        res.status(500).json({error: "Error retrieving topic"});
    }
}

const getTopicCount = async (req, res) => {
    try {
        const topicCount = await Topic.getTopicCount();
        res.status(200).json(topicCount);
    } catch (error) {
        console.error('Error in getTopicCount:', error);
        res.status(500).json({error: "Error retrieving topic count"});
    }
}

module.exports = {
    getAllTopics,
    getTopicById,
    getTopicCount
};
