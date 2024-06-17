const Event = require("../models/event");

const getAllEvents = async (req, res) => {
    try{
        const events = await Event.getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving events");
    }
};

const getEventCount = async (req, res) => {
    try {
        const eventCount = await Event.getEventCount();
        res.json(eventCount);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving event count");
    }
};

module.exports = {
    getAllEvents,
    getEventCount,
};
