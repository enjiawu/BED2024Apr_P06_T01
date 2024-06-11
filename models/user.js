const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
    constructor(username, email, location, bio, profilePicture, password) {
        this.username = username;
        this.email = email;
        this.location = location;
        this.bio = bio;
        this.profilePicture = profilePicture;
        this.password = password;
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
