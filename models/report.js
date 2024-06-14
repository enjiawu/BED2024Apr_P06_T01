const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Report {
    constructor(reportId, postId, userId, dateReported, reason) {
        this.reportId = reportId;
        this.postId = postId;
        this.userId = userId;
        this.dateReported = dateReported;
        this.reason = reason;
    }

    static async getAllReports() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT * FROM PostReports";

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) =>
                new Report(
                    row.reportId,
                    row.postId,
                    row.userId,
                    row.dateReported,
                    row.reason
                )
        );
    }

    static async getReportById(reportId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT * FROM PostReports WHERE reportId = @reportId";

        const request = connection.request();
        request.input("reportId", reportId);

        const result = await request.query(sqlQuery);

        return result.recordset[0]
            ? new Report(
                  result.recordset[0].reportId,
                  result.recordset[0].postId,
                  result.recordset[0].userId,
                  result.recordset[0].dateReported,
                  result.recordset[0].reason
              )
            : null;
    }

    static async deleteReport(reportId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "DELETE FROM PostReports WHERE reportId = @reportId";

        const request = connection.request();
        request.input("reportId", reportId);

        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected > 0;
    }
}

module.exports = Report;
