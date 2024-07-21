const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Topic {
    constructor(topicId, topic) {
        this.topicId = topicId;
        this.topic = topic;
    }

    static async getAllTopics() {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `SELECT * FROM CommunityForumTopics`;
            const result = await connection.request().query(sqlQuery);
            return result.recordset.map(row => new Topic(row.topicId, row.topic));
        } catch (error) {
            console.error('Error in getAllTopics:', error);
            throw error;
        } finally {
            if (connection) connection.close();
        }
    }

    static async getTopicById(topicId) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `SELECT * FROM CommunityForumTopics WHERE topicId = @topicId`;
            const request = connection.request();
            request.input("topicId", topicId);
            const result = await request.query(sqlQuery);
            return result.recordset[0] ? new Topic(result.recordset[0].topicId, result.recordset[0].topic) : null;
        } catch (error) {
            console.error('Error in getTopicById:', error);
            throw error;
        } finally {
            if (connection) connection.close();
        }
    }

    static async getTopicCount() {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `SELECT COUNT(*) AS topicCount FROM CommunityForumTopics`;
            const result = await connection.request().query(sqlQuery);
            return result.recordset[0];
        } catch (error) {
            console.error('Error in getTopicCount:', error);
            throw error;
        } finally {
            if (connection) connection.close();
        }
    }
}

module.exports = Topic;
