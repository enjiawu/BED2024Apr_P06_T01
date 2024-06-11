const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
    constructor(
        UserId,
        Username,
        Email,
        Location,
        Bio,
        ProfilePicture,
        Password
    ) {
        this.UserId = UserId;
        this.Username = Username;
        this.Email = Email;
        this.Location = Location;
        this.Bio = Bio;
        this.ProfilePicture = ProfilePicture;
        this.Password = Password;
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
