const User = require("../models/user");

async function getUserCount(req, res) {
    try {
        const userCount = await User.getUserCount();
        res.json(userCount);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving user count");
    }
}

module.exports = {
    getUserCount,
};
