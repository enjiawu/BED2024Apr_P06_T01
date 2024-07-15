const sql = require("mssql");
const dbConfig = require("../dbConfig");

class CommentReport {
    constructor(reportId, commentId, postId, userId, dateReported, reason) {
        this.reportId = reportId;
        this.commentId = commentId;
        this.postId = postId;
        this.userId = userId;
        this.dateReported = dateReported;
        this.reason = reason;
    }

    static async getAllCommentReports() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT * FROM CommentReports";

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) =>
                new CommentReport(
                    row.reportId,
                    row.commentId,
                    row.postId,
                    row.userId,
                    row.dateReported,
                    row.reason
                )
        );
    }

    static async getCommentReportById(reportId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery =
            "SELECT * FROM CommentReports WHERE reportId = @reportId";

        const request = connection.request();
        request.input("reportId", reportId);

        const result = await request.query(sqlQuery);

        return result.recordset[0]
            ? new CommentReport(
                  result.recordset[0].reportId,
                  result.recordset[0].commentId,
                  result.recordset[0].postId,
                  result.recordset[0].userId,
                  result.recordset[0].dateReported,
                  result.recordset[0].reason
              )
            : null;
    }

    static async deleteCommentReport(reportId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery =
            "DELETE FROM CommentReports WHERE reportId = @reportId";

        const request = connection.request();
        request.input("reportId", reportId);

        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected > 0;
    }
}

module.exports = CommentReport;
