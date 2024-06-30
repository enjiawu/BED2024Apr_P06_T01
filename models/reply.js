const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Reply {
    constructor(replyId, messageId, staffId, replyDescription) {
        this.replyId = replyId;
        this.submissionId = messageId;
        this.staffId = staffId;
        this.replyDescription = replyDescription;
    }

    static async getReplyById(replyId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery =
            "SELECT * FROM ContactUsReplies WHERE replyId = @replyId";

        const request = connection.request();
        request.input("replyId", replyId);

        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new Reply(
                  result.recordset[0].replyId,
                  result.recordset[0].submissionId,
                  result.recordset[0].staffId,
                  result.recordset[0].replyDescription
              )
            : null;
    }

    static async addReply(reply) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery =
            "INSERT INTO ContactUsReplies (submissionId, staffId, replyDescription) VALUES (@messageId, @staffId, @replyDescription); SELECT SCOPE_IDENTITY() AS replyId";

        const request = connection.request();
        request.input("messageId", reply.submissionId);
        request.input("staffId", reply.staffId);
        request.input("replyDescription", reply.replyDescription);

        const result = await request.query(sqlQuery);

        return this.getReplyById(result.recordset[0].replyId);
    }
}

module.exports = Reply;
