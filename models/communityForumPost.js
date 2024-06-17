const sql = require("mssql");
const dbConfig = require("../dbConfig");

class communityForumPost {
    constructor(postId, userId, title, description, topicId, likes, comments, dateCreated) {
        this.postId = postId;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.topicId = topicId;
        this.likes = likes;
        this.comments = comments;
        this.dateCreated = dateCreated;
    };

    static async getAllPosts() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM CommunityPosts`;

        const result = await connection.request().query(sqlQuery);

        connection.close();
        
        return result.recordset.map(
            row => new communityForumPost(row.postId, row.userId, row.title, row.description, row.topicId, row.likes, row.comments, row.dateCreated)
        );
    };

    static async getPostById(postId){
        const connection = await sql.connect(dbConfig);
         
        const sqlQuery = `SELECT * FROM CommunityPosts WHERE postId = @postId`;

        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0] ?
        new communityForumPost(
            result.recordset[0].postId, 
            result.recordset[0].userId, 
            result.recordset[0].title, 
            result.recordset[0].description, 
            result.recordset[0].topicId, 
            result.recordset[0].likes, 
            result.recordset[0].comments, 
            result.recordset[0].dateCreated) : null;
    }

    static async createPost(newPostData){
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO CommunityPosts (userId, title, description, topicId, likes, comments, dateCreated) 
        VALUES 
        (@userId, @title, @description, @topicId, 0, 0, GETDATE());
        SELECT SCOPE_IDENTITY() AS postId;`

        const request = connection.request();
        request.input("userId", newPostData.userId);
        request.input("title", newPostData.title);
        request.input("description", newPostData.description);
        request.input("topicId", newPostData.topicId);
        const result = await request.query(sqlQuery);

        connection.close();

        return this.getPostById(result.recordset[0].postId);
    }

    static async updatePost(postId, newPostData){
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE CommunityPosts SET title = @title, description = @description, topicId = @topicId WHERE postId = @postId`;

        const request = connection.request();
        request.input("title", newPostData.title || null);
        request.input("description", newPostData.description || null);
        request.input("topicId", newPostData.topicId || null);
        request.input("postId", postId);
        await request.query(sqlQuery);

        connection.close();

        return this.getPostById(postId);
    }

    static async deletePost(postId){
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM CommunityPosts WHERE postId = @postId`;

        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected > 0;
    }

    static async searchPosts(searchTerm){
        const connection = await sql.connect(dbConfig);
        try{
            const sqlQuery = `SELECT * FROM CommunityPosts WHERE title LIKE '%${searchTerm}%';`;

            const result = await connection.request().query(sqlQuery);

            return result.recordset;
        }
        catch(error){
            throw new Error("Error searching posts")
        }
        finally{
            await connection.close();
        }

    }

    static async getPostCount() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT COUNT(*) AS 'postCount' FROM CommunityPosts";

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0];
    }
}
module.exports = communityForumPost;