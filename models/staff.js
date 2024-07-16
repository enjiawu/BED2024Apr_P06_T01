const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

class Staff {
    constructor(
        staffId,
        staffName,
        email,
        department,
        location,
        profilePicture,
        password,
        role
    ) {
        this.staffId = staffId;
        this.staffName = staffName;
        this.email = email;
        this.department = department;
        this.location = location;
        this.profilePicture = profilePicture;
        this.password = password;
        this.role = role
    }

    static async getAllStaffs() {
        try {
            let pool = await sql.connect(dbConfig);
            let staffs = await pool.request().query("SELECT * FROM Staff");
            return staffs.recordset;
        } catch (error) {
            console.log(error);
        }
    }

    static async authenticateStaff(email, password) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT * FROM Staff WHERE email = @Email";

        const request = connection.request();
        request.input("Email", email);
        const result = await request.query(sqlQuery);

        connection.close();

        if (result.recordset.length === 0) {
            throw new Error("Staff not found");
        }

        const staff = result.recordset[0];
        const passwordMatch = await bcrypt.compare(password, staff.passwordHash);

        if (!passwordMatch) {
            throw new Error("Invalid password");
        }

        return new Staff(
            staff.staffId,
            staff.staffName,
            staff.email,
            staff.passwordHash
        );
    }

    static async getStaffByName(staffName) {
        try {
            let pool = await sql.connect(dbConfig);
            let staff = await pool
                .request()
                .input("staffName", sql.VarChar, staffName)
                .query("SELECT * FROM Staff WHERE staffName = @staffName");
            return staff.recordset[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async gettaffByEmail(email) {
        try {
            let pool = await sql.connect(dbConfig);
            let staff = await pool
                .request()
                .input("email", sql.VarChar, email) // Ensure you are specifying the correct data type
                .query("SELECT * FROM Staff WHERE email = @email");
    
            // Log the result for debugging
            console.log("Query result for email:", email, staff.recordset);
    
            return staff.recordset[0];
        } catch (error) {
            console.log("Error retrieving staff by email:", error);
            throw error;
        }
    }

    static async createStaff(staffName, email, password, role) {
        try{
            let pool = await sql.connect(dbConfig);
            let staff = await pool
                .request()
                .input("staffName", sql.VarChar, staffName)
                .input("email", email)
                .input("password", password)
                .input("role", role)
                .query(
                    "INSERT INTO Staff (staffName, email, password, role) VALUES (@staffName, @email, @password, @role); SELECT SCOPE_IDENTITY() AS id;"
                );
                console.log("Insert result:", staff);
            return staff.recordset[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async deletestaff(staffId) {
        try {
            let pool = await sql.connect(dbConfig);
            let staff = await pool
                .request()
                .input("staffId", staffId)
                .query("DELETE FROM Staff WHERE staffId = @staffId");
            return staff;
        } catch (error) {
            console.log(error);
        }
    }

    static async registerStaff(newStaffData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery =
            "INSERT INTO Staff (staffName, email, password, role) VALUES (@staffName, @email, @password, @role); SELECT SCOPE_IDENTITY() AS id;";

        const hashedPassword = await bcrypt.hash(newStaffData.password, 10);

        const request = connection.request();
        request.input("staffName", newStaffData.staffName);
        request.input("email", newStaffData.email);
        request.input("password", hashedPassword);
        request.input("role", newStaffData.role);

        const result = await request.query(sqlQuery);

        connection.close();

        return result;
    }

}

module.exports = Staff;
