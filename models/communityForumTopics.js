const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Topic {
    constructor(topicId, topic) {
        this.topicId = topicId;
        this.topic = topic;
    }

    // Function to get all topics
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

    // Function to get topic by id
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

    // Function to get topic count
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

    // Function to create a new topic
    static async createTopic(topic) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);

            const sqlQuery = 
            `INSERT INTO CommunityForumTopics (topic) VALUES (@topic);
            SELECT SCOPE_IDENTITY() AS id;`;

            const request = connection.request();
            request.input("topic", topic);

            const results = await request.query(sqlQuery);

            return results.recordset[0];
        } catch (error) {
            console.error('Error in createTopic:', error);
            throw error;
        } finally {
            if (connection) connection.close();
        }
    }

    // Function to update an existing topic
    static async updateTopic(topicId, topic) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);

            const sqlQuery = `
            UPDATE CommunityForumTopics SET topic = @topic WHERE topicId = @topicId`;

            const request = connection.request();
            request.input("topicId", topicId);
            request.input("topic", topic || null);

            await request.query(sqlQuery);

            return await Topic.getTopicById(topicId);
        } catch (error) {
            console.error('Error in updateTopic:', error);
            throw error;
        } finally {
            if (connection) connection.close();
        }
    }

    // Function to delete a topic
    static async deleteTopic(topicId) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);

            const sqlQuery = `DELETE FROM CommunityForumTopics WHERE topicId = @topicId`;

            const request = connection.request();
            request.input("topicId", topicId);

            const result = await request.query(sqlQuery);

            return result.rowsAffected[0];
        } catch (error) {
            console.error('Error in deleteTopic:', error);
            throw error;
        } finally {
            if (connection) connection.close();
        }
    }

    // Function to check if a topic already exists
    static async checkIfTopicExists(topic) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);

            const sqlQuery = `SELECT * FROM CommunityForumTopics WHERE topic = @topic`;

            const request = connection.request();
            request.input("topic", topic);
            const result = await request.query(sqlQuery);

            return result.recordset[0] ? true : false;
        } catch (error) {
            console.error('Error in checkIfTopicExists:', error);
            throw error;
        } finally {
            if (connection) connection.close();
        }
    }

}

module.exports = Topic;
