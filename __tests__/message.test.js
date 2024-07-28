const Message = require("../models/message");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Message.getAllMessages", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should retrieve all messages from the database", async () => {
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

        const mockRequest = {
            query: jest.fn().mockResolvedValue({ recordset: mockMessages }),
        };
        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };

        sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

        const messages = await Message.getAllMessages();

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(messages).toHaveLength(2);
        expect(messages[0]).toBeInstanceOf(Message);
        expect(messages[0].messageId).toBe(1);
        expect(messages[0].firstName).toBe("John");
        expect(messages[0].lastName).toBe("Doe");
        expect(messages[0].email).toBe("john@mail.com");
        expect(messages[0].phoneNumber).toBe("12345678");
        expect(messages[0].status).toBe("replied");
        // ... Add assertions for the second book
    });

    it("should handle errors when retrieving books", async () => {
        const errorMessage = "Database Error";
        sql.connect.mockRejectedValue(new Error(errorMessage));
        await expect(Book.getAllBooks()).rejects.toThrow(errorMessage);
    });
});
