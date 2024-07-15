const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

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

    static async getAllUsers() {
        try {
            let pool = await sql.connect(dbConfig);
            let users = await pool.request().query("SELECT * FROM Users");
            return users.recordset;
        } catch (error) {
            console.log(error);
        }
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

    static async getUserByUsername(username) {
        try {
            let pool = await sql.connect(dbConfig);
            let user = await pool
                .request()
                .input("username", username)
                .query("SELECT * FROM Users WHERE username = @username");
            return user.recordset[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async getUserByEmail(email) {
        try {
            let pool = await sql.connect(dbConfig);
            let user = await pool
                .request()
                .input("email", email)
                .query("SELECT * FROM Users WHERE email = @email");
            return user.recordset[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async createUser(username, email, passwordHash) {
        try{
            let pool = await sql.connect(dbConfig);
            let user = await pool
                .request()
                .input("username", username)
                .input("email", email)
                .input("passwordHash", passwordHash)
                .input("role", "member")
                .query(
                    "INSERT INTO Users (username, email, passwordHash, role) VALUES (@username, @email, @passwordHash, @role); SELECT SCOPE_IDENTITY() AS id;"
                );
                console.log("Insert result:", user);
            return user.recordset[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteUser(userId) {
        try {
            let pool = await sql.connect(dbConfig);
            let user = await pool
                .request()
                .input("userId", userId)
                .query("DELETE FROM Users WHERE userId = @userId");
            return user;
        } catch (error) {
            console.log(error);
        }
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
