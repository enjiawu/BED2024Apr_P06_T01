// topic.test.js
const Topic = require("../models/communityForumTopics");
const sql = require("mssql");
const dbConfig = require("../dbConfig");

jest.mock('mssql'); // Mock the mssql library

describe("Community Forum Topic Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTopics", () => {
    it("should retrieve all topics from the database", async () => {
      const mockTopics = [
        { topicId: 1, topic: "Climate Action" },
        { topicId: 2, topic: "Ecotourism" }
      ];

      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: mockTopics }),
        input: jest.fn().mockReturnThis()
      };

      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined)
      };

      sql.connect.mockResolvedValue(mockConnection);

      const topics = await Topic.getAllTopics();

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(topics).toHaveLength(2);
      expect(topics[0].topicId).toBe(1);
      expect(topics[0].topic).toBe("Climate Action");
      expect(topics[1].topicId).toBe(2);
      expect(topics[1].topic).toBe("Ecotourism");
    });

    it("should handle errors when retrieving topics", async () => {
      const errorMessage = "Database Error";
      sql.connect.mockRejectedValue(new Error(errorMessage));
      await expect(Topic.getAllTopics()).rejects.toThrow(errorMessage);
    });
  });

  describe("getTopicById", () => {
    it("should retrieve a topic by its ID", async () => {
      const mockTopic = { topicId: 1, topic: "Climate Action" };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [mockTopic] })
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined)
      };

      sql.connect.mockResolvedValue(mockConnection);

      const topic = await Topic.getTopicById(1);

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(topic).toBeInstanceOf(Topic);
      expect(topic.topicId).toBe(1);
      expect(topic.topic).toBe("Climate Action");
    });

    it("should return null if topic with the given ID does not exist", async () => {
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [] })
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined)
      };

      sql.connect.mockResolvedValue(mockConnection);

      const topic = await Topic.getTopicById(1);

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(topic).toBeNull();
    });

    it("should handle errors when retrieving a topic by ID", async () => {
      const errorMessage = "Database Error";
      sql.connect.mockRejectedValue(new Error(errorMessage));
      await expect(Topic.getTopicById(1)).rejects.toThrow(errorMessage);
    });
  });

  describe("getTopicCount", () => {
    it("should retrieve the count of topics", async () => {
      const mockCount = { topicCount: 3 };

      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: [mockCount] })
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined)
      };

      sql.connect.mockResolvedValue(mockConnection);

      const count = await Topic.getTopicCount();

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(count.topicCount).toBe(3);
    });

    it("should handle errors when retrieving topic count", async () => {
      const errorMessage = "Database Error";
      sql.connect.mockRejectedValue(new Error(errorMessage));
      await expect(Topic.getTopicCount()).rejects.toThrow(errorMessage);
    });
  });

  describe("createTopic", () => {
    it("should create a new topic", async () => {
      const newTopic = "Sustainable Living";
      const mockResult = { id: 1 };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [mockResult] })
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined)
      };

      sql.connect.mockResolvedValue(mockConnection);

      const result = await Topic.createTopic(newTopic);

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(result.id).toBe(1);
    });

    it("should handle errors when creating a topic", async () => {
      const errorMessage = "Database Error";
      sql.connect.mockRejectedValue(new Error(errorMessage));
      await expect(Topic.createTopic("New Topic")).rejects.toThrow(errorMessage);
    });
  });

  describe("updateTopic", () => {
  it("should update an existing topic", async () => {
    const updatedTopic = "Updated Topic";
    const mockUpdatedTopic = { topicId: 1, topic: updatedTopic };

    const mockRequestUpdate = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({ recordset: [mockUpdatedTopic] }),
    };

    const mockConnection = {
      request: jest.fn()
       .mockReturnValue(mockRequestUpdate), // For update
      close: jest.fn().mockResolvedValue(undefined)
    };

    sql.connect.mockResolvedValue(mockConnection);

    const topic = await Topic.updateTopic(1, updatedTopic);

    expect(sql.connect).toHaveBeenCalledWith(dbConfig);
    expect(mockConnection.close).toHaveBeenCalledTimes(2);
    expect(topic).toBeInstanceOf(Topic);
    expect(topic.topicId).toBe(1);
    expect(topic.topic).toBe(updatedTopic);
  });

  it("should handle errors when updating a topic", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Topic.updateTopic(1, "New Topic")).rejects.toThrow(errorMessage);
  });
});

  describe("deleteTopic", () => {
    it("should delete a topic", async () => {
      const mockResult = { rowsAffected: [1] };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue(mockResult)
      };
      
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined)
      };

      sql.connect.mockResolvedValue(mockConnection);

      const rowsAffected = await Topic.deleteTopic(1);

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(rowsAffected).toBe(1);
    });

    it("should handle errors when deleting a topic", async () => {
      const errorMessage = "Database Error";
      sql.connect.mockRejectedValue(new Error(errorMessage));
      await expect(Topic.deleteTopic(1)).rejects.toThrow(errorMessage);
    });
  });

  describe("checkIfTopicExists", () => {
    it("should return true if the topic exists", async () => {
      const mockTopic = { topicId: 1, topic: "Climate Action" };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [mockTopic] })
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined)
      };

      sql.connect.mockResolvedValue(mockConnection);

      const exists = await Topic.checkIfTopicExists("Climate Action");

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(exists).toBe(true);
    });

    it("should return false if the topic does not exist", async () => {
      const mockRequest = {
        input: jest.fn().mockReturnThis({}),
        query: jest.fn().mockResolvedValue({ recordset: [] })
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined)
      };

      sql.connect.mockResolvedValue(mockConnection);

      const exists = await Topic.checkIfTopicExists("Nonexistent Topic");

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(exists).toBe(false);
    });

    it("should handle errors when checking if a topic exists", async () => {
      const errorMessage = "Database Error";
      sql.connect.mockRejectedValue(new Error(errorMessage));
      await expect(Topic.checkIfTopicExists("Topic")).rejects.toThrow(errorMessage);
    });
  });
});
