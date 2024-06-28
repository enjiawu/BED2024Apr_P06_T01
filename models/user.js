const sql = require("mssql");
const dbConfig = require("../ReThink/dbConfig");

class User {
    constructor(
        userId,
        username,
        email,
        location,
        bio,
        profilePicture,
        password
    ) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.location = location;
        this.bio = bio;
        this.profilePicture = profilePicture;
        this.password = password;
    }

    static async getUsersWithPosts() {
        const connection = await sql.connect(dbConfig);

        try {
            const sqlQuery =
                "SELECT u.userId, u.username, p.postId, p.title, p.description FROM Users u LEFT JOIN UserCommunityPosts up ON up.userId = u.userId LEFT JOIN CommunityPosts p ON up.postId = p.postId ORDER BY u.username";

            const result = await connection.request().query(sqlQuery);

            const usersWithPosts = {};
            for (const row of result.recordset) {
                const userId = row.userId;
                if (!usersWithPosts[userId]) {
                    usersWithPosts[userId] = {
                        userId: userId,
                        username: row.username,
                        posts: [],
                    };
                }
                usersWithPosts[userId].posts.push({
                    postId: row.postId,
                    title: row.title,
                    description: row.description,
                });
            }
            return Object.values(usersWithPosts);
        } catch (error) {
            throw new Error("Error fetching users with posts");
        } finally {
            await connection.close();
        }
    }

    static async addPostsToUser(newPostData) {
        const connection = await sql.connect(dbConfig);
        try {
            //Check if the post already exists for the user
            const checkQuery = `SELECT COUNT(*) as count FROM UserCommunityPosts WHERE userId = @userId AND postId = @postId`;
            const checkRequest = connection.request();
            checkRequest.input("userId", newPostData.userId);
            checkRequest.input("postId", newPostData.postId);
            const checkResult = await checkRequest.query(checkQuery);

            if (checkResult.recordset[0].count > 0) {
                return "Post Already Exists";
            }

            const sqlQuery = `INSERT INTO UserCommunityPosts (userId, postId) 
            VALUES (@userId, @postId) 
            SELECT SCOPE_IDENTITY() AS userCommunityPostId `;

            const request = connection.request();
            request.input("userId", newPostData.userId);
            request.input("postId", newPostData.postId);
            const result = await request.query(sqlQuery);

            return await this.getUsersWithPosts();
        } catch (error) {
            throw new Error({ error: "Could not add posts to users" });
        } finally {
            await connection.close();
        }
    }

    static async removePostsFromUser(postId, newUserData) {
        const connection = await sql.connect(dbConfig);

        try {
            const sqlQuery = `DELETE FROM UserCommunityPosts WHERE userId = @userId and postId = @postId`;

            const request = connection.request();
            request.input("userId", newUserData.userId);
            request.input("postId", postId);
            const result = await request.query(sqlQuery);

            if (result.rowsAffected === 0) {
                return null;
            }
            return await this.getUsersWithPosts();
        } catch (error) {
            throw new Error({ message: "Could not remove post from user" });
        } finally {
            await connection.close();
        }
    }

    static async getUserCount() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT COUNT(*) AS 'userCount' FROM Users";

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0];
    }
}

module.exports = User;
