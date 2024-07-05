const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send("Cannot retrieve users.");
    }
};

const getUserByUsername = async (req, res) => {
    try {
        const user = await User.getUserByUsername(req.params.username);
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Cannot retrieve user.");
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.updateUser(
            req.params.username,
            req.body.password,
            req.body.role
        );
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Cannot update user.");
    }
};

async function registerUser(req, res) {
    const { username, password, role } = req.body;

    try {
        // Validate user data
        // ... your validation logic here ...

        // Check for existing username
        const existingUser = await User.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user in database
        const newUser = await User.createUser(username, hashedPassword, role);

        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function login(req, res) {
    const { username, password } = req.body;

    try {
        // Validate user credentials
        const user = await User.getUserByUsername(username);
        if (!user) {
            console.log("1");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare password with hash
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            console.log("2");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const payload = {
            id: user.id,
            role: user.role,
        };
        const token = jwt.sign(payload, "your_secret_key", {
            expiresIn: "3600s",
        }); // Expires in 1 hour

        return res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getAllUsers,
    getUserByUsername,
    registerUser,
    updateUser,
    login,
};
