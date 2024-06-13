const CommunityPost = require("../models/communityPost");

async function getPostCount(req, res) {
    try {
        const postCount = await CommunityPost.getPostCount();
        res.json(postCount);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving post count");
    }
}

module.exports = {
    getPostCount,
};
