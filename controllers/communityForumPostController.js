const Post = require("../models/communityForumPost");


// Getting all posts to display
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving posts");
    }
};

// Getting post by id for the invidiual post page
const getPostById = async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
        const post = await Post.getPostById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found"});
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving post");
    }
};

// Creating the post if the user is logged in
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

// Updating the post if it belongs to the user
const updatePost = async (req, res) => {
    const newPostData = req.body;
    const postId = parseInt(req.params.id);

    try {
        const post = await Post.updatePost(postId, newPostData);
        if (!post) {
            return res.status(404).json({ error: "Post not found"});
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating post");
    }
};

// Deleting the post if it belongs to the user or if its an admin
const deletePost = async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
        const success = await Post.deletePost(postId);
        if (success != 1) {
            return res.status(404).send("Post not found");
        }
        res.status(201).send("Post has been deleted");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting post");
    }
};

// Searching for posts based on the title
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

// Getting all posts by the specific topic
const getPostsByTopic = async (req, res) => {
    const topicId = parseInt(req.params.id);
    try {
        const posts = await Post.getPostsByTopic(topicId);
        if (!posts){
            return res.status(404).json({ error: "No posts found" });
        }
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving posts");
    }
};

// Statistics for Community Forum (Total number of posts and likes)
const getPostCount = async (req, res) => {
    try {
        const postCount = await Post.getPostCount();
        res.json(postCount);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving post count");
    }
};


const getAllLikes = async (req, res) => {
    try {
        const likes = await Post.getAllLikes();
        res.status(200).json(likes);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving total number of likes");
    }
};

// Sorting of posts by likes and date created
const sortPostsByLikesDesc =  async (req, res) => {
    try {
        const posts = await Post.sortPostsByLikesDesc();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error sorting posts by likes");
    }
};

const sortPostsByLikesAsc = async (req, res) => {
    try {
        const posts = await Post.sortPostsByLikesAsc();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error sorting posts by likes");
    }
};

const sortPostsByNewest = async (req, res) => {
    try {
        const posts = await Post.sortPostsByNewest();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error sorting posts by newest");
    }
};

const sortPostsByOldest = async (req, res) => {
    try {
        const posts = await Post.sortPostsByOldest();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error sorting posts by oldest");
    }
};

// To get the top 5 trending topics based on the number of posts per topic
const getTrendingTopics = async (req, res) => {
    try{
        const topicCounts = await Post.getAllTopicCountsByPost();
        topicCounts.sort((a, b) => b.postCount - a.postCount);
        res.json(topicCounts.slice(0, 5));
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving topic counts");
    }
};

// Report post which redirects to admin
const reportPost = async (req, res) => {
    const reportData = req.body;
    try {
        const report = await Post.reportPost(reportData);
        res.status(200).json(report);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error reporting post");
    }
}

// Likes for the post if the 
const likePost = async (req, res) => {
    const postId = parseInt(req.params.id);
    const userId = req.body.userId;
    try {
        // Check if the user has already liked the post
        const existingLike = await Post.getLikeByUser(postId, userId);
        if (existingLike) {
            // If the user has already liked the post, return an error
            return res.status(400).json({ error: "Post already liked" });
        }

        const post = await Post.likePost(postId, userId);
        if (!post) {
            return res.status(404).json({ error: "Post not found"});
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error liking post");
    }
};

const unlikePost = async (req, res) => {
    const postId = parseInt(req.params.id);
    const userId = req.body.userId;
    try {
        // Check if the user has already liked the post
        const existingLike = await Post.getLikeByUser(postId, userId);
        if (!existingLike) {
            // If the user has not liked the post, return an error
            return res.status(400).json({ error: "Post already not liked" });
        }

        const post = await Post.unlikePost(postId, userId);
        if (!post) {
            return res.status(404).json({ error: "Post not found"});
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error unliking post");
    }
}

// Comments
const getCommentsByPost = async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
        const comments = await Post.getCommentsByPost(postId);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving comments");
    }
};

const createComment = async (req, res) => {
    const postId = parseInt(req.params.id);
    const newCommentData = req.body;
    try {
        const createdComment = await Post.createComment(postId, newCommentData);
        res.status(201).send(createdComment);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating comment");
    }
}

const updateComment = async (req, res) => {
    const newCommentData = req.body;
    const commentId = parseInt(req.params.id);
    try {
        const comment = await Post.updateComment(commentId, newCommentData);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found"});
        }
        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating comment");
    }
}

const deleteComment = async (req, res) => {
    const commentId = parseInt(req.params.id);
    try {
        const success = await Post.deleteComment(commentId);
        if (success != 1) {
            return res.status(404).json({"error": "Comment not found"});
        }
        res.status(201).send("Comment has been deleted");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting comment");
    }
}

const reportComment = async (req, res) => {
    const reportData = req.body;
    try {
        const report = await Post.reportComment(reportData);
        res.status(200).json(report);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error reporting comment");
    }
}

const replyToComment = async (req, res) => {
    const commentId = parseInt(req.params.id);
    const newReplyData = req.body;
    try {
        const reply = await Post.replyToComment(commentId, newReplyData);
        res.status(201).send(reply);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error replying to comment");
    }
}

const getRepliesByComment = async (req, res) => {
    const commentId = parseInt(req.params.id);
    try {
        const replies = await Post.getRepliesByComment(commentId);
        if (!replies) {
            // If the user has not liked the post, return an error
            return res.status(400).json({ error: "There are not replies to this comment" });
        }
        res.json(replies);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving replies");
    }
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    searchPosts,
    getPostCount,
    getPostsByTopic,
    getAllLikes,
    sortPostsByLikesDesc,
    sortPostsByLikesAsc,
    sortPostsByNewest,
    sortPostsByOldest,
    getTrendingTopics,
    reportPost,
    likePost,
    unlikePost,
    getCommentsByPost,
    createComment,
    updateComment,
    deleteComment,
    reportComment,
    replyToComment,
    getRepliesByComment
};
