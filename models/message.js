const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Message {
    constructor(
        messageId,
        firstName,
        lastName,
        email,
        phoneNumber,
        message,
        status
    ) {
        this.messageId = messageId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.message = message;
        this.status = status;
    }

    static async getAllMessages() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT * FROM ContactUsSubmissions";

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) =>
                new Message(
                    row.submissionId,
                    row.firstName,
                    row.lastName,
                    row.email,
                    row.phoneNumber,
                    row.message,
                    row.status
                )
        );
    }

    static async getMessageById(messageId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery =
            "SELECT * FROM ContactUsSubmissions WHERE submissionId = @messageId";

        const request = connection.request();
        request.input("messageId", messageId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new Message(
                  result.recordset[0].submissionId,
                  result.recordset[0].firstName,
                  result.recordset[0].lastName,
                  result.recordset[0].email,
                  result.recordset[0].phoneNumber,
                  result.recordset[0].message,
                  result.recordset[0].status
              )
            : null;
    }
}

module.exports = Message;
