const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from a .env file into process.env

function checkPostOwnership(req, res, next) {
  const postId = req.params.id;
  const userId = req.user.id;

  // Check if the post exists
  CommunityForumPost.getPostById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Check if the post belongs to the user
      if (post.userId !== userId) {
        return res.status(403).json({ error: 'You are not authorized to edit or delete this post' });
      }

      // If the post belongs to the user, continue to the next middleware or route handler
      next();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
}

module.exports = checkPostOwnership;