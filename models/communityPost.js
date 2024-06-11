const sql = require("mssql");
const dbConfig = require("../dbConfig");

class CommunityPost {
    constructor(
        PostId,
        UserId,
        Username,
        Title,
        Description,
        TopicId,
        Likes,
        Comments,
        DateCreated
    ) {
        this.PostId = PostId;
        this.UserId = UserId;
        this.Username = Username;
        this.Title = Title;
        this.Description = Description;
        this.TopicId = TopicId;
        this.Likes = Likes;
        this.Comments = Comments;
        this.DateCreated = DateCreated;
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

module.exports = CommunityPost;
