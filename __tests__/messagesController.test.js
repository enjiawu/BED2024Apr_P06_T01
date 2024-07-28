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
