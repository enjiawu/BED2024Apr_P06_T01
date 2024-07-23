const Topic = require("../models/communityForumTopics");

// Get all topics
const getAllTopics = async (req, res) => {
    try {
        const topics = await Topic.getAllTopics();
        res.status(200).json(topics);
    } catch (error) {
        console.error('Error in getAllTopics:', error);
        res.status(500).json({error: "Error retrieving topics"});
    }
}

// Get topic by id
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

// Get topic count
const getTopicCount = async (req, res) => {
    try {
        const topicCount = await Topic.getTopicCount();
        res.status(200).json(topicCount);
    } catch (error) {
        console.error('Error in getTopicCount:', error);
        res.status(500).json({error: "Error retrieving topic count"});
    }
}

// Create topic
const createTopic = async (req, res) => {
    const topic = req.body.topic;
    try { 
        const topicExists = await Topic.checkIfTopicExists(topic); // Check if topic already exists
        if (topicExists) {
            return res.status(409).json({ error: "Topic already exists" });
        }
        await Topic.createTopic(topic);
        res.status(201).json(topic);
    } catch (error) {
        console.error('Error in createTopic:', error);
        res.status(500).json({ error: "Error creating topic" });
    }
}

// Update topic
const updateTopic = async (req, res) => {
    const topicId = parseInt(req.params.id);
    const topicName = req.body.topic;
    try {
        const topic = await Topic.updateTopic(topicId, topicName);
        res.status(200).json(topic);
    } catch (error) {
        console.error('Error in updateTopic:', error);
        res.status(500).json({error: "Error updating topic"});
    }
}

// Delete topic
const deleteTopic = async (req, res) => {
    const topicId = parseInt(req.params.id);
    try {
        const success = await Topic.deleteTopic(topicId);
        if (!success) {
            return res.status(404).json({ error: "Topic not found" });
        }
        res.status(200).json({message: "Topic deleted"});
    } catch (error) {
        console.error('Error in deleteTopic:', error);
        res.status(500).json({error: "Error deleting topic"});
    }
}


module.exports = {
    getAllTopics,
    getTopicById,
    getTopicCount,
    createTopic,
    updateTopic,
    deleteTopic
};
