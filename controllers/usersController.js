const User = require("../models/user");

const getUsersWithPosts = async (req, res) => {
    try {
        const users = await User.getUsersWithPosts();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching users with posts" });
    }
};

const addPostsToUser = async (req, res) => {
    const newPostData = req.body;
    try {
        const users = await User.addPostsToUser(newPostData);
        if (!users) {
            return res.status(404).send("Could not add posts to user");
        } else if (users === "Post Already Exists") {
            return res.status(404).send("Post already exists");
        }
        res.status(201).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding post to user");
    }
};

const removePostsFromUser = async (req, res) => {
    const newUserData = req.body;
    const postId = parseInt(req.params.id);
    try {
        const users = await User.removePostsFromUser(postId, newUserData);
        if (!users) {
            return res.status(404).send("Could not remove post from user");
        }
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error removing post from user");
    }
};

const getUserCount = async (req, res) => {
    try {
        const userCount = await User.getUserCount();
        res.json(userCount);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving user count");
    }
};

module.exports = {
    getUsersWithPosts,
    addPostsToUser,
    removePostsFromUser,
    getUserCount,
};
