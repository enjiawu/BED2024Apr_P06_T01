const Event = require("../models/event");

async function getEventCount(req, res) {
    try {
        const eventCount = await Event.getEventCount();
        res.json(eventCount);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving event count");
    }
}

module.exports = {
    getEventCount,
};
