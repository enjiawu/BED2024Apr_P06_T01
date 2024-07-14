const User = require("../models/user");

const getUserById = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = await User.getUserById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving user");
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving users");
    }
};

const registerUser = async (req, res) => {
    const newUser = req.body;
    try {
        const registeredUser = await User.registerUser(newUser);
        res.status(201).json(registeredUser);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error registing user");
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const authenticatedUser = await User.authenticateUser(email, password);
        res.status(200).json(authenticatedUser);
    } catch (error) {
        console.error(error);
        res.status(401).send("Invalid email or password");
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
    getUserById,
    getAllUsers,
    registerUser,
    loginUser,
    getUserCount,
};
