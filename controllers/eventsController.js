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
    const { title, description, datePosted, startDate, startTime, location, userId, username } = req.body;

    // Handle file upload here if needed (store path or other metadata in database)

    const newEvent = {
        image: "../uploads/" + req.file.filename, // Store the file path in the database if image was uploaded
        title,
        description,
        datePosted,
        startDate,
        startTime,
        location,
        status: 'Pending',
        userId,
        username,
    };
 

    try {
        const createdEvent = await Event.createEvent(newEvent);
        res.status(201).send(createdEvent);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating event");
    }
};

const updateEvent = async (req, res) => {
    const eventId = req.params.id;
    const { title, description, startDate, startTime, status, location } = req.body;
    let image;

    if (req.file) {
        image = req.file.filename;
    } else {
        // Fetch existing image from the database if no new image is uploaded
        const existingEvent = await Event.getEventById(eventId);
        image = existingEvent.image;
    }

    const updatedEvent = {
        image: "../uploads/" + req.file.filename,
        title,
        description,
        startDate,
        startTime,
        status,
        location
    };

    try {
        const event = await Event.updateEvent(eventId, updatedEvent);
        res.status(200).send(event);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).send('Failed to update event');
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

const getListedEvents = async (req, res) => {
    try{
        const events = await Event.getListedEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving events");
    }
};

const getPendingEvents = async (req, res) => {
    try{
        const events = await Event.getPendingEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving events");
    }
};

const getDeniedEvents = async (req, res) => {
    try{
        const events = await Event.getDeniedEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving events");
    }
};

const approveEvent = async (req, res) => {
    const newEvent = req.body;
    const eventId = parseInt(req.params.id);

    try {
        const event = await Event.approveEvent(eventId, newEvent);
        if (!event) {
            return res.status(404).send("Event not found");
        }
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error approving event");
    }
};

const denyEvent = async (req, res) => {
    const newEvent = req.body;
    const eventId = parseInt(req.params.id);

    try {
        const event = await Event.denyEvent(eventId, newEvent);
        if (!event) {
            return res.status(404).send("Event not found");
        }
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error denying event");
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
    getEventsByStatus,
    getListedEvents,
    getPendingEvents,
    getDeniedEvents,
    approveEvent,
    denyEvent
};
