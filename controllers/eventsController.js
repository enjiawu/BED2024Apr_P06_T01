const Event = require("../models/event");
//Retrieve all events
const getAllEvents = async (req, res) => {
    try{
        const events = await Event.getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving events");
    }
};
//Retrieve event by id
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
// Create Event
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
//Update Event
const updateEvent = async (req, res) => {
    const eventId = req.params.id;
    const { title, description, startDate, startTime, status, location } = req.body;
    let image;

    if (req.file) {
        image = "../uploads/" + req.file.filename;
    } else {
        // Fetch existing image from the database if no new image is uploaded
        const existingEvent = await Event.getEventById(eventId);
        image = existingEvent.image;
    }

    const updatedEvent = {
        image,
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
//Delete Event
const deleteEvent = async (req, res) => {
    const eventId = parseInt(req.params.id);
    const userId = req.body.userId;
    try {

        const event = await Event.getEventById(eventId);
        
        if (!event) {
            return res.status(404).send("Event not found");
        }

        if (event.userId !== userId) {
            return res.status(403).send("Unauthorized to delete event.");
        }

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
// Search Events
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
// Get event count
const getEventCount = async (req, res) => {
    try {
        const eventCount = await Event.getEventCount();
        res.json(eventCount);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving event count");
    }
};
// Get event by status
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
// Get listed events
const getListedEvents = async (req, res) => {
    try{
        const events = await Event.getListedEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving events");
    }
};
// Get pending events
const getPendingEvents = async (req, res) => {
    try{
        const events = await Event.getPendingEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving events");
    }
};
//Get denied events
const getDeniedEvents = async (req, res) => {
    try{
        const events = await Event.getDeniedEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving events");
    }
};
// Approve event
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
//Deny event
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
// Like function
const modifyLike = async (req, res) => {
    const eventId = parseInt(req.params.id);
    const userId = req.body.userId;

    try {
        const existingLike = await Event.getLikeByUser(eventId, userId);
        if (existingLike) {
            // Unlike the event
            const event = await Event.unlikeEvent(eventId, userId);
            if (!event) {
                return res.status(404).json({ error: "Event not found" });
            }
            res.json({ success: true, likestatus: 'unliked', likes: event.likes});
        } else {
            // Like the event
            const event = await Event.likeEvent(eventId, userId);
            if (!event) {
                return res.status(404).json({ error: "Event not found" });
            }
            res.json({ success: true, likestatus: 'liked', likes: event.likes});
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error liking/unliking event" });
    }
    
};
// Get like by user
const getLikeByUser = async (req, res) => {
    const eventId = parseInt(req.params.eventId);
    const userId = parseInt(req.params.userId);
    try {
        const like = await Event.getLikeByUser(eventId, userId);
        res.json(like);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving like");
    }

}
// Modify participation
const modifyParticipation = async (req, res) => {
    const eventId = parseInt(req.params.id);
    const userId = req.body.userId;

    try {
        const existingParticipation = await Event.getEventByUser(eventId, userId);
        if (existingParticipation) {
            // Withdraw from the event the event
            const event = await Event.withdrawEvent(eventId, userId);
            if (!event) {
                return res.status(404).json({ error: "Event not found" });
            }
            res.json({ success: true, eventstatus: 'withdrawn'});
        } else {
            // Join the event
            const event = await Event.joinEvent(eventId, userId);
            if (!event) {
                return res.status(404).json({ error: "Event not found" });
            }
            res.json({ success: true, eventstatus: 'joined'});
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error joining/withdrawing event" });
    }
}
// Get event joined by user
const getEventByUser = async (req, res) => {
    const eventId = parseInt(req.params.eventId);
    const userId = parseInt(req.params.userId);
    try {
        const event = await Event.getEventByUser(eventId, userId);
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving event");
    }

}
//Get events participated by user
const getParticipatedEvents = async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const event = await Event.getParticipatedEvents(userId);
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving events");
    }

}
//Get hosted events by user
const getHostedEventsbyUser = async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const event = await Event.getHostedEventsbyUser(userId);
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving events");
    }

}

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
    denyEvent,
    modifyLike,
    getLikeByUser,
    getEventByUser,
    modifyParticipation,
    getParticipatedEvents,
    getHostedEventsbyUser
};
