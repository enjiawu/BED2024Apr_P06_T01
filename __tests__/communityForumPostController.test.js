/*const Post = require('../models/communityForumPost');
const communityForumController = require('../controllers/communityForumPostController');


jest.mock('../models/communityForumPost.js');

describe('Community Forum Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});*/

const Post = require('../models/communityForumPost');
const communityForumController = require('../controllers/communityForumPostController');

const users = [
  {
    "userId": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "location": "New York",
    "bio": "I am a passionate environmentalist and love to share my knowledge with others.",
    "profilePicture": "profile1.jpg",
    "passwordHash": "password123",
    "role": "member"
  },
  {
    "userId": 2,
    "username": "jane_smith",
    "email": "jane@example.com",
    "location": "Los Angeles",
    "bio": "I am a sustainability enthusiast and enjoy discussing eco-friendly living.",
    "profilePicture": "profile2.jpg",
    "passwordHash": "password456",
    "role": "member"
  }
];

const posts = [
  {
    "postId": 1,
    "userId": 1,
    "title": "How can I reduce my carbon footprint in my daily life?",
    "description": "I want to make a positive impact on the environment, but I dont know where to start. Any tips?",
    "topicId": 1,
    "likes": 3,
    "comments": 5,
    "dateCreated": "2024-07-09T00:00:00.000Z",
    "dateUpdated": null,
    "reports": 2
  },
  {
    "postId": 2,
    "userId": 2,
    "title": "What are the benefits of switching to renewable energy sources?",
    "description": "I heard that renewable energy is the way of the future, but Im not sure what the advantages are. Can someone enlighten me?",
    "topicId": 2,
    "likes": 5,
    "comments": 7,
    "dateCreated": "2024-07-10T12:30:00.000Z",
    "dateUpdated": "2024-07-10T12:31:00.000Z",
    "reports": 1
  }
];

const comments = [
  {
    "commentId": 3,
    "postId": 1,
    "userId": 4,
    "description": "You can start by reducing your use of single-use plastics.",
    "likes": 2,
    "reports": 1,
    "dateCreated": "2024-07-17T12:00:00.000Z",
    "dateUpdated": "2024-07-17T13:00:00.000Z",
    "parentCommentId": null
  },
  {
    "commentId": 2,
    "postId": 1,
    "userId": 3,
    "description": "Start with cutting down on wastage!",
    "likes": 5,
    "reports": 1,
    "dateCreated": "2024-07-16T10:00:00.000Z",
    "dateUpdated": "2024-07-16T11:00:00.000Z",
    "parentCommentId": null
  },
  {
    "commentId": 19,
    "postId": 5,
    "userId": 7,
    "description": "We should share our experiences with sustainable gardening.",
    "likes": 0,
    "reports": 0,
    "dateCreated": "2024-07-20T18:00:00.000Z",
    "dateUpdated": "2024-07-20T19:00:00.000Z",
    "parentCommentId": null
  }
];

const topics = [
  {
    "topicId": 1,
    "topic": "Climate Action"
  },
  {
    "topicId": 2,
    "topic": "Ecotourism"
  },
  {
    "topicId": 3,
    "topic": "Green Living"
  }
];

const postLikes = [
  {
    "postId": 1,
    "userId": 4
  },
  {
    "postId": 2,
    "userId": 3
  }
];

const commentLikes = [
  {
    "commentId": 3,
    "userId": 4
  },
  {
    "commentId": 2,
    "userId": 3
  }
];

const postReports = [
  {
    "reportId": 1,
    "postId": 1,
    "userId": 9,
    "dateReported": "2024-07-15T02:35:09.000Z",
    "reason": "Inappropriate"
  },
  {
    "reportId": 2,
    "postId": 1,
    "userId": 6,
    "dateReported": "2024-07-16T00:00:00.000Z",
    "reason": "I find this offensive"
}
]

const commentReports = [
{
    "reportId": 1,
    "commentId": 1,
    "postId": 1,
    "userId": 1,
    "dateReported": "2024-07-16T12:00:00.000Z",
    "reason": "Rude comment!"
},
{
    "reportId": 2,
    "commentId": 1,
    "postId": 1,
    "userId": 5,
    "dateReported": "2024-07-18T13:00:00.000Z",
    "reason": "Inappropriate"
},
]


jest.mock('../models/communityForumPost.js', () => {
  return {
    getAllPosts: jest.fn(),
    getPostById: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    getCommentsByPost: jest.fn(),
    createComment: jest.fn(),
    updateComment: jest.fn(),
    deleteComment: jest.fn(),
    likePost: jest.fn(),
    unlikePost: jest.fn(),
    reportPost: jest.fn(),
    reportComment: jest.fn(),
    getPostReports: jest.fn()
  };
});

describe('Community Forum Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      expect(res.json).toHaveBeenCalledWith({ error: 'Error retrieving post' });
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
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ message: "Post has been deleted" });
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
      expect(res.json).toHaveBeenCalledWith({ error: "Post not found" });
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
      expect(res.status).toHaveBeenCalledWith(204);
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
      expect(res.json).toHaveBeenCalledWith({ error: "Comment not found" });
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
});