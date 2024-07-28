const Staff = require("../models/staff");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllStaffs = async (req, res) => {
    try {
        const staffs = await Staff.getAllStaffs();
        res.json(staffs);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving staffs");
    }
};

const getStaffByName = async (req, res) => {
    try {
        const staff = await Staff.getStaffByName(req.params.staffName);
        res.json(staff);
    } catch (error) {
        console.error(error);
        res.status(500).send("Cannot retrieve staff");
    }
};

const getStaffByEmail = async (req, res) => {
    try {
        const staff = await Staff.getStaffByEmail(req.params.email);
        res.json(staff);
    } catch (error) {
        console.error(error);
        res.status(500).send("Cannot retrieve staff email");
    }
};

const updateStaff = async (req, res) => {
    try {
        const staff = await Staff.updateStaff(
            req.params.staffName,
            req.body.email,
            req.body.password,
            req.body.role
        );
        res.json(staff);
    } catch (error) {
        console.error(error);
        res.status(500).send("Cannot update staff.");
    }
};

async function registerStaff(req, res) {
    const { staffName, email, password, role } = req.body;
    try {
        // Check if email already exists
        const existingEmail = await Staff.getStaffByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new staff
        const newStaff = await Staff.createStaff(staffName, email, passwordHash, role);

        res.status(201).json({ message: "Staff registered successfully", staff: newStaff });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function loginStaff(req, res) {
    const { email, password } = req.body;

    try {
        // Retrieve staff by email
        const staff = await Staff.getStaffByEmail(email);

        if (!staff) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare password with hash
        const isMatch = await bcrypt.compare(password, staff.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const payload = {
            id: staff.staffId,
            role: staff.role,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h",
        });

        return res.status(200).json({ token, staff });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getAllStaffs,
    getStaffByName,
    getStaffByEmail,
    updateStaff,
    registerStaff,
    loginStaff,
};