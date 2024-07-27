const axios = require('axios');
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const CarbonFootprint = require('../models/CarbonFootprint');

jest.mock('axios');
jest.mock('mssql');

describe('CarbonFootprint Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateCarbonFootprint', () => {
    it('should calculate the total carbon footprint', async () => {
      const carTravel = { distance: 100, vehicle: 'car' };
      const publicTransport = { distance: 50, type: 'bus' };
      const flight = { distance: 500, type: 'long-haul' };
      const motorBike = { type: 'motorbike', distance: 20 };

      axios.get
        .mockResolvedValueOnce({ data: { carbonEquivalent: 10 } }) // Car travel
        .mockResolvedValueOnce({ data: { carbonEquivalent: 5 } }) // Flight
        .mockResolvedValueOnce({ data: { carbonEquivalent: 2 } }) // Motorbike
        .mockResolvedValueOnce({ data: { carbonEquivalent: 3 } }); // Public transport

      const result = await CarbonFootprint.calculateCarbonFootprint(carTravel, publicTransport, flight, motorBike);

      expect(result.totalCarbonFootprint).toBe(20);
      expect(result.individualCF).toEqual([10, 5, 2, 3]);
    });

    it('should handle errors when calculating carbon footprint', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));

      await expect(
        CarbonFootprint.calculateCarbonFootprint({}, {}, {}, {})
      ).rejects.toThrow('API Error');
    });
  });

  describe('getTreeEquivalent', () => {
    it('should return the number of trees needed to offset carbon footprint', async () => {
      axios.get.mockResolvedValue({ data: { numberOfTrees: 15.7 } });

      const result = await CarbonFootprint.getTreeEquivalent(100);

      expect(result).toBe(16);
    });

    it('should handle errors when getting tree equivalent', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));

      await expect(
        CarbonFootprint.getTreeEquivalent(100)
      ).rejects.toThrow('API Error');
    });
  });

  describe('getTipsByGrade', () => {
    it('should retrieve carbon footprint tips based on grade', async () => {
      const mockTips = [{ tipId: 1, tip: 'Reduce car usage' }];
      const mockRequest = {  
        input: jest.fn().mockReturnThis(), 
        query: jest.fn().mockResolvedValue({ recordset: mockTips }) 
      };

      const mockConnection = { 
        request: jest.fn().mockReturnValue(mockRequest), 
        close: jest.fn().mockResolvedValue(undefined) 
      };

      sql.connect.mockResolvedValue(mockConnection);

      const tips = await CarbonFootprint.getTipsByGrade('average');

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(mockConnection.request).toHaveBeenCalledTimes(1);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(tips).toEqual(mockTips);
    });

    it('should handle errors when retrieving tips by grade', async () => {
      sql.connect.mockRejectedValue(new Error('Database Error'));

      await expect(
        CarbonFootprint.getTipsByGrade('average')
      ).rejects.toThrow('Database Error');
    });
  });

  describe('updateCarbonFootprint', () => {
    it('should update the carbon footprint in the database', async () => {
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

      const result = await CarbonFootprint.updateCarbonFootprint(10, 5, 3, 2, 6, 26);

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(mockConnection.request).toHaveBeenCalledTimes(1);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined(); // No return value expected
    });

    it('should handle errors when updating carbon footprint', async () => {
      sql.connect.mockRejectedValue(new Error('Database Error'));

      await expect(
        CarbonFootprint.updateCarbonFootprint(10, 5, 3, 2, 6, 26)
      ).rejects.toThrow('Database Error');
    });
  });

  describe('compareStats', () => {
    it('should retrieve average carbon footprint statistics', async () => {
      const mockStats = {
        avgCarTravel: 10,
        avgPublicTransport: 5,
        avgFlight: 8,
        avgMotorBike: 3,
        avgTreeEquivalent: 7,
        avgTotalCarbonFootprint: 33
      };
      const mockRequest = { 
        query: jest.fn().mockResolvedValue({ recordset: [mockStats] }) 
      };

      const mockConnection = { 
        request: jest.fn().mockReturnValue(mockRequest), 
        close: jest.fn().mockResolvedValue(undefined) 
      };

      sql.connect.mockResolvedValue(mockConnection);

      const stats = await CarbonFootprint.compareStats();

      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(mockConnection.request).toHaveBeenCalledTimes(1);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(stats).toEqual(mockStats);
    });

    it('should handle errors when comparing stats', async () => {
      sql.connect.mockRejectedValue(new Error('Database Error'));

      await expect(
        CarbonFootprint.compareStats()
      ).rejects.toThrow('Database Error');
    });
  });
});
