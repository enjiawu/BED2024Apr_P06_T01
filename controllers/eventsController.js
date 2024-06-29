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

const getEventById = async (req, res) => {
    const eventId = parseInt(req.params.id);
    try {
        const event = await Event.getEventById(eventId);
        if (!event) {
            return res.status(404).send("Event not found");
        }
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving event");
    }
};

const createEvent = async (req, res) => {
    const newEvent = req.body;
    try {
        const createdEvent = await Event.createEvent(newEvent);
        res.status(201).send(createdEvent);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating event");
    }
};

const updateEvent = async (req, res) => {
    const newEvent = req.body;
    const eventId = parseInt(req.params.id);

    try {
        const event = await Event.updateEvent(eventId, newEvent);
        if (!event) {
            return res.status(404).send("Event not found");
        }
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating event");
    }
};

const deleteEvent = async (req, res) => {
    const eventId = parseInt(req.params.id);
    try {
        const success = await Event.deleteEvent(eventId);
        if (success === -1) {
            return res.status(404).send("Event not found");
        }
        res.status(201).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting event");
    }
};

const searchEvents = async (req, res) => {
    const searchTerm = req.query.searchTerm;
    try {
        const events = await Event.searchEvents(searchTerm);
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error searching events");
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

const getEventsByStatus = async (req, res) => {
    const eventStatus = req.params.status;
    try {
        const event = await Event.getEventsByStatus(eventStatus);
        if (!event) {
            return res.status(404).send("Event not found");
        }
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving event");
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    searchEvents,
    getEventCount,
    getEventsByStatus
};
