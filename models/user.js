const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcrypt");

class User {
    constructor(
        userId,
        username,
        email,
        location,
        bio,
        profilePicture,
        passwordHash
    ) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.location = location;
        this.bio = bio;
        this.profilePicture = profilePicture;
        this.passwordHash = passwordHash;
    }

    static async getUserById(userId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT * FROM Users WHERE userId = @userId";

        const request = connection.request();
        request.input("userId", userId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new User(
                  result.recordset[0].userId,
                  result.recordset[0].username,
                  result.recordset[0].email,
                  result.recordset[0].location,
                  result.recordset[0].bio,
                  result.recordset[0].profilePicture,
                  result.recordset[0].passwordHash
              )
            : null;
    }

    static async getAllUsers() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT * FROM Users";

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();
        return result.recordset.map(
            (row) =>
                new User(
                    row.userId,
                    row.username,
                    row.email,
                    row.location,
                    row.bio,
                    row.profilePicture,
                    row.passwordHash
                )
        );
    }

    static async authenticateUser(email, password) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT * FROM Users WHERE email = @Email";

        const request = connection.request();
        request.input("Email", email);
        const result = await request.query(sqlQuery);

        connection.close();

        if (result.recordset.length === 0) {
            throw new Error("User not found");
        }

        const user = result.recordset[0];
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            throw new Error("Invalid password");
        }

        return new User(
            user.userId,
            user.username,
            user.email,
            user.passwordHash
        );
    }

    static async registerUser(newUserData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery =
            "INSERT INTO Users (username, email, passwordHash) VALUES (@username, @email, @passwordHash); SELECT SCOPE_IDENTITY() AS id;";

        const hashedPassword = await bcrypt.hash(newUserData.passwordHash, 10);

        const request = connection.request();
        request.input("username", newUserData.username);
        request.input("email", newUserData.email);
        request.input("passwordHash", hashedPassword);

        const result = await request.query(sqlQuery);

        connection.close();

        return result;
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
