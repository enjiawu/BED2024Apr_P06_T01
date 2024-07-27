// eventsController.test.js

const eventsController = require("../controllers/eventsController");
const Event = require("../models/event");

// Mock the Event model
jest.mock("../models/event"); // Replace with the actual path to your Event model

describe("eventsController.getAllEvents", () => {
    beforeEach(() => {
        jest.clearAllMocks(); 
    });
    
    it("should fetch all events and return a JSON response", async () => {
        const mockEvents = [
            {
                eventId: 1,
                title: "Sustainable Living Workshop",
                description: "Learn practical tips for reducing your carbon footprint and living more sustainably.",
                image: "../images/sampleEvents/SustainableLogo.jpg",
                datePosted: "2024-06-15T12:00:00.000Z",
                location: "New York",
                startDate: "2024-07-01T00:00:00.000Z",
                startTime: "1970-01-01T09:00:00.000Z",
                status: "Open",
                likes: 6,
                userId: 1,
                username: "john_doe",
                staffId: 1,
                staffName: "Michael Johnson"
            },
            {
                eventId: 2,
                title: "Green Energy Summit 2024",
                description: "Join experts to discuss the future of renewable energy and sustainable practices.",
                image: "../images/sampleEvents/GreenEnergyLogo.jpg",
                datePosted: "2024-06-10T11:00:00.000Z",
                location: "Los Angeles",
                startDate: "2024-08-15T00:00:00.000Z",
                startTime: "1970-01-01T10:30:00.000Z",
                status: "Closed",
                likes: 8,
                userId: 2,
                username: "jane_smith",
                staffId: 2,
                staffName: "Emily Davis"
            }
        ];
        
        Event.getAllEvents.mockResolvedValue(mockEvents);
        const req = {};
        const res = {
            json: jest.fn(), 
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        
        await eventsController.getAllEvents(req, res);
        
        expect(Event.getAllEvents).toHaveBeenCalledTimes(1); 
        expect(res.json).toHaveBeenCalledWith(mockEvents); 
    });
    
    it("should handle errors and return a 500 status with error message", async () => {
        const errorMessage = "Database error";
        Event.getAllEvents.mockRejectedValue(new Error(errorMessage)); // Simulate an error
        
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        
        await eventsController.getAllEvents(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        
        expect(res.send).toHaveBeenCalledWith("Error retrieving events");
    });
});