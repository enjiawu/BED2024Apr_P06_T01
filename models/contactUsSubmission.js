const sql = require("mssql");
const dbConfig = require("../dbConfig");

class ContactUsSubmission {
    constructor(
        submissionId,
        firstName,
        lastName,
        email,
        phoneNumber,
        message
    ) {
        this.submissionId = submissionId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.message = message;
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
                    row.submissionId,
                    row.firstName,
                    row.lastName,
                    row.email,
                    row.phoneNumber,
                    row.message
                )
        );
    }

    static async getSubmissionById(id) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery =
            "SELECT * FROM ContactUsSubmissions WHERE submissionId = @id";

        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new ContactUsSubmission(
                  result.recordset[0].submissionId,
                  result.recordset[0].firstName,
                  result.recordset[0].lastName,
                  result.recordset[0].email,
                  result.recordset[0].phoneNumber,
                  result.recordset[0].message
              )
            : null;
    }
}

module.exports = ContactUsSubmission;
