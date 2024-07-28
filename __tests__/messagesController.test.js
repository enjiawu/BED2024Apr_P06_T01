const messagesController = require("../controllers/messagesController");
const Message = require("../models/message");

jest.mock("../models/message");

describe("messagesController.getAllMessages", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch all messages and return a JSON response", async () => {
        const mockMessages = [
            {
                messageId: 1,
                firstName: "John",
                lastName: "Doe",
                email: "john@mail.com",
                phoneNumber: "12345678",
                message: "Hello there!",
                status: "replied",
            },
            {
                messageId: 2,
                firstName: "Jane",
                lastName: "Doe",
                email: "jane@mail.com",
                phoneNumber: "87654321",
                message: "Hello!",
                status: "unanswered",
            },
        ];

        Message.getAllMessages.mockResolvedValue(mockMessages);

        const req = {};
        const res = {
            json: jest.fn(),
        };

        await messagesController.getAllMessages(req, res);

        expect(Message.getAllMessages).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(mockMessages);
    });

    it("should handle errors and return a 500 status with error message", async () => {
        const errorMessage = "Database error";
        Message.getAllMessages.mockRejectedValue(new Error(errorMessage));

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await messagesController.getAllMessages(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error retrieving messages");
    });
});

describe("getMessageById", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return message by ID with status 200", async () => {
        const mockMessage = {
            messageId: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john@mail.com",
            phoneNumber: "12345678",
            message: "Hello there!",
            status: "replied",
        };
        Message.getMessageById.mockResolvedValue(mockMessage);

        const req = { params: { messageId: "1" } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await messagesController.getMessageById(req, res);

        expect(Message.getMessageById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockMessage);
    });

    it("should return 404 if message not found", async () => {
        Message.getMessageById.mockResolvedValue(null);

        const req = { params: { messageId: "1" } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await messagesController.getMessageById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Message not found" });
    });

    it("should handle errors and return a 500 status", async () => {
        Message.getMessageById.mockRejectedValue(new Error("Error"));

        const req = { params: { messsageId: "1" } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await messagesController.getMessageById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Error retrieving message",
        });
    });
});
