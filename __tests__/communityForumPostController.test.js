const Post = require('../models/communityForumPost');
const communityForumController = require('../controllers/communityForumPostController');
const { posts, comments, postLikes, commentLikes, postReports, commentReports } = require('../__mocks__/mockData'); // Adjust the path as needed

jest.mock('../models/communityForumPost');

describe('Community Forum Controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getAllPosts', () => {
    it('should return all posts with status 200', async () => {
      Post.getAllPosts.mockResolvedValue(posts);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.getAllPosts(req, res);

      expect(Post.getAllPosts).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(posts);
    });

    it('should handle errors and return a 500 status', async () => {
      Post.getAllPosts.mockRejectedValue(new Error('Error'));

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.getAllPosts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error retrieving posts' });
    });
  });

  describe('getPostById', () => {
    it('should return post by ID with status 200', async () => {
      const mockPost = posts[0];
      Post.getPostById.mockResolvedValue(mockPost);

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.getPostById(req, res);

      expect(Post.getPostById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it('should return 404 if post not found', async () => {
      Post.getPostById.mockResolvedValue(null);

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.getPostById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });

    it('should handle errors and return a 500 status', async () => {
      Post.getPostById.mockRejectedValue(new Error('Error'));

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.getPostById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error retrieving posts' });
    });
  });

  describe('createPost', () => {
    it('should create a new post and return it with status 201', async () => {
      const newPostData = {
        userId: 1,
        title: 'New Post',
        description: 'This is a new post.',
        topicId: 1
      };
      const createdPost = { postId: 3, ...newPostData, likes: 0, comments: 0, dateCreated: new Date() };
      Post.createPost.mockResolvedValue(createdPost);

      const req = { body: newPostData };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.createPost(req, res);

      expect(Post.createPost).toHaveBeenCalledWith(newPostData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdPost);
    });

    it('should handle errors and return a 500 status', async () => {
      Post.createPost.mockRejectedValue(new Error('Error'));

      const req = { body: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error creating post' });
    });
  });

  describe('updatePost', () => {
    it('should update an existing post and return it with status 200', async () => {
      const updatedPostData = { title: 'Updated Post Title' };
      const updatedPost = { ...posts[0], ...updatedPostData };
      Post.updatePost.mockResolvedValue(updatedPost);

      const req = { params: { id: '1' }, body: updatedPostData };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.updatePost(req, res);

      expect(Post.updatePost).toHaveBeenCalledWith(1, updatedPostData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedPost);
    });

    it('should return 404 if post not found', async () => {
      Post.updatePost.mockResolvedValue(null);

      const req = { params: { id: '1' }, body: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });

    it('should handle errors and return a 500 status', async () => {
      Post.updatePost.mockRejectedValue(new Error('Error'));

      const req = { params: { id: '1' }, body: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error updating post' });
    });
  });

  describe('deletePost', () => {
    it('should delete a post and return a success message with status 201', async () => {
      Post.deletePost.mockResolvedValue(1);

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.deletePost(req, res);

      expect(Post.deletePost).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith('Post has been deleted');
    });

    it('should return 404 if post not found', async () => {
      Post.deletePost.mockResolvedValue(0);

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.deletePost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith('Post not found');
    });

    it('should handle errors and return a 500 status', async () => {
      Post.deletePost.mockRejectedValue(new Error('Error'));

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.deletePost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error deleting posts' });
    });
  });

  describe('getCommentsByPost', () => {
    it('should return comments by post ID with status 200', async () => {
      const postComments = comments.filter(comment => comment.postId === 1);
      Post.getCommentsByPost.mockResolvedValue(postComments);

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.getCommentsByPost(req, res);

      expect(Post.getCommentsByPost).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(postComments);
    });

    it('should handle errors and return a 500 status', async () => {
      Post.getCommentsByPost.mockRejectedValue(new Error('Error'));

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.getCommentsByPost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error retrieving comments' });
    });
  });

  describe('createComment', () => {
    it('should create a new comment and return it with status 201', async () => {
      const newCommentData = {
        postId: 1,
        userId: 1,
        description: 'This is a new comment.',
        parentCommentId: null
      };
      const createdComment = { commentId: 4, ...newCommentData, likes: 0, reports: 0, dateCreated: new Date() };
      Post.createComment.mockResolvedValue(createdComment);

      const req = { body: newCommentData };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.createComment(req, res);

      expect(Post.createComment).toHaveBeenCalledWith(newCommentData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdComment);
    });

    it('should handle errors and return a 500 status', async () => {
      Post.createComment.mockRejectedValue(new Error('Error'));

      const req = { body: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.createComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error creating comment' });
    });
  });

  describe('updateComment', () => {
    it('should update an existing comment and return it with status 200', async () => {
      const updatedCommentData = { description: 'Updated comment text' };
      const updatedComment = { ...comments[0], ...updatedCommentData };
      Post.updateComment.mockResolvedValue(updatedComment);

      const req = { params: { id: '3' }, body: updatedCommentData };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.updateComment(req, res);

      expect(Post.updateComment).toHaveBeenCalledWith(3, updatedCommentData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedComment);
    });

    it('should return 404 if comment not found', async () => {
      Post.updateComment.mockResolvedValue(null);

      const req = { params: { id: '3' }, body: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.updateComment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Comment not found' });
    });

    it('should handle errors and return a 500 status', async () => {
      Post.updateComment.mockRejectedValue(new Error('Error'));

      const req = { params: { id: '3' }, body: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.updateComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error updating comment' });
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment and return a success message with status 201', async () => {
      Post.deleteComment.mockResolvedValue(1);

      const req = { params: { id: '3' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.deleteComment(req, res);

      expect(Post.deleteComment).toHaveBeenCalledWith(3);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith('Comment has been deleted');
    });

    it('should return 404 if comment not found', async () => {
      Post.deleteComment.mockResolvedValue(0);

      const req = { params: { id: '3' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.deleteComment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith('Comment not found');
    });

    it('should handle errors and return a 500 status', async () => {
      Post.deleteComment.mockRejectedValue(new Error('Error'));

      const req = { params: { id: '3' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.deleteComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error deleting comment' });
    });
  });

  describe('likePost', () => {
    it('should add a like to a post and return the updated post with status 200', async () => {
      const postId = 1;
      const userId = 3;
      const updatedPost = { ...posts[0], likes: 4 }; // assuming the post now has 4 likes

      Post.likePost.mockResolvedValue(updatedPost);

      const req = { params: { id: postId }, body: { userId } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.likePost(req, res);

      expect(Post.likePost).toHaveBeenCalledWith(postId, userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedPost);
    });

    it('should handle errors and return a 500 status', async () => {
      Post.likePost.mockRejectedValue(new Error('Error'));

      const req = { params: { id: '1' }, body: { userId: '3' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.likePost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error liking post' });
    });
  });

  describe('unlikePost', () => {
    it('should remove a like from a post and return the updated post with status 200', async () => {
      const postId = 1;
      const userId = 4;
      const updatedPost = { ...posts[0], likes: 2 }; // assuming the post now has 2 likes

      Post.unlikePost.mockResolvedValue(updatedPost);

      const req = { params: { id: postId }, body: { userId } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.unlikePost(req, res);

      expect(Post.unlikePost).toHaveBeenCalledWith(postId, userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedPost);
    });

    it('should handle errors and return a 500 status', async () => {
      Post.unlikePost.mockRejectedValue(new Error('Error'));

      const req = { params: { id: '1' }, body: { userId: '4' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.unlikePost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error unliking post' });
    });
  });

  describe('reportPost', () => {
    it('should report a post and return a success message with status 200', async () => {
      const postId = 1;
      const userId = 9;
      const reason = 'Inappropriate';
      const report = { reportId: 3, postId, userId, dateReported: new Date(), reason };

      Post.reportPost.mockResolvedValue(report);

      const req = { params: { id: postId }, body: { userId, reason } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.reportPost(req, res);

      expect(Post.reportPost).toHaveBeenCalledWith(postId, userId, reason);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Post has been reported' });
    });

    it('should handle errors and return a 500 status', async () => {
      Post.reportPost.mockRejectedValue(new Error('Error'));

      const req = { params: { id: '1' }, body: { userId: '9', reason: 'Inappropriate' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.reportPost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error reporting post' });
    });
  });

  describe('reportComment', () => {
    it('should report a comment and return a success message with status 200', async () => {
      const commentId = 3;
      const userId = 1;
      const reason = 'Rude comment';
      const report = { reportId: 3, commentId, postId: 1, userId, dateReported: new Date(), reason };

      Post.reportComment.mockResolvedValue(report);

      const req = { params: { id: commentId }, body: { userId, reason } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.reportComment(req, res);

      expect(Post.reportComment).toHaveBeenCalledWith(commentId, userId, reason);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Comment has been reported' });
    });

    it('should handle errors and return a 500 status', async () => {
      Post.reportComment.mockRejectedValue(new Error('Error'));

      const req = { params: { id: '3' }, body: { userId: '1', reason: 'Rude comment' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.reportComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error reporting comment' });
    });
  });

  describe('getPostReports', () => {
    it('should return all reports for a post with status 200', async () => {
      const postId = 1;
      const reports = postReports.filter(report => report.postId === postId);

      Post.getPostReports.mockResolvedValue(reports);

      const req = { params: { id: postId } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.getPostReports(req, res);

      expect(Post.getPostReports).toHaveBeenCalledWith(postId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(reports);
    });

    it('should handle errors and return a 500 status', async () => {
      Post.getPostReports.mockRejectedValue(new Error('Error'));

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await communityForumController.getPostReports(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error retrieving post reports' });
    });
  });
});

