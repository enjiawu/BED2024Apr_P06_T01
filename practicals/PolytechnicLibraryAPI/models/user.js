const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

class User {
    constructor(user_id, username, passwordHash, role) {
        this.user_id = user_id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
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

    static async createUser(username, password, role) {
        // validate user input

        try {
            // validate user input
            this.validateUsername(username);
            this.validatePassword(password);
            this.validateRole(role);

            // check if username is unique
            const existingUser = await this.getUserByUsername(username);
            if (existingUser) {
                throw new Error ('Username already exists')
            }
            let pool = await sql.connect(dbConfig);
            let passwordHash = await bcrypt.hashSync(password, 10);
            let user = await pool
                .request()
                .input("username", username)
                .input("password", passwordHash)
                .input("role", role)
                .query(
                    "INSERT INTO Users (username, passwordHash, role) VALUES (@username, @password, @role)"
                );
            return user;
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteUser(user_id) {
        try {
            let pool = await sql.connect(dbConfig);
            let user = await pool
                .request()
                .input("user_id", user_id)
                .query("DELETE FROM Users WHERE user_id = @user_id");
            return user;
        } catch (error) {
            console.log(error);
        }
    }

    // Validation functions
    static validateUsername(username) {
        if (typeof username !== 'string' || username.length < 3 || username.length > 30 || !/^[a-zA-Z0-9]+$/.test(username)) {
            throw new Error('Invalid username. It must be an alphanumeric string between 3 and 30 characters.');
        }
    }

    static validatePassword(password) {
        if (typeof password !== 'string' || password.length < 8 || password.length > 100) {
            throw new Error('Invalid password. It must be a string between 8 and 100 characters.');
        }
    }

    static validateRole(role) {
        const validRoles = ['librarian', 'member'];
        if (!validRoles.includes(role)) {
            throw new Error(`Invalid role. Valid roles are: ${validRoles.join(', ')}.`);
        }
    }

}

module.exports = User;
