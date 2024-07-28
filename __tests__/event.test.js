// event.test.js
const Event = require("../models/event");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Event.getAllEvents", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it("should retrieve all events from the database", async () => {
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
        
        const mockRequest = {
            query: jest.fn().mockResolvedValue({ recordset: mockEvents }),
        };
        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };
        
        sql.connect.mockResolvedValue(mockConnection); // Return the mock connection
        
        const events = await Event.getAllEvents();

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(events).toHaveLength(2);
        expect(events[0]).toBeInstanceOf(Event);
        expect(events[0].eventId).toBe(1);
        expect(events[0].title).toBe("Sustainable Living Workshop");
        expect(events[0].description).toBe("Learn practical tips for reducing your carbon footprint and living more sustainably.");
        expect(events[0].image).toBe("../images/sampleEvents/SustainableLogo.jpg");
        expect(events[0].datePosted).toBe("2024-06-15T12:00:00.000Z");
        expect(events[0].location).toBe("New York");
        expect(events[0].startDate).toBe("2024-07-01T00:00:00.000Z");
        expect(events[0].startTime).toBe("1970-01-01T09:00:00.000Z");
        expect(events[0].status).toBe("Open");
        expect(events[0].likes).toBe(6);
        expect(events[0].userId).toBe(1);
        expect(events[0].username).toBe("john_doe");
        expect(events[0].staffId).toBe(1);
        expect(events[0].staffName).toBe("Michael Johnson");
        // ... Add assertions for the second event
        expect(events[1]).toBeInstanceOf(Event);
        expect(events[1].eventId).toBe(2);
        expect(events[1].title).toBe("Green Energy Summit 2024");
        expect(events[1].description).toBe("Join experts to discuss the future of renewable energy and sustainable practices.");
        expect(events[1].image).toBe("../images/sampleEvents/GreenEnergyLogo.jpg");
        expect(events[1].datePosted).toBe("2024-06-10T11:00:00.000Z");
        expect(events[1].location).toBe("Los Angeles");
        expect(events[1].startDate).toBe("2024-08-15T00:00:00.000Z");
        expect(events[1].startTime).toBe("1970-01-01T10:30:00.000Z");
        expect(events[1].status).toBe("Closed");
        expect(events[1].likes).toBe(8);
        expect(events[1].userId).toBe(2);
        expect(events[1].username).toBe("jane_smith");
        expect(events[1].staffId).toBe(2);
        expect(events[1].staffName).toBe("Emily Davis");
        
    });
    
    it("should handle errors when retrieving events", async () => {
        const errorMessage = "Database Error";
        sql.connect.mockRejectedValue(new Error(errorMessage));
        await expect(Event.getAllEvents()).rejects.toThrow(errorMessage);
    });
});

describe('Event.createEvent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new event and return it with status 201', async () => {
        const newEventData = {
            userId: 1,
            username: 'user123',
            title: 'New Event',
            description: 'This is a new event.',
            image: 'image_url',
            location: 'New York',
            startDate: '2024-08-01',
            startTime: '10:00',
            status: 'Open',
            likes: 0,
            datePosted: new Date()
        };
        
        const createdEvent = { eventId: 3, ...newEventData };

        const mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue({ recordset: [{ eventId: 3 }] })
        };
        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };

        sql.connect.mockResolvedValue(mockConnection);

        // Mock getEventById to return createdEvent
        jest.spyOn(Event, 'getEventById').mockResolvedValue(createdEvent);

        const result = await Event.createEvent(newEventData);

        expect(sql.connect).toHaveBeenCalledTimes(1);
        expect(mockConnection.request).toHaveBeenCalledTimes(1);
        expect(mockRequest.input).toHaveBeenCalledWith('title', newEventData.title);
        expect(mockRequest.input).toHaveBeenCalledWith('description', newEventData.description);
        expect(mockRequest.input).toHaveBeenCalledWith('image', newEventData.image);
        expect(mockRequest.input).toHaveBeenCalledWith('datePosted', newEventData.datePosted);
        expect(mockRequest.input).toHaveBeenCalledWith('location', newEventData.location);
        expect(mockRequest.input).toHaveBeenCalledWith('startDate', newEventData.startDate);
        expect(mockRequest.input).toHaveBeenCalledWith('startTime', newEventData.startTime);
        expect(mockRequest.input).toHaveBeenCalledWith('status', newEventData.status);
        expect(mockRequest.input).toHaveBeenCalledWith('likes', newEventData.likes);
        expect(mockRequest.input).toHaveBeenCalledWith('userId', newEventData.userId);
        expect(mockRequest.input).toHaveBeenCalledWith('username', newEventData.username);
        expect(mockRequest.query).toHaveBeenCalledWith(
            `INSERT INTO Events (title, description, image, datePosted, location, startDate, startTime, status, likes, userId, username, staffId, staffName) 
        VALUES 
        (@title, @description, @image, GETDATE(), @location, @startDate, @startTime, @status, 0, @userId, @username, null, null);
        SELECT SCOPE_IDENTITY() AS eventId;`
        );
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(Event.getEventById).toHaveBeenCalledWith(3);
        expect(result).toEqual(createdEvent);
    });

    it('should handle errors and throw an error', async () => {
        sql.connect.mockRejectedValue(new Error('Database Error'));

        const newEventData = {
            userId: 1,
            username: 'user123',
            title: 'New Event',
            description: 'This is a new event.',
            image: 'image_url',
            location: 'New York',
            startDate: '2024-08-01',
            startTime: '10:00',
            status: 'Open',
            likes: 0,
            datePosted: new Date()
        };

        await expect(Event.createEvent(newEventData)).rejects.toThrow('Database Error');
    });
});