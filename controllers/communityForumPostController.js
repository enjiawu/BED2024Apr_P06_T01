const Post = require("../models/communityForumPost");

// Getting all posts to display with pagination
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error retrieving posts"});
    }
};

// Getting post by id for the invidiual post page
const getPostById = async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
        const post = await Post.getPostById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error retrieving posts"});
    }
};

// Creating the post if the user is logged in
const createPost = async (req, res) => {
    const newPostData = req.body;
    try {
        const createdPost = await Post.createPost(newPostData);

        res.status(201).json(createdPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error creating post"});
    }
};

// Updating the post if it belongs to the user
const updatePost = async (req, res) => {
    const newPostData = req.body;
    const postId = parseInt(req.params.id);

    try {
        const post = await Post.updatePost(postId, newPostData);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error updating post"});
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
        res.status(201).json("Post has been deleted");
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error deleting posts"});
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
        res.status(500).json({error: "Error searching posts"});
    }
};

// Getting all posts by the specific topic
const getPostsByTopic = async (req, res) => {
    const topicId = parseInt(req.params.id);
    try {
        const posts = await Post.getPostsByTopic(topicId);
        if (!posts) {
            return res.status(404).json({ error: "No posts found" });
        }
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error retrieving posts"});
    }
};

// Statistics for Community Forum (Total number of posts and likes)
const getPostCount = async (req, res) => {
    try {
        const postCount = await Post.getPostCount();
        res.json(postCount);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error retrieving post count"});
    }
};

// Get all likes for the posts
const getAllLikes = async (req, res) => {
    try {
        const likes = await Post.getAllLikes();
        res.status(200).json(likes);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error retrieving total number of likes"});
    }
};

// Sorting of posts by likes and date created
const sortPostsByLikesDesc = async (req, res) => {
    try {
        const topicId = req.query.topicId;
        const posts = await Post.sortPostsByLikesDesc(topicId ? parseInt(topicId) : null);
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error sorting posts by likes"});
    }
};

const sortPostsByLikesAsc = async (req, res) => {
    try {
        const topicId = req.query.topicId;
        const posts = await Post.sortPostsByLikesAsc(topicId ? parseInt(topicId) : null);
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error sorting posts by likes"});
    }
};

const sortPostsByNewest = async (req, res) => {
    try {
        const topicId = req.query.topicId;
        const posts = await Post.sortPostsByNewest(topicId ? parseInt(topicId) : null);
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error sorting posts by newest"});
    }
};

const sortPostsByOldest = async (req, res) => {
    try {
        const topicId = req.query.topicId;
        const posts = await Post.sortPostsByOldest(topicId ? parseInt(topicId) : null);
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error sorting posts by oldest"});
    }
};

// To get the top 5 trending topics based on the number of posts per topic
const getTrendingTopics = async (req, res) => {
    try {
        const topicCounts = await Post.getAllTopicCountsByPost();
        topicCounts.sort((a, b) => b.postCount - a.postCount);
        res.json(topicCounts.slice(0, 5));
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error retrieving topic counts"});
    }
};

// Report post which redirects to admin
const reportPost = async (req, res) => {
    const reportData = req.body;
    try {
        const existingReport = await Post.getReportByUser(reportData.postId, reportData.userId);
        if (existingReport) {
            return res.status(400).json({ error: "You have already reported this post" });
        }
        const report = await Post.reportPost(reportData);
        res.status(200).json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error reporting post"});
    }
};

// Check if user has liked the post
const getLikeByUser = async (req, res) => {
    const postId = parseInt(req.params.postId);
    const userId = parseInt(req.params.userId);
    try {
        const like = await Post.getLikeByUser(postId, userId);
        res.json(like);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error retrieving like"});
    }

}

// Like / unlike the post
const modifyLike = async (req, res) => {
    const postId = parseInt(req.params.id);
    const userId = req.body.userId;

    try {
        const existingLike = await Post.getLikeByUser(postId, userId); // Check if the user has liked the post
        if (existingLike) { // If the user has liked the post, unlike it
            // Unlike the post
            const post = await Post.unlikePost(postId, userId);
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
            res.json({ success: true, status: 'unliked', likes: post.likes }); 
        } else { // If the user has not liked the post, like it
            // Like the post
            const post = await Post.likePost(postId, userId);
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
            res.json({ success: true, status: 'liked', likes: post.likes });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error liking/unliking post" });
    }
};

// Check if user has liked the comment
const getCommentLikeByUser = async (req, res) => {
    const commentId = parseInt(req.params.commentId);
    const userId = parseInt(req.params.userId);
    try {
        const like = await Post.getCommentLikeByUser(commentId, userId);
        res.json(like);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error retrieving like"});
    }
}

// Comments
// Get all comments for a post
const getCommentsByPost = async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
        const comments = await Post.getCommentsByPost(postId);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error retrieving comments"});
    }
};

// Get comment by id
const getCommentById = async (req, res) => {
    const commentId = parseInt(req.params.id);
    try {
        const comment = await Post.getCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error retrieving comment"});
    }
};

// Create, update and delete comments
const createComment = async (req, res) => {
    const postId = parseInt(req.params.id);
    const newCommentData = req.body;
    try {
        const createdComment = await Post.createComment(postId, newCommentData);
        res.status(201).send(createdComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error creating comment"});
    }
};

const updateComment = async (req, res) => {
    const newCommentData = req.body;
    const commentId = parseInt(req.params.commentId);
    try {
        const comment = await Post.updateComment(commentId, newCommentData);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error updating comment"});
    }
};

const deleteComment = async (req, res) => {
    const commentId = parseInt(req.params.id);
    console.log(commentId);
    try {
        const success = await Post.deleteComment(commentId);
        if (success != 1) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.status(201).json("Comment has been deleted");
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error deleting comment"});
    }
};

// Like / unlike the comment
const modifyCommentLike = async (req, res) => {
    const commentId = parseInt(req.params.id);
    const userId = parseInt(req.body.userId);

    try {
        const existingLike = await Post.getCommentLikeByUser(commentId, userId); // Check if the user has liked the comment
        if (existingLike) { // If the user has liked the comment, unlike it
            // Unlike the comment
            const comment = await Post.unlikeComment(commentId, userId);
            if (!comment) {
                return res.status(404).json({ error: "Comment not found" });
            }
            res.json({ success: true, status: 'unliked', likes: comment.likes });
        } else { // If the user has not liked the comment, like it
            // Like the comment
            const comment = await Post.likeComment(commentId, userId);
            if (!comment) {
                return res.status(404).json({ error: "Comment not found" });
            }
            res.json({ success: true, status: 'liked', likes: comment.likes });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error liking/unliking comment" });
    }
};

// Report comment which redirects to admin
const reportComment = async (req, res) => {
    const reportData = req.body;
    try {
        const existingReport = await Post.getReportCommentByUser(reportData.commentId, reportData.userId);
        if (existingReport) {
            return res.status(400).json({ error: "You have already reported this comment" });
        }
        const report = await Post.reportComment(reportData);
        res.status(200).json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error reporting comment"});
    }
};

// Reply to a comment
const replyToComment = async (req, res) => {
    const commentId = parseInt(req.params.commentId);
    const postId = parseInt(req.params.postId);
    const newReplyData = req.body;
    try {
        const reply = await Post.replyToComment(postId, commentId, newReplyData);
        res.status(201).send(reply);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error replying to comment"});
    }
};

// Get all replies to a comment
const getRepliesByComment = async (req, res) => {
    const commentId = parseInt(req.params.id);
    try {
        const replies = await Post.getRepliesByComment(commentId);
        if (!replies) {
            // If the user has not liked the post, return an error
            return res
                .status(400)
                .json({ error: "There are not replies to this comment" });
        }
        res.json(replies);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error retrieving replies"});
    }
};

// Getting all posts by the specific user
const getPostsByUserId = async (req, res) => {
    const userId = parseInt(req.params.id);
    console.log(userId);
    try {
        const posts = await Post.getPostsByUserId(userId);
        if (!posts || posts.length === 0) { // Check for empty array as well
            return res.status(404).json({ error: "No posts found for this user" });
        }
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error retrieving posts" });
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
    getPostsByTopic,
    getAllLikes,
    sortPostsByLikesDesc,
    sortPostsByLikesAsc,
    sortPostsByNewest,
    sortPostsByOldest,
    getTrendingTopics,
    reportPost,
    getLikeByUser,
    modifyLike,
    getCommentLikeByUser,
    getCommentsByPost,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
    modifyCommentLike,
    reportComment,
    replyToComment,
    getRepliesByComment,
    getPostsByUserId,
};
