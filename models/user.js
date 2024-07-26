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

    static async getUserById(userId) {
        try {
            let pool = await sql.connect(dbConfig);
            let user = await pool
                .request()
                .input("userId", userId)
                .query("SELECT * FROM Users WHERE userId = @userId");
            return user.recordset[0];
        } catch (error) {
            console.log(error);
        }
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

    static async updateProfile(userId, newUserData) {
        const connection = await sql.connect(dbConfig);
    
        try {
            // Check if the new username already exists for a different user
            if (newUserData.username) {
                const usernameCheck = await connection.request()
                    .input("username", sql.VarChar, newUserData.username)
                    .input("userId", sql.Int, userId)
                    .query("SELECT userId FROM Users WHERE username = @username AND userId != @userId");

                if (usernameCheck.recordset.length > 0) {
                    return { error: "Username already exists" };
                }
            }

            // Check if the new email already exists for a different user
            if (newUserData.email) {
                const emailCheck = await connection.request()
                    .input("email", sql.VarChar, newUserData.email)
                    .input("userId", sql.Int, userId)
                    .query("SELECT userId FROM Users WHERE email = @email AND userId != @userId");

                if (emailCheck.recordset.length > 0) {
                    return { error: "Email already exists" };
                }
            }

            const sqlQuery = `
                UPDATE Users 
                SET 
                    username = @username, 
                    email = @email, 
                    location = @location, 
                    bio = @bio, 
                    profilePicture = @profilePicture
                    ${newUserData.passwordHash ? ", passwordHash = @passwordHash" : ""}
                WHERE userId = @userId
            `.replace(/,\s*$/, ''); // Remove trailing comma if passwordHash is not included

            const request = connection.request();
            request.input("userId", sql.Int, userId);
            request.input("username", sql.VarChar, newUserData.username || null);
            request.input("email", sql.VarChar, newUserData.email || null);
            request.input("location", sql.VarChar, newUserData.location || null);
            request.input("bio", sql.Text, newUserData.bio || null);
            request.input("profilePicture", sql.VarChar, newUserData.profilePicture || null);
            if (newUserData.passwordHash) {
                request.input("passwordHash", sql.VarChar, newUserData.passwordHash);
            }

            const result = await request.query(sqlQuery);
            connection.close();

            if (result.rowsAffected[0] === 0) {
                return null;
            }

            return this.getUserById(userId);
        } catch (error) {
            console.error('Error updating profile:', error);
            connection.close();
            throw error; // Re-throw error to be caught in the controller
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
