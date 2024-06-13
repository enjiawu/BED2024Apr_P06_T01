const sql = require("mssql");
const dbConfig = require("../dbConfig");

class ContactUsSubmission {
    constructor(
        SubmissionId,
        FirstName,
        LastName,
        Email,
        PhoneNumber,
        Message
    ) {
        this.SubmissionId = SubmissionId;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.Email = Email;
        this.PhoneNumber = PhoneNumber;
        this.Message = Message;
    }

    static async getAllSubmissions() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT * FROM ContactUsSubmissions";

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) =>
                new ContactUsSubmission(
                    row.SubmissionId,
                    row.FirstName,
                    row.LastName,
                    row.Email,
                    row.PhoneNumber,
                    row.Message
                )
        );
    }

    static async getSubmissionById(id) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery =
            "SELECT * FROM ContactUsSubmissions WHERE SubmissionId = @id";

        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new ContactUsSubmission(
                  result.recordset[0].SubmissionId,
                  result.recordset[0].FirstName,
                  result.recordset[0].LastName,
                  result.recordset[0].Email,
                  result.recordset[0].PhoneNumber,
                  result.recordset[0].Message
              )
            : null;
    }
}

module.exports = ContactUsSubmission;
