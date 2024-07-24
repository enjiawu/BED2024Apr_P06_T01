// carbonFootprintController.test.js

const carbonFootprintController = require("../controllers/carbonFootprintController");
const CarbonFootprint = require("../models/carbonFootprint");

// Mock the CarbonFootprint model
jest.mock("../models/carbonFootprint");

describe("carbonFootprintController", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  describe("calculateCarbonFootprint", () => {
    it("should calculate carbon footprint and return the results", async () => {
      const requestData = {
        carTravel: 5000,
        publicTransport: 2000,
        flight: 3000,
        motorBike: 1000
      };
      const individualCF = {
        carTravel: 5000,
        publicTransport: 2000,
        flight: 3000,
        motorBike: 1000
      };
      const totalCarbonFootprint = 11000;
      const treeEquivalent = 2.34;
      const tips = ["Tip1", "Tip2", "Tip3"];
      const stats = { average: 9500, highest: 11000 };
      const grade = "poor"; // Change to lowercase

      // Mock CarbonFootprint methods
      CarbonFootprint.calculateCarbonFootprint.mockResolvedValue({ individualCF, totalCarbonFootprint });
      CarbonFootprint.getTreeEquivalent.mockResolvedValue(treeEquivalent);
      CarbonFootprint.getTipsByGrade.mockResolvedValue(tips);
      CarbonFootprint.compareStats.mockResolvedValue(stats);
      CarbonFootprint.updateCarbonFootprint.mockResolvedValue();

      const req = { body: requestData };
      const res = {
        json: jest.fn(), // Mock the res.json function
        status: jest.fn().mockReturnThis() // Mock the res.status function
      };

      await carbonFootprintController.calculateCarbonFootprint(req, res);

      expect(CarbonFootprint.calculateCarbonFootprint).toHaveBeenCalledWith(
        requestData.carTravel,
        requestData.publicTransport,
        requestData.flight,
        requestData.motorBike
      );
      expect(CarbonFootprint.getTreeEquivalent).toHaveBeenCalledWith(totalCarbonFootprint);
      expect(CarbonFootprint.getTipsByGrade).toHaveBeenCalledWith(grade);
      expect(CarbonFootprint.compareStats).toHaveBeenCalledTimes(1);
      expect(CarbonFootprint.updateCarbonFootprint).toHaveBeenCalledWith(
        requestData.carTravel,
        requestData.publicTransport,
        requestData.flight,
        requestData.motorBike,
        treeEquivalent,
        totalCarbonFootprint
      );

      expect(res.json).toHaveBeenCalledWith({
        individualCF,
        totalCarbonFootprint,
        treeEquivalent,
        grade,
        tips,
        stats
      });
    });

    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Error calculating carbon footprint";
      CarbonFootprint.calculateCarbonFootprint.mockRejectedValue(new Error(errorMessage));

      const req = { body: { carTravel: 5000, publicTransport: 2000, flight: 3000, motorBike: 1000 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() // Mock the res.json function
      };

      await carbonFootprintController.calculateCarbonFootprint(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error calculating carbon footprint' });
    });
  });

  describe("getCarbonFootprintPossibleActions", () => {
    it("should fetch possible actions and return a JSON response", async () => {
      const mockActions = [
        { id: "1", action: "Reduce car travel" }, // Change id to string
        { id: "2", action: "Use public transport" }
      ];

      CarbonFootprint.getCarbonFootprintPossibleActions.mockResolvedValue(mockActions);

      const req = {};
      const res = {
        json: jest.fn(), // Mock the res.json function
        status: jest.fn().mockReturnThis() // Mock the res.status function
      };

      await carbonFootprintController.getCarbonFootprintPossibleActions(req, res);

      expect(CarbonFootprint.getCarbonFootprintPossibleActions).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockActions);
    });

    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Error retrieving possible actions";
      CarbonFootprint.getCarbonFootprintPossibleActions.mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() // Mock the res.json function
      };

      await carbonFootprintController.getCarbonFootprintPossibleActions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error retrieving possible actions' });
    });
  });

  describe("getCarbonFootprintPossibleActionsById", () => {
    it("should fetch possible action by id and return a JSON response", async () => {
      const id = "1"; // Change id to string
      const mockAction = { id, action: "Reduce car travel" };

      CarbonFootprint.getCarbonFootprintPossibleActionsById.mockResolvedValue(mockAction);

      const req = { params: { id } };
      const res = {
        json: jest.fn(), // Mock the res.json function
        status: jest.fn().mockReturnThis() // Mock the res.status function
      };

      await carbonFootprintController.getCarbonFootprintPossibleActionsById(req, res);

      expect(CarbonFootprint.getCarbonFootprintPossibleActionsById).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAction);
    });

    it("should return 404 if action is not found", async () => {
      const id = "999"; // Change id to string
      CarbonFootprint.getCarbonFootprintPossibleActionsById.mockResolvedValue(null);

      const req = { params: { id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() // Mock the res.json function
      };

      await carbonFootprintController.getCarbonFootprintPossibleActionsById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Action not found' });
    });

    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Error retrieving action";
      CarbonFootprint.getCarbonFootprintPossibleActionsById.mockRejectedValue(new Error(errorMessage));

      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() // Mock the res.json function
      };

      await carbonFootprintController.getCarbonFootprintPossibleActionsById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error retrieving action' });
    });
  });

  describe("createCarbonFootprintPossibleAction", () => {
    it("should create a new action and return a 201 response", async () => {
      const newAction = { id: "3", action: "Use less plastic" };

      CarbonFootprint.createCarbonFootprintPossibleAction.mockResolvedValue(newAction);

      const req = { body: newAction };
      const res = {
        json: jest.fn(), // Mock the res.json function
        status: jest.fn().mockReturnThis() // Mock the res.status function
      };

      await carbonFootprintController.createCarbonFootprintPossibleAction(req, res);

      expect(CarbonFootprint.createCarbonFootprintPossibleAction).toHaveBeenCalledWith(newAction);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newAction);
    });

    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Error creating action";
      CarbonFootprint.createCarbonFootprintPossibleAction.mockRejectedValue(new Error(errorMessage));

      const req = { body: { action: "Use less plastic" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() // Mock the res.json function
      };

      await carbonFootprintController.createCarbonFootprintPossibleAction(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error creating action' });
    });
  });

  describe("updateCarbonFootprintPossibleAction", () => {
    it("should update an action and return the updated action", async () => {
      const id = "1"; // Change id to string
      const updatedAction = { id, action: "Reduce plastic use" };

      CarbonFootprint.updateCarbonFootprintPossibleAction.mockResolvedValue(updatedAction);

      const req = { params: { id }, body: updatedAction };
      const res = {
        json: jest.fn(), // Mock the res.json function
        status: jest.fn().mockReturnThis() // Mock the res.status function
      };

      await carbonFootprintController.updateCarbonFootprintPossibleAction(req, res);

      expect(CarbonFootprint.updateCarbonFootprintPossibleAction).toHaveBeenCalledWith(id, updatedAction);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedAction);
    });

    it("should return 404 if action to update is not found", async () => {
      const id = "999"; // Change id to string
      CarbonFootprint.updateCarbonFootprintPossibleAction.mockResolvedValue(null);

      const req = { params: { id }, body: { action: "Reduce plastic use" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() // Mock the res.json function
      };

      await carbonFootprintController.updateCarbonFootprintPossibleAction(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Action not found' });
    });

    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Error updating action";
      CarbonFootprint.updateCarbonFootprintPossibleAction.mockRejectedValue(new Error(errorMessage));

      const req = { params: { id: "1" }, body: { action: "Reduce plastic use" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() // Mock the res.json function
      };

      await carbonFootprintController.updateCarbonFootprintPossibleAction(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error updating action' });
    });
  });

  describe("deleteCarbonFootprintPossibleAction", () => {
    it("should delete an action and return a success message", async () => {
      const id = "1"; // Change id to string
      CarbonFootprint.deleteCarbonFootprintPossibleAction.mockResolvedValue({ message: "Action deleted successfully" });

      const req = { params: { id } };
      const res = {
        json: jest.fn(), // Mock the res.json function
        status: jest.fn().mockReturnThis() // Mock the res.status function
      };

      await carbonFootprintController.deleteCarbonFootprintPossibleAction(req, res);
    });

    it("should return 404 if action to delete is not found", async () => {
    const id = "999"; // Change id to string
    CarbonFootprint.deleteCarbonFootprintPossibleAction.mockResolvedValue(null);

    const req = { params: { id } };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() // Mock the res.json function
    };

    await carbonFootprintController.deleteCarbonFootprintPossibleAction(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Action not found' });
    });
  
    it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Error deleting action";
    CarbonFootprint.deleteCarbonFootprintPossibleAction.mockRejectedValue(new Error(errorMessage));

    const req = { params: { id: "1" } };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn() // Mock the res.json function
    };

    await carbonFootprintController.deleteCarbonFootprintPossibleAction(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error deleting action' });
    });
});
});


