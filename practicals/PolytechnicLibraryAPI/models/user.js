const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

class User {
    constructor(
        user_id,
        username,
        passwordHash,
        role
    ) {
        this.user_id = user_id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    static async getAllUsers() {
        try {
            let pool = await sql.connect(dbConfig);
            let users = await pool
                .request()
                .query("SELECT * FROM Users");
            return users.recordset;
        } catch (error) {
            console.log(error);
        }
    }

    static async getUserByUsername(username){
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

    static async registerUser(username, password, role) {
        // validate user input
        
        try {
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

}

module.exports = User;
