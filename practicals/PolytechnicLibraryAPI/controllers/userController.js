const User = require("../models/user");
const bcrypt = require("bcryptjs");

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

async function registerUser(req, res) {
  const { username, password, role } = req.body;

  try {
    // Validate user data
    // ... your validation logic here ...

    // Check for existing username
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    // ... your database logic here ...

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
    getAllUsers,
    getUserByUsername,
    createUser,
    updateUser
};
