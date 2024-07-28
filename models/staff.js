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

    static async getStaffById(staffId) {
        try {
          let pool = await sql.connect(dbConfig);
          let staff = await pool
            .request()
            .input("staffId", staffId)
            .query("SELECT * FROM Staff WHERE staffId = @staffId");
          return staff.recordset[0];
        } catch (error) {
          console.log(error);
        }
      }

      static async updateProfile(staffId, newStaffData) {
        const connection = await sql.connect(dbConfig);
    
        try {
          // Check if the new ustaffname already exists for a different user
          if (newStaffData.staffName) {
            const staffNameCheck = await connection.request()
              .input("staffName", sql.VarChar, newStaffData.username)
              .input("staffId", sql.Int, staffId)
              .query("SELECT staffId FROM Staff WHERE staffName = @staffName AND staffId != @staffId");
    
            if (staffNameCheck.recordset.length > 0) {
              return { error: "staff name already exists" };
            }
          }
    
          const sqlQuery = `
                    UPDATE Staff 
                    SET 
                        staffName = @staffName, 
                        location = @location, 
                        department = @department
                        ${newStaffData.profilePicture ? ', profilePicture = @profilePicture' : ''}
                    WHERE staffId = @staffId
                `.replace(/,\s*$/, ''); // Remove trailing comma if passwordHash is not included
    
          const request = connection.request();
          request.input("staffId", sql.Int, staffId);
          request.input("staffName", sql.VarChar, newstaffData.staffName || null);
          request.input("email", sql.VarChar, newStaffData.email || null);
          request.input("location", sql.VarChar, newStaffData.location || null);
          request.input("department", sql.Text, newStaffData.department || null);
          request.input("profilePicture", sql.VarChar, newStaffData.profilePicture || null);
    
          const result = await request.query(sqlQuery);
          connection.close();
    
          if (result.rowsAffected[0] === 0) {
            return null;
          }
    
          return this.getStaffById(staffId);
        } catch (error) {
          console.error('Error updating profile:', error);
          connection.close();
          throw error; // Re-throw error to be caught in the controller
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
