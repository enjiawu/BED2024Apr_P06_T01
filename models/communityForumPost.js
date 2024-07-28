const sql = require("mssql");
const dbConfig = require("../dbConfig");

class CommunityForumPost {
    constructor(
        postId,
        userId,
        title,
        description,
        topicId,
        likes,
        comments,
        dateCreated,
        dateUpdated,
        reports
    ) {
        this.postId = postId;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.topicId = topicId;
        this.likes = likes;
        this.comments = comments;
        this.dateCreated = dateCreated;
        this.dateUpdated = dateUpdated;
        this.reports = reports;
    }

    // Getting all posts to display
    static async getAllPosts() {
        let connection;
        try {
            connection = await sql.connect(dbConfig);

            const sqlQuery = `SELECT * FROM CommunityPosts`;

            const result = await connection.request().query(sqlQuery);

            return result.recordset.map(
                (row) =>
                    new CommunityForumPost(
                        row.postId,
                        row.userId,
                        row.title,
                        row.description,
                        row.topicId,
                        row.likes,
                        row.comments,
                        row.dateCreated,
                        row.dateUpdated,
                        row.reports
                    )
            );
        } catch (error) {
            throw new Error("Error getting all posts");
        } finally {
            if (connection) {
                connection.close();
            }
        }
    };

    // Getting post by id for the invidiual post page
    static async getPostById(postId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM CommunityPosts WHERE postId = @postId`;

        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new CommunityForumPost(
                  result.recordset[0].postId,
                  result.recordset[0].userId,
                  result.recordset[0].title,
                  result.recordset[0].description,
                  result.recordset[0].topicId,
                  result.recordset[0].likes,
                  result.recordset[0].comments,
                  result.recordset[0].dateCreated,
                  result.recordset[0].dateUpdated,
                  result.recordset[0].reports
              )
            : null;
    }

    // Getting all posts by a specific user - Wenya
    static async getPostsByUserId(userId) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
    
            // Debugging statements
            console.log("SQL Query: SELECT * FROM CommunityPosts WHERE userId = @userId");
            console.log("User ID:", userId);
    
            const sqlQuery = `SELECT * FROM CommunityPosts WHERE userId = @userId`;
            const request = connection.request();
            request.input("userId", sql.Int, userId); // Ensure the data type is correct
    
            const result = await request.query(sqlQuery);
    
            // Debugging statement
            console.log("Database result:", result.recordset);
    
            return result.recordset.map(
                row => new CommunityForumPost(
                    row.postId,
                    row.userId,
                    row.title,
                    row.description,
                    row.topicId,
                    row.likes,
                    row.comments,
                    row.dateCreated,
                    row.dateUpdated,
                    row.reports
                )
            );
        } catch (error) {
            console.error("Database query error:", error);
            throw new Error("Error getting posts by user");
        } finally {
            if (connection) {
                connection.close();
            }
        }
    }

    // Creating the post if the user is logged in
    static async createPost(newPostData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO CommunityPosts (userId, title, description, topicId, dateCreated) 
        VALUES 
        (@userId, @title, @description, @topicId, GETDATE());
        SELECT SCOPE_IDENTITY() AS postId;`;

        const request = connection.request();
        request.input("userId", newPostData.userId);
        request.input("title", newPostData.title);
        request.input("description", newPostData.description);
        request.input("topicId", newPostData.topicId);
        const result = await request.query(sqlQuery);

        connection.close();

        return this.getPostById(result.recordset[0].postId);
    }

    // Updating the post if it belongs to the user
    static async updatePost(postId, newPostData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE CommunityPosts SET userId = @userId, title = @title, description = @description, topicId = @topicId, dateUpdated = GETDATE() WHERE postId = @postId`;

        const request = connection.request();
        request.input("userId", newPostData.userId || null);
        request.input("title", newPostData.title || null);
        request.input("description", newPostData.description || null);
        request.input("topicId", newPostData.topicId || null);
        request.input("postId", postId);
        await request.query(sqlQuery);

        connection.close();

        return this.getPostById(postId);
    }

    // Deleting the post if it belongs to the user or if its an admin
    static async deletePost(postId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `

        -- Delete likes and reports for child comments first
        DELETE FROM CommentLikes WHERE commentId IN (
            SELECT commentId FROM Comments WHERE postId = @postId AND parentCommentId IS NOT NULL
        );
        DELETE FROM CommentReports WHERE commentId IN (
            SELECT commentId FROM Comments WHERE postId = @postId AND parentCommentId IS NOT NULL
        );

        -- Delete child comments
        DELETE FROM Comments WHERE postId = @postId AND parentCommentId IS NOT NULL;

        -- Delete likes and reports for parent comments
        DELETE FROM CommentLikes WHERE commentId IN (
            SELECT commentId FROM Comments WHERE postId = @postId AND parentCommentId IS NULL
        );
        DELETE FROM CommentReports WHERE commentId IN (
            SELECT commentId FROM Comments WHERE postId = @postId AND parentCommentId IS NULL
        );

        -- Delete parent comments
        DELETE FROM Comments WHERE postId = @postId AND parentCommentId IS NULL;

        -- Delete post likes and reports
        DELETE FROM PostLikes WHERE postId = @postId;
        DELETE FROM PostReports WHERE postId = @postId;

        -- Delete the post itself
        DELETE FROM CommunityPosts WHERE postId = @postId;
        `; // Delete post from comments, post reports and community posts

        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected[5] > 0; // Check that post has been deleted
    }

    // Searching for posts based on the title
    static async searchPosts(searchTerm) {
        const connection = await sql.connect(dbConfig);
        try {
            const sqlQuery = `SELECT * FROM CommunityPosts WHERE title LIKE '%${searchTerm}%';`;

            const result = await connection.request().query(sqlQuery);

            return result.recordset;
        } catch (error) {
            throw new Error("Error searching posts");
        } finally {
            await connection.close();
        }
    }

    // Getting all posts by the specific topic
    static async getPostsByTopic(topicId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM CommunityPosts WHERE topicId = @topicId`;

        const request = connection.request();
        request.input("topicId", topicId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0] ? result.recordset.map(
            row => new CommunityForumPost(row.postId, row.userId, row.title, row.description, row.topicId, row.likes, row.comments, row.dateCreated, row.dateUpdated, row.reports)
        ) : null;
    }

    // Statistics for Community Forum (Total number of posts and likes)
    static async getPostCount() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT COUNT(*) AS 'postCount' FROM CommunityPosts";

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0];
    }

    // Get all likes for the posts
    static async getAllLikes(){
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT SUM(likes) AS totalLikes FROM CommunityPosts`;

        const result = await connection.request().query(sqlQuery);

        connection.close();

        return result.recordset[0];    
    }

    // Sorting of posts by likes and date created
    static async sortPostsByLikesDesc(topicId = null) {
        const connection = await sql.connect(dbConfig);
        let sqlQuery = `SELECT * FROM CommunityPosts`;
    
        if (topicId) {
            sqlQuery += ` WHERE topicId = @topicId`;
        }
    
        sqlQuery += ` ORDER BY likes DESC`;
    
        const request = connection.request();
    
        if (topicId) {
            request.input('topicId', sql.Int, topicId);
        }
    
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(
            row => new CommunityForumPost(row.postId, row.userId, row.title, row.description, row.topicId, row.likes, row.comments, row.dateCreated, row.dateUpdated, row.reports)
        );
    }
    
    static async sortPostsByLikesAsc(topicId = null) {
        const connection = await sql.connect(dbConfig);
        let sqlQuery = `SELECT * FROM CommunityPosts`;
    
        if (topicId) {
            sqlQuery += ` WHERE topicId = @topicId`;
        }
    
        sqlQuery += ` ORDER BY likes ASC`;
    
        const request = connection.request();
    
        if (topicId) {
            request.input('topicId', sql.Int, topicId);
        }
    
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(
            row => new CommunityForumPost(row.postId, row.userId, row.title, row.description, row.topicId, row.likes, row.comments, row.dateCreated, row.dateUpdated, row.reports)
        );
    }
    
    static async sortPostsByNewest(topicId = null) {
        const connection = await sql.connect(dbConfig);
        let sqlQuery = `SELECT * FROM CommunityPosts`;
    
        if (topicId) {
            sqlQuery += ` WHERE topicId = @topicId`;
        }
    
        sqlQuery += ` ORDER BY dateCreated DESC`;
    
        const request = connection.request();
    
        if (topicId) {
            request.input('topicId', sql.Int, topicId);
        }
    
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(
            row => new CommunityForumPost(row.postId, row.userId, row.title, row.description, row.topicId, row.likes, row.comments, row.dateCreated, row.dateUpdated, row.reports)
        );
    }
    
    static async sortPostsByOldest(topicId = null) {
        const connection = await sql.connect(dbConfig);
        let sqlQuery = `SELECT * FROM CommunityPosts`;
    
        if (topicId) {
            sqlQuery += ` WHERE topicId = @topicId`;
        }
    
        sqlQuery += ` ORDER BY dateCreated ASC`;
    
        const request = connection.request();
    
        if (topicId) {
            request.input('topicId', sql.Int, topicId);
        }
    
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(
            row => new CommunityForumPost(row.postId, row.userId, row.title, row.description, row.topicId, row.likes, row.comments, row.dateCreated, row.dateUpdated, row.reports)
        );
    }

    // To see the number of posts per topic
    static async getAllTopicCountsByPost() {
        const connection = await sql.connect(dbConfig);
      
        const sqlQuery = `SELECT t.topicId, t.topic, COUNT(*) as postCount FROM CommunityPosts cp INNER JOIN CommunityForumTopics t ON cp.topicId = t.topicId GROUP BY t.topicId, t.topic`;
      
        const result = await connection.request().query(sqlQuery);
      
        connection.close();
      
        return result.recordset.map(row => ({
          topicId: row.topicId,
          topic: row.topic,
          postCount: row.postCount
        }));
    }

    // Report post which redirects to admin
    static async reportPost(reportData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        UPDATE CommunityPosts SET reports = reports + 1 WHERE postId = @postId
        INSERT INTO PostReports (postId, userId, dateReported, reason) 
        VALUES (@postId, @userId, GETDATE(), @reason);

        SELECT SCOPE_IDENTITY() AS reportId;`;

        const request = connection.request();
        request.input("postId", reportData.postId);
        request.input("userId", reportData.userId);
        request.input("reason", reportData.reason);
        
        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected[1] > 0;
    }

    // Check if user has reported the post
    static async getReportByUser(postId, userId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM PostReports WHERE postId = @postId AND userId = @userId`;

        const request = connection.request();
        request.input("postId", postId);
        request.input("userId", userId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected[0] > 0;
    }

    // Check if user has liked the post
    static async getLikeByUser(postId, userId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            SELECT *
            FROM PostLikes
            WHERE postId = @postId AND userId = @userId;
        `;
        const request = connection.request();
        request.input("postId", postId);
        request.input("userId", userId);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.rowsAffected[0] > 0;
    }

    //Likes for posts - limited to 1 per user
    static async likePost(postId, userId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        UPDATE CommunityPosts
        SET likes = likes + 1
        WHERE postId = @postId

        INSERT INTO PostLikes (postId, userId)
        VALUES (@postId, @userId)
        SELECT SCOPE_IDENTITY() AS likeId;
        `;

        const request = connection.request();
        request.input("postId", postId);
        request.input("userId", userId);

        await request.query(sqlQuery);

        connection.close();

        return this.getPostById(postId); 
    }

    static async unlikePost(postId, userId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        UPDATE CommunityPosts
        SET likes = likes - 1
        WHERE postId = @postId

        DELETE FROM PostLikes
        WHERE postId = @postId AND userId = @userId
        `;

        const request = connection.request();
        request.input("postId", postId);
        request.input("userId", userId);

        await request.query(sqlQuery);

        connection.close();

        return this.getPostById(postId);
    }

    // Comments
    // Getting all comments for the post excluding the replies
    static async getCommentsByPost(postId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Comments WHERE postId = @postId AND parentCommentId IS NULL ORDER BY dateCreated DESC`;

        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset;
    }

    // Get comment by id 
    static async getCommentById(commentId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Comments WHERE commentId = @commentId`;

        const request = connection.request();
        request.input("commentId", commentId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0];
    }

    // Creating a comment for the post if the user is logged in
    static async createComment(postId, newCommentData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Comments (userId, postId, description, dateCreated) 
        VALUES 
        (@userId, @postId, @description, GETDATE());
        SELECT SCOPE_IDENTITY() AS commentId;
        
        UPDATE CommunityPosts SET comments = comments + 1 WHERE postId = @postId;`;

        const request = connection.request();
        request.input("userId", newCommentData.userId);
        request.input("postId", postId);
        request.input("description", newCommentData.description);
        const result = await request.query(sqlQuery);

        connection.close();

        return this.getCommentById(result.recordset[0].commentId);
    }

    // Updating the comment if it belongs to the user
    static async updateComment(commentId, newCommentData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Comments SET userId = @userId, description = @description, dateUpdated = GETDATE() WHERE commentId = @commentId`;

        const request = connection.request();
        request.input("userId", newCommentData.userId || null);
        request.input("description", newCommentData.description || null);
        request.input("commentId", commentId);
        await request.query(sqlQuery);

        connection.close();

        return this.getCommentById(commentId);
    }

    // Deleting the comment if it belongs to the user or the admin or the post owner
    static async deleteComment(commentId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        UPDATE CommunityPosts SET comments -= ((SELECT COUNT(*) FROM Comments WHERE parentCommentId = @commentId) + 1) where postId = (SELECT postId FROM comments where commentId = @commentId);

        DELETE FROM CommentLikes WHERE commentId = @commentId; 
        DELETE FROM CommentReports WHERE commentId = @commentId;
        DELETE FROM CommentReports WHERE commentId = (SELECT commentId FROM Comments WHERE parentCommentId = @commentId);
        DELETE FROM Comments WHERE parentCommentId = @commentId;
        DELETE FROM Comments WHERE commentId = @commentId;`;

        const request = connection.request();
        request.input("commentId", commentId);
        const result = await request.query(sqlQuery);

        console.log(result);

        connection.close();


        return result.rowsAffected[5] > 0; // Check that comment has been deleted
    }

    // Like comment
    static async likeComment(commentId, userId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        UPDATE Comments
        SET likes = likes + 1
        WHERE commentId = @commentId

        INSERT INTO CommentLikes (commentId, userId)
        VALUES (@commentId, @userId)
        SELECT SCOPE_IDENTITY() AS likeId;
        `;

        const request = connection.request();
        request.input("commentId", commentId);
        request.input("userId", userId);

        await request.query(sqlQuery);

        connection.close();

        return this.getCommentById(commentId);
    }

    // Unlike comment
    static async unlikeComment(commentId, userId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        UPDATE Comments
        SET likes = likes - 1
        WHERE commentId = @commentId

        DELETE FROM CommentLikes
        WHERE commentId = @commentId AND userId = @userId
        `;

        const request = connection.request();
        request.input("commentId", commentId);
        request.input("userId", userId);

        await request.query(sqlQuery);

        connection.close();

        return this.getCommentById(commentId);
    }

    // Get comment like by user
    static async getCommentLikeByUser(commentId, userId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            SELECT *
            FROM CommentLikes
            WHERE commentId = @commentId AND userId = @userId;
        `;
        const request = connection.request();
        request.input("commentId", commentId);
        request.input("userId", userId);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.rowsAffected[0] > 0;
    }

    // Report comment
    static async reportComment(reportData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        UPDATE Comments SET reports = reports + 1 WHERE commentId = @commentId
        INSERT INTO CommentReports (postId, commentId, userId, dateReported, reason)
        VALUES (@postId, @commentId, @userId, GETDATE(), @reason);
        SELECT SCOPE_IDENTITY() AS reportId;`;

        const request = connection.request();
        request.input("postId", reportData.postId);
        request.input("commentId", reportData.commentId);
        request.input("userId", reportData.userId);
        request.input("reason", reportData.reason);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected[0] > 0;
    }

    // Check if user has reported the comment
    static async getReportCommentByUser(commentId, userId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM CommentReports WHERE commentId = @commentId AND userId = @userId`;

        const request = connection.request();
        request.input("commentId", commentId);
        request.input("userId", userId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected[0] > 0;
    }

    // Reply to comments on a specific post
    static async replyToComment(postId, commentId, newReplyData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Comments (userId, postId, description, dateCreated, parentCommentId) 
        VALUES 
        (@userId, @postId, @description, GETDATE(), @parentCommentId);
        SELECT SCOPE_IDENTITY() AS commentId;
        
        UPDATE CommunityPosts SET comments = comments + 1 WHERE postId = @postId;`;

        const request = connection.request();
        request.input("userId", newReplyData.userId);
        request.input("postId", postId);
        request.input("description", newReplyData.description);
        request.input("parentCommentId", commentId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected[0] > 0;
    }

    // Getting all replies for the comment
    static async getRepliesByComment(commentId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Comments WHERE parentCommentId = @parentCommentId ORDER BY dateCreated DESC`;

        const request = connection.request();
        request.input("parentCommentId", commentId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset;
    }
}

module.exports = CommunityForumPost;


/*
Community Forum

View Community Posts: Browse through a feed or list of posts shared by other community members. [X]
View Community Post Statistics: See the number of likes, topics, and posts created. [X]

Search for Community Posts: Utilize a search function to find posts based on keywords, tags, or specific criteria. [X]

Sort Community Posts: Arrange posts according to different criteria such as: [X]
- Topics/categories
- Number of likes
- Newest posts
- Oldest posts

Interacting with Posts:
- View Post Details: Click on a post to see its full content. [x]
- Like Posts: Express appreciation or agreement by liking a post. Each user account can like a post once. [x]
- Comment on Posts: Share thoughts, ask questions, or provide feedback on posts. Users can engage in discussions related to the post content. [x]
- Reply to Comments: Respond directly to comments made by other users, fostering deeper conversations. [x]
- View Likes and Comments: See how many likes a post has received and read through comments left by other community members on the post details, community main page or post page. [x]
- Delete Own Comments: Remove comments made by the user, providing control over their contributions. [x]

Creating and Managing Posts:
- Create New Community Posts: Write and publish new posts to share content, ideas, questions, or updates with the community. [x]
- Edit Own Posts: Update the content of posts after they’ve been published, allowing for corrections or additional information.[x]
- Delete Own Posts: Remove posts from the community platform if no longer relevant or necessary.[x]
- Delete Comments: Remove commentsn their posts, providing moderation control over the discussion.[x]

Additional Actions:
- Report Posts: Flag posts that violate community guidelines or are deemed inappropriate. Each post can usually be reported only once per user.[x]

Community Management (Moderators/Admins):
- Moderate Posts and Comments: Monitor and manage posts and comments to ensure they adhere to community guidelines [x]
await connection.transaction(async (transaction) => {
            // Delete likes associated with the comment
            await transaction.request()
                .input("commentId", sql.Int, commentId)
                .query("DELETE FROM CommentLikes WHERE commentId = @commentId");

            // Delete reports associated with the comment
            await transaction.request()
                .input("commentId", sql.Int, commentId)
                .query("DELETE FROM CommentReports WHERE commentId = @commentId");

            // Delete child comments
            await transaction.request()
                .input("commentId", sql.Int, commentId)
                .query("DELETE FROM Comments WHERE parentCommentId = @commentId");

            // Delete the comment itself
            await transaction.request()
                .input("commentId", sql.Int, commentId)
                .query("DELETE FROM Comments WHERE commentId = @commentId");

            // Commit the transaction
            await transaction.commit();
        });
*/
