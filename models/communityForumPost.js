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
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM CommunityPosts`;

        const result = await connection.request().query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) =>
                new communityForumPost(
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
            ? new communityForumPost(
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
        DELETE FROM Comments WHERE postId = @postId
        DELETE FROM PostLikes WHERE postId = @postId
        DELETE FROM PostReports WHERE postId = @postId
        DELETE FROM CommunityPosts WHERE postId = @postId`; // Delete post from comments, post reports and community posts

        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected[3] > 0; // Check that post has been deleted
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
            row => new communityForumPost(row.postId, row.userId, row.title, row.description, row.topicId, row.likes, row.comments, row.dateCreated, row.dateUpdated, row.reports)
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

    static async getAllLikes(){
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT SUM(likes) AS totalLikes FROM CommunityPosts`;

        const result = await connection.request().query(sqlQuery);

        connection.close();

        return result.recordset[0];    
    }

    // Sorting of posts by likes and date created
    static async sortPostsByLikesDesc(){
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM CommunityPosts ORDER BY likes DESC`;

        const result = await connection.request().query(sqlQuery);

        connection.close();

        return result.recordset.map(
            row => new communityForumPost(row.postId, row.userId, row.title, row.description, row.topicId, row.likes, row.comments, row.dateCreated, row.dateUpdated, row.reports)
        );
    }

    static async sortPostsByLikesAsc(){
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM CommunityPosts ORDER BY likes ASC`;

        const result = await connection.request().query(sqlQuery);

        connection.close();

        return result.recordset.map(
            row => new communityForumPost(row.postId, row.userId, row.title, row.description, row.topicId, row.likes, row.comments, row.dateCreated, row.dateUpdated, row.reports)
        );
    }

    static async sortPostsByNewest(){
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM CommunityPosts ORDER BY dateCreated DESC`;

        const result = await connection.request().query(sqlQuery);

        connection.close();

        return result.recordset.map(
            row => new communityForumPost(row.postId, row.userId, row.title, row.description, row.topicId, row.likes, row.comments, row.dateCreated, row.dateUpdated, row.reports)
        );
    }

    static async sortPostsByOldest(){
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM CommunityPosts ORDER BY dateCreated ASC`;

        const result = await connection.request().query(sqlQuery);

        connection.close();

        return result.recordset.map(
            row => new communityForumPost(row.postId, row.userId, row.title, row.description, row.topicId, row.likes, row.comments, row.dateCreated, row.dateUpdated, row.reports)
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

        const result = await request.query(sqlQuery);

        connection.close();

        console.log(result.rowsAffected)

        return result.rowsAffected[1] > 0 && result.rowsAffected[2] > 0; // Check that both queries are successful
    }

    static async unlikePost(postId, userId) {
        const connection = await sql.connect(dbConfig);

        const updatePostQuery = `
        UPDATE CommunityPosts
        SET likes = likes - 1
        WHERE postId = @postId
        `;
        const deleteLikeQuery = `
            DELETE FROM PostLikes
            WHERE postId = @postId AND userId = @userId
        `;

        const request = connection.request();
        request.input("postId", postId);
        request.input("userId", userId);

        const postResult = await request.query(updatePostQuery);
        const likeResult = await request.query(deleteLikeQuery);

        connection.close();

        return postResult.rowsAffected > 0 && likeResult.rowsAffected > 0;
    }

    // Comments
    // Getting all comments for the post
    static async getCommentsByPost(postId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Comments WHERE postId = @postId`;

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
        SELECT SCOPE_IDENTITY() AS commentId;`;

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

        const sqlQuery = `UPDATE Comments SET userId = @userId, postId = @postId, description = @description, dateUpdated = GETDATE() WHERE commentId = @commentId`;

        const request = connection.request();
        request.input("userId", newCommentData.userId || null);
        request.input("postId", newCommentData.postId || null);
        request.input("description", newCommentData.description || null);
        request.input("commentId", commentId);
        const result = await request.query(sqlQuery);

        connection.close();

        return this.getCommentById(commentId);
    }

    // Deleting the comment if it belongs to the user or the admin or the post owner
    static async deleteComment(commentId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        DELETE FROM CommentReports WHERE commentId = @commentId
        DELETE FROM Comments WHERE parentCommentId = @commentId
        DELETE FROM Comments WHERE commentId = @commentId`;

        const request = connection.request();
        request.input("commentId", commentId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected[2] > 0; // Check that comment has been deleted
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

    // Reply to comments on a specific post
    static async replyToComment(commentId, newReplyData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Comments (userId, postId, description, dateCreated, parentCommentId) 
        VALUES 
        (@userId, @postId, @description, GETDATE(), @parentCommentId);
        SELECT SCOPE_IDENTITY() AS commentId;`;

        const request = connection.request();
        request.input("userId", newReplyData.userId);
        request.input("postId", newReplyData.postId);
        request.input("description", newReplyData.description);
        request.input("parentCommentId", commentId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected[0] > 0;
    }

    // Getting all replies for the comment
    static async getRepliesByComment(commentId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Comments WHERE parentCommentId = @parentCommentId`;

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
- View Post Details: Click on a post to see its full content, including text, images.
- Like Posts: Express appreciation or agreement by liking a post. Each user account can like a post once.
- Comment on Posts: Share thoughts, ask questions, or provide feedback on posts. Users can engage in discussions related to the post content.
- Reply to Comments: Respond directly to comments made by other users, fostering deeper conversations.
- View Likes and Comments: See how many likes a post has received and read through comments left by other community members on the post details, community main page or post page.
- Delete Own Comments: Remove comments made by the user, providing control over their contributions.

Creating and Managing Posts:
- Create New Community Posts: Write and publish new posts to share content, ideas, questions, or updates with the community.
- Edit Own Posts: Update the content of posts after they’ve been published, allowing for corrections or additional information.
- Delete Own Posts: Remove posts from the community platform if no longer relevant or necessary.
- Delete Comments: Remove commentsn their posts, providing moderation control over the discussion.

Additional Actions:
- Report Posts: Flag posts that violate community guidelines or are deemed inappropriate. Each post can usually be reported only once per user.
- Explore Trending Topics: Click on trending topics or popular tags to discover posts related to those subjects, facilitating exploration and participation in trending discussions.

User Profile and Settings:
- View posts created by the user: Access a list of posts authored by the user to review past contributions and choose to edit/delete
- Notifications: Control how and when notifications about new posts, comments, or replies are received.

Community Management (Moderators/Admins):
- Moderate Posts and Comments: Monitor and manage posts and comments to ensure they adhere to community guidelines
- See reported posts: View a list of posts that have been reported by users and take appropriate action.

// IF GOT TIME
- Pin Posts: Highlight important posts or announcements by pinning them to the top of the feed or a specific section.
- Create Announcements: Share important updates or announcements with the entire community.
- Create Real Time effect of statistics changing when a user interacts with the post.
- Share Posts: Share interesting or relevant posts with others via social media platforms or direct messaging.
- Let admin manage topics

*/

