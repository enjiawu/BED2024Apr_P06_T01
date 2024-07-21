const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving users");
    }
};

const getUserByUserId = async (req, res) => {
    try{
        const user = await User.getUserById(req.params.userId);
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Cannot retrieve user ID");
    }
};

const getUserByUserName = async (req, res) => {
    try{
        const user = await User.getUserByUsername(req.params.username);
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Cannot retrieve user");
    }
};

const getUserByEmail = async (req, res) => {
    try{
        const user = await User.getUserByEmail(req.params.email);
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Cannot retrieve user email")
    }
}

// Updating the profile if it belongs to the user
const updateUser = async (req, res) => {
    const newUserData = req.body;
    const userId = parseInt(req.params.id);
    try {
        const user = await User.updateProfile(userId, newUserData);
        if (!user){
            return res.status(404).json({error: "user not found"})
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Cannot update user.");
    }
};

async function registerUser(req, res) {
    const { username, email, password } = req.body;
    try {
        // check for existing username
        const existingUser = await User.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({message: "Username already exists"});
        }

        //check for esisting email
        const existingEmail = await User.getUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({message: "Email already exists"});
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user in database
        await User.createUser(username, email, hashedPassword);

        return res.status(201).json({message: "User created successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error registing user");
    }
};

async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        // validate user credentials
        const user = await User.getUserByEmail(email);

        if (!user) {
            return res.status(401).json({message: "Invalid email"});
        }

        // compare password with hash
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({message: "Invalid password"});
        }

        // generate JWT token
        const payload = {
            id: user.userId,
            role: user.role,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "3600s",
        });

        return res.status(200).json({token, user});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
};

const logoutUser = async (req, res) => {
    try {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Logout failed" });
    }
};

const getUserCount = async (req, res) => {
    try {
        const userCount = await User.getUserCount();
        res.json(userCount);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving user count");
    }
};

module.exports = {
    getAllUsers,
    getUserByUserId,
    getUserByUserName,
    getUserByEmail,
    updateUser,
    registerUser,
    loginUser,
    getUserCount,
};
