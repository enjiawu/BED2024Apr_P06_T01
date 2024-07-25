const sql = require("mssql");
const dbConfig = require("../dbConfig");

// topicsController.test.js
const topicsController = require("../controllers/communityForumTopicsController");
const Topic = require("../models/communityForumTopics");
const mockData = require("../__mocks__/mockData"); // Import the mock data

// Mock the Topic model
jest.mock("../models/communityForumTopics");

describe("topicsController", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  describe("getAllTopics", () => {
    it("should fetch all topics and return a JSON response", async () => {
      const mockTopics = mockData.topics;

      // Mock the Topic.getAllTopics function to return the mock data
      Topic.getAllTopics.mockResolvedValue(mockTopics);

      const req = {};
      const res = {
        json: jest.fn(), // Mock the res.json function
        status: jest.fn().mockReturnThis() // Mock the res.status function
      };

      await topicsController.getAllTopics(req, res);

      expect(Topic.getAllTopics).toHaveBeenCalledTimes(1); // Check if getAllTopics was called
      expect(res.status).toHaveBeenCalledWith(200); // Check the status code
      expect(res.json).toHaveBeenCalledWith(mockTopics); // Check the response body
    });

    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      Topic.getAllTopics.mockRejectedValue(new Error(errorMessage)); // Simulate an error

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() // Mock the res.json function
      };

      await topicsController.getAllTopics(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error retrieving topics" });
    });
  });

  describe("getTopicById", () => {
    it("should fetch a topic by id and return a JSON response", async () => {
      const topicId = 1;
      const mockTopic = mockData.topics.find(t => t.topicId === topicId);

      Topic.getTopicById.mockResolvedValue(mockTopic);

      const req = { params: { id: topicId } };
      const res = {
        json: jest.fn(), // Mock the res.json function
        status: jest.fn().mockReturnThis() // Mock the res.status function
      };

      await topicsController.getTopicById(req, res);

      expect(Topic.getTopicById).toHaveBeenCalledWith(topicId); // Check if getTopicById was called with the correct id
      expect(res.status).toHaveBeenCalledWith(200); // Check the status code
      expect(res.json).toHaveBeenCalledWith(mockTopic); // Check the response body
    });

    it("should return 404 if topic is not found", async () => {
      const topicId = 999; // A topicId that does not exist
      Topic.getTopicById.mockResolvedValue(null); // Simulate no topic found

      const req = { params: { id: topicId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() // Mock the res.json function
      };

      await topicsController.getTopicById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Topic not found" });
    });

    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      Topic.getTopicById.mockRejectedValue(new Error(errorMessage)); // Simulate an error

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() // Mock the res.json function
      };

      await topicsController.getTopicById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error retrieving topic" });
    });
  });

  describe("getTopicCount", () => {
    it("should fetch the topic count and return a JSON response", async () => {
      const mockCount = { count: mockData.topics.length };

      Topic.getTopicCount.mockResolvedValue(mockCount);

      const req = {};
      const res = {
        json: jest.fn(), // Mock the res.json function
        status: jest.fn().mockReturnThis() // Mock the res.status function
      };

      await topicsController.getTopicCount(req, res);

      expect(Topic.getTopicCount).toHaveBeenCalledTimes(1); // Check if getTopicCount was called
      expect(res.status).toHaveBeenCalledWith(200); // Check the status code
      expect(res.json).toHaveBeenCalledWith(mockCount); // Check the response body
    });

    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      Topic.getTopicCount.mockRejectedValue(new Error(errorMessage)); // Simulate an error

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() // Mock the res.json function
      };

      await topicsController.getTopicCount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error retrieving topic count" });
    });
  });

  describe("createTopic", () => {
    it("should create a new topic and return a 201 response", async () => {
      const newTopic = { topicId: 4, topic: "Sustainable Living" };
      Topic.checkIfTopicExists.mockResolvedValue(false); // Simulate that topic does not exist
      Topic.createTopic.mockResolvedValue(newTopic);

      const req = { body: { topic: newTopic } };
      const res = {
        json: jest.fn(), // Mock the res.json function
        status: jest.fn().mockReturnThis() // Mock the res.status function
      };

      await topicsController.createTopic(req, res);

      expect(Topic.checkIfTopicExists).toHaveBeenCalledWith(newTopic); 
      expect(Topic.createTopic).toHaveBeenCalledWith(newTopic); // Check if createTopic was called with the correct topic
      expect(res.status).toHaveBeenCalledWith(201); // Check the status code
      expect(res.json).toHaveBeenCalledWith(newTopic); // Check the response body
    });

    it("should return 409 if topic already exists", async () => {
      const existingTopic = { topic: "Climate Action" };
      Topic.checkIfTopicExists.mockResolvedValue(true); // Simulate that topic already exists

      const req = { body: { topic: existingTopic } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() // Mock the res.json function
      };

      await topicsController.createTopic(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: "Topic already exists" });
    });

    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      Topic.checkIfTopicExists.mockResolvedValue(false); // Simulate that topic does not exist
      Topic.createTopic.mockRejectedValue(new Error(errorMessage)); // Simulate an error

      const req = { body: { topic: { topic: "Sustainable Living" } } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() // Mock the res.json function
      };

      await topicsController.createTopic(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error creating topic" });
    });
  });

  describe("updateTopic", () => {
    it("should update a topic and return the updated topic", async () => {
      const updatedTopic = { topicId: 1, topic: "Updated Climate Action" };
      const topicId = 1;
      const topicName = "Updated Climate Action";

      Topic.updateTopic.mockResolvedValue(updatedTopic);

      const req = { params: { id: topicId }, body: { topic: topicName } };
      const res = {
        json: jest.fn(), // Mock the res.json function
        status: jest.fn().mockReturnThis() // Mock the res.status function
      };

      await topicsController.updateTopic(req, res);

      expect(Topic.updateTopic).toHaveBeenCalledWith(topicId, topicName); // Check if updateTopic was called with the correct id and topicName
      expect(res.status).toHaveBeenCalledWith(200); // Check the status code
      expect(res.json).toHaveBeenCalledWith(updatedTopic); // Check the response body
    });

    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      Topic.updateTopic.mockRejectedValue(new Error(errorMessage)); // Simulate an error

      const req = { params: { id: 1 }, body: { topic: "Updated Climate Action" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() // Mock the res.json function
      };

      await topicsController.updateTopic(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error updating topic" });
    });
  });
});
