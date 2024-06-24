const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Topic {
    constructor(topicId, topic) {
        this.topicId = topicId;
        this.topic = topic;
    }

    static async getAllTopics() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM CommunityForumTopics`;

        const result = await connection.request().query(sqlQuery);

        connection.close();

        return result.recordset.map(
            row => new Topic(row.topicId, row.topic)
        );
    };

    static async getTopicById(topicId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM CommunityForumTopics WHERE topicId = @topicId`;

        const request = connection.request();
        request.input("topicId", topicId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0] ?
            new Topic(
                result.recordset[0].topicId,
                result.recordset[0].topic
            ) : null;
    }

    static async getTopicCount() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT COUNT(*) AS topicCount FROM CommunityForumTopics`;

        const result = await connection.request().query(sqlQuery);

        connection.close();

        return result.recordset[0].topicCount;
    }

}

module.exports = Topic;
