const User = require("../models/user");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send("Cannot retrieve users.");
    }
}

const getUserByUsername = async (req, res) => {
    try {
        const user = await User.getUserByUsername(req.params.username);
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Cannot retrieve user.");
    }
}

const createUser = async (req, res) => {
    try {
        const user = await User.createUser(req.body.username, req.body.password, req.body.role);
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Cannot create user.");
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await User.updateUser(req.params.username, req.body.password, req.body.role);
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Cannot update user.");
    }
}

module.exports = {
    getAllUsers,
    getUserByUsername,
    createUser,
    updateUser
};
