const Post = require("../models/communityForumPost");
const sql = require("mssql");
const dbConfig = require("../dbConfig");

jest.mock('mssql'); // Mock the mssql library

describe("Community Forum Post Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllPosts", () => {
    it("should retrieve all posts from the database", async () => {
      const mockPosts = [
        { postId: 1, title: "Post 1", description: "Content 1", userId: 1, topicId: 1 },
        { postId: 2, title: "Post 2", description: "Content 2", userId: 2, topicId: 1 }
      ];
  
      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: mockPosts }),
        input: jest.fn().mockReturnThis()
      };
  
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined)
      };
  
      sql.connect.mockResolvedValue(mockConnection);
  
      const posts = await Post.getAllPosts();
  
      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(posts).toHaveLength(2);
      expect(posts[0].postId).toBe(1);
      expect(posts[0].title).toBe("Post 1");
      expect(posts[0].description).toBe("Content 1");
      expect(posts[0].userId).toBe(1);
      expect(posts[0].topicId).toBe(1);
      expect(posts[1].postId).toBe(2);
      expect(posts[1].title).toBe("Post 2");
      expect(posts[1].description).toBe("Content 2");
      expect(posts[1].userId).toBe(2);
      expect(posts[1].topicId).toBe(1);
    });
  
    it("should handle errors when retrieving all posts", async () => {
      const errorMessage = "Error getting all posts";
      sql.connect.mockRejectedValue(new Error(errorMessage));
      await expect(Post.getAllPosts()).rejects.toThrow(errorMessage);
    });
  });
  
  describe("getPostById", () => {
    it("should retrieve a post by ID from the database", async () => {
      const postId = 1;
      const mockPost = { postId: 1, title: "Post 1", description: "Content 1", userId: 1, topicId: 1 };
  
      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: [mockPost] }),
        input: jest.fn().mockReturnThis()
      };
  
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined)
      };
  
      sql.connect.mockResolvedValue(mockConnection);
  
      const post = await Post.getPostById(postId);
  
      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(post).toEqual(mockPost);
    });
  
    it("should handle errors when retrieving a post by ID", async () => {
      const errorMessage = "Error getting post by ID";
      sql.connect.mockRejectedValue(new Error(errorMessage));
      await expect(Post.getPostById(1)).rejects.toThrow(errorMessage);
    });
  });
    
    describe("searchPosts", () => {
      it("should search for posts by title in the database", async () => {
        const searchTerm = "search term";
        const mockPosts = [
          { postId: 1, title: "Post 1", description: "Content 1", userId: 1, topicId: 1 },
          { postId: 2, title: "Post 2", description: "Content 2", userId: 2, topicId: 1 }
        ];
    
        const mockRequest = {
          query: jest.fn().mockResolvedValue({ recordset: mockPosts }),
          input: jest.fn().mockReturnThis()
        };
    
        const mockConnection = {
          request: jest.fn().mockReturnValue(mockRequest),
          close: jest.fn().mockResolvedValue(undefined)
        };
    
        sql.connect.mockResolvedValue(mockConnection);
    
        const posts = await Post.searchPosts(searchTerm);
    
        expect(sql.connect).toHaveBeenCalledWith(dbConfig);
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(posts).toHaveLength(2);
        expect(posts[0].postId).toBe(1);
        expect(posts[0].title).toBe("Post 1");
        expect(posts[0].description).toBe("Content 1");
        expect(posts[0].userId).toBe(1);
        expect(posts[0].topicId).toBe(1);
        expect(posts[1].postId).toBe(2);
        expect(posts[1].title).toBe("Post 2");
        expect(posts[1].description).toBe("Content 2");
        expect(posts[1].userId).toBe(2);
        expect(posts[1].topicId).toBe(1);
      });
    
      it("should handle errors when searching for posts", async () => {
        const errorMessage = "Error searching posts";
        sql.connect.mockRejectedValue(new Error(errorMessage));
        await expect(Post.searchPosts("search term")).rejects.toThrow(errorMessage);
      });
    });
    
    describe("getPostsByTopic", () => {
      it("should retrieve posts by topic ID from the database", async () => {
        const topicId = 1;
        const mockPosts = [
          { postId: 1, title: "Post 1", description: "Content 1", userId: 1, topicId: 1 },
          { postId: 2, title: "Post 2", description: "Content 2", userId: 2, topicId: 1 }
        ];
    
        const mockRequest = {
          query: jest.fn().mockResolvedValue({ recordset: mockPosts }),
          input: jest.fn().mockReturnThis()
        };
    
        const mockConnection = {
          request: jest.fn().mockReturnValue(mockRequest),
          close: jest.fn().mockResolvedValue(undefined)
        };
    
        sql.connect.mockResolvedValue(mockConnection);
    
        const posts = await Post.getPostsByTopic(topicId);
    
        expect(sql.connect).toHaveBeenCalledWith(dbConfig);
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(posts).toHaveLength(2);
        expect(posts[0].postId).toBe(1);
        expect(posts[0].title).toBe("Post 1");
        expect(posts[0].description).toBe("Content 1");
        expect(posts[0].userId).toBe(1);
        expect(posts[0].topicId).toBe(1);
        expect(posts[1].postId).toBe(2);
        expect(posts[1].title).toBe("Post 2");
        expect(posts[1].description).toBe("Content 2");
        expect(posts[1].userId).toBe(2);
        expect(posts[1].topicId).toBe(1);
      });
    
      it("should handle errors when retrieving posts by topic", async () => {
        const errorMessage = "Error retrieving posts by topic";
        sql.connect.mockRejectedValue(new Error(errorMessage));
        await expect(Post.getPostsByTopic(1)).rejects.toThrow(errorMessage);
      });
    });
    
    describe("getPostCount", () => {
        it("should retrieve the total number of posts from the database", async () => {
          const mockPostCount = 10;
      
          const mockRequest = {
            query: jest.fn().mockResolvedValue({ recordset: [{ count: mockPostCount }] }),
            input: jest.fn().mockReturnThis()
          };
      
          const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined)
          };
      
          sql.connect.mockResolvedValue(mockConnection);
      
          const postCount = await Post.getPostCount();
      
          expect(sql.connect).toHaveBeenCalledWith(dbConfig);
          expect(mockConnection.close).toHaveBeenCalledTimes(1);
          expect(postCount).toStrictEqual({ count: mockPostCount });
        });
      
        it("should handle errors when retrieving the total number of posts", async () => {
          const errorMessage = "Error retrieving post count";
          sql.connect.mockRejectedValue(new Error(errorMessage));
          await expect(Post.getPostCount()).rejects.toThrow(errorMessage);
        });
      });      

    
    describe("sortPostsByLikesDesc", () => {
      it("should sort posts by likes in descending order from the database", async () => {
        const mockPosts = [
          { postId: 1, title: "Post 1", description: "Content 1", userId: 1, topicId: 1, likes: 5 },
          { postId: 2, title: "Post 2", description: "Content 2", userId: 2, topicId: 1, likes: 3 },
          { postId: 3, title: "Post 3", description: "Content 3", userId: 3, topicId: 1, likes: 10 }
        ];
    
        const mockRequest = {
          query: jest.fn().mockResolvedValue({ recordset: mockPosts }),
          input: jest.fn().mockReturnThis()
        };
    
        const mockConnection = {
          request: jest.fn().mockReturnValue(mockRequest),
          close: jest.fn().mockResolvedValue(undefined)
        };
    
        sql.connect.mockResolvedValue(mockConnection);
    
        const posts = await Post.sortPostsByLikesDesc();
    
        expect(sql.connect).toHaveBeenCalledWith(dbConfig);
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(posts).toHaveLength(3);
        expect(posts[2].postId).toBe(3);
        expect(posts[2].title).toBe("Post 3");
        expect(posts[2].description).toBe("Content 3");
        expect(posts[2].userId).toBe(3);
        expect(posts[2].topicId).toBe(1);
        expect(posts[2].likes).toBe(10);
        expect(posts[0].postId).toBe(1);
        expect(posts[0].title).toBe("Post 1");
        expect(posts[0].description).toBe("Content 1");
        expect(posts[0].userId).toBe(1);
        expect(posts[0].topicId).toBe(1);
        expect(posts[0].likes).toBe(5);
        expect(posts[1].postId).toBe(2);
        expect(posts[1].title).toBe("Post 2");
        expect(posts[1].description).toBe("Content 2");
        expect(posts[1].userId).toBe(2);
        expect(posts[1].topicId).toBe(1);
        expect(posts[1].likes).toBe(3);
      });
    
      it("should handle errors when sorting posts by likes in descending order", async () => {
        const errorMessage = "Error sorting posts by likes";
        sql.connect.mockRejectedValue(new Error(errorMessage));
        await expect(Post.sortPostsByLikesDesc()).rejects.toThrow(errorMessage);
      });
    });
});