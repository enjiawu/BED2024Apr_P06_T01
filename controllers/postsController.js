const Post = require("../models/post");

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving posts");
    }
};

const getPostById = async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
        const post = await Post.getPostById(postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving post");
    }
};

const createPost = async (req, res) => {
    const newPostData = req.body;
    try {
        const createdPost = await Post.createPost(newPostData);
        res.status(201).send(createdPost);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating post");
    }
};

const updatePost = async (req, res) => {
    const newPostData = req.body;
    const postId = parseInt(req.params.id);

    try {
        const post = await Post.updatePost(postId, newPostData);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating post");
    }
};

const deletePost = async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
        const success = await Post.deletePost(postId);
        if (success === -1) {
            return res.status(404).send("Post not found");
        }
        res.status(201).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting post");
    }
};

const searchPosts = async (req, res) => {
    const searchTerm = req.query.searchTerm;
    try {
        const posts = await Post.searchPosts(searchTerm);
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error serching posts");
    }
};

const getPostCount = async (req, res) => {
    try {
        const postCount = await Post.getPostCount();
        res.json(postCount);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving post count");
    }
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    searchPosts,
    getPostCount,
};
