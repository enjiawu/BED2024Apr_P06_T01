const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Event {
    constructor(
        eventId,
        title,
        description,
        image,
        datePosted,
        location,
        startDate,
        startTime,
        status,
        likes,
        userId,
        username,
        staffId,
        staffName
    ) {
        this.eventId = eventId;
        this.title = title;
        this.description = description;
        this.image = image;
        this.datePosted = datePosted;
        this.location = location;
        this.startDate = startDate;
        this.startTime = startTime;
        this.status = status;
        this.likes = likes;
        this.userId = userId;
        this.username = username;
        this.staffId = staffId;
        this.staffName = staffName;
    }
//Retrieve all events
    static async getAllEvents() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT * FROM Events";

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
        (event) => 
            new Event(
                event.eventId,
                event.title,
                event.description,
                event.image,
                event.datePosted,
                event.location,
                event.startDate,
                event.startTime,
                event.status,
                event.likes,
                event.userId,
                event.username,
                event.staffId,
                event.staffName
            )
        )
    }
//Retrieve event by Id
    static async getEventById(eventId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Events WHERE eventId = @eventId`;

        const request = connection.request();
        request.input("eventId", eventId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0] ?
        new Event(
            result.recordset[0].eventId, 
            result.recordset[0].title, 
            result.recordset[0].description, 
            result.recordset[0].image, 
            result.recordset[0].datePosted, 
            result.recordset[0].location, 
            result.recordset[0].startDate, 
            result.recordset[0].startTime,
            result.recordset[0].status,
            result.recordset[0].likes,
            result.recordset[0].userId,
            result.recordset[0].username,
            result.recordset[0].staffId,
            result.recordset[0].staffName,
        ) : null;
    }
//Create event
    static async createEvent(newEvent) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Events (title, description, image, datePosted, location, startDate, startTime, status, likes, userId, username, staffId, staffName) 
        VALUES 
        (@title, @description, @image, GETDATE(), @location, @startDate, @startTime, @status, 0, @userId, @username, null, null);
        SELECT SCOPE_IDENTITY() AS eventId;`;

        const request = connection.request();
        request.input("title", newEvent.title);
        request.input("description", newEvent.description);
        request.input("image", newEvent.image);
        request.input("datePosted", newEvent.datePosted);
        request.input("location", newEvent.location);
        request.input("startDate", newEvent.startDate);
        request.input("startTime", newEvent.startTime);
        request.input("status", newEvent.status);
        request.input("likes", newEvent.likes);
        request.input("userId", newEvent.userId);
        request.input("username", newEvent.username);
        const result = await request.query(sqlQuery);

        connection.close();

        return this.getEventById(result.recordset[0].eventId);
    }
//Update Event
    static async updateEvent(eventId, newEvent) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Events SET title = @title, description = @description, image = @image, location = @location, startDate = @startDate, startTime = @startTime, status = @status WHERE eventId = @eventId`;

        const request = connection.request();
        request.input("title", newEvent.title || null);
        request.input("description", newEvent.description || null);
        request.input("image", newEvent.image || null);
        request.input("location", newEvent.location);
        request.input("startDate", newEvent.startDate);
        request.input("startTime", newEvent.startTime);
        request.input("status", newEvent.status);
        request.input("eventId", eventId);

        await request.query(sqlQuery);

        connection.close();

        return this.getEventById(eventId);
    }
//Update Event
    static async deleteEvent(eventId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM Events WHERE eventId = @eventId`;

        const request = connection.request();
        request.input("eventId", eventId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected > 0;
    }
//Search events
    static async searchEvents(searchTerm) {
        const connection = await sql.connect(dbConfig);
        try {
            const sqlQuery = `SELECT * FROM Events WHERE title LIKE '%${searchTerm}%' AND status IN ('Open', 'Closed', 'Cancelled');`;

            const result = await connection.request().query(sqlQuery);

            return result.recordset;
        } catch (error) {
            throw new Error("Error searching events");
        } finally {
            await connection.close();
        }
    }
//Get event count
    static async getEventCount() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT COUNT(*) AS 'eventCount' FROM Events";

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0];
    }
//Get events by status
    static async getEventsByStatus(status) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Events WHERE status = @status`;

        const request = connection.request();
        request.input("status", status);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
        (event) => 
            new Event(
                event.eventId,
                event.title,
                event.description,
                event.image,
                event.datePosted,
                event.location,
                event.startDate,
                event.startTime,
                event.status,
                event.likes,
                event.userId,
                event.username,
                event.staffId,
                event.staffName    
            )
        )
    }
//Get listed events
    static async getListedEvents() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT * FROM Events WHERE status IN ('Open', 'Closed', 'Cancelled')";

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
        (event) => 
            new Event(
                event.eventId,
                event.title,
                event.description,
                event.image,
                event.datePosted,
                event.location,
                event.startDate,
                event.startTime,
                event.status,
                event.likes,
                event.userId,
                event.username,
                event.staffId,
                event.staffName
            )
        )
    }
//Get pending events
    static async getPendingEvents() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT * FROM Events WHERE status = 'Pending'";

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
        (event) => 
            new Event(
                event.eventId,
                event.title,
                event.description,
                event.image,
                event.datePosted,
                event.location,
                event.startDate,
                event.startTime,
                event.status,
                event.likes,
                event.userId,
                event.username,
                event.staffId,
                event.staffName
            )
        )
    }
//Get denied events
    static async getDeniedEvents() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT * FROM Events WHERE status = 'Denied'";

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
        (event) => 
            new Event(
                event.eventId,
                event.title,
                event.description,
                event.image,
                event.datePosted,
                event.location,
                event.startDate,
                event.startTime,
                event.status,
                event.likes,
                event.userId,
                event.username,
                event.staffId,
                event.staffName
            )
        )
    }
//Approve of an event
    static async approveEvent(eventId, newEvent) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Events SET status = 'Open', staffId = @staffId, staffName = @staffName WHERE eventId = @eventId`;

        const request = connection.request();
        request.input("status", newEvent.status);
        request.input("staffId", newEvent.staffId);
        request.input("staffName", newEvent.staffName);
        request.input("eventId", eventId);

        await request.query(sqlQuery);

        connection.close();

        return this.getEventById(eventId);
    }
//Deny an event
    static async denyEvent(eventId, newEvent) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Events SET status = 'Denied', staffId = @staffId, staffName = @staffName WHERE eventId = @eventId`;

        const request = connection.request();
        request.input("status", newEvent.status);
        request.input("staffId", newEvent.staffId);
        request.input("staffName", newEvent.staffName);
        request.input("eventId", eventId);

        await request.query(sqlQuery);

        connection.close();

        return this.getEventById(eventId);
    }
//Like an event
    static async likeEvent(eventId, userId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        UPDATE Events 
        SET likes = (likes + 1) WHERE eventId = @eventId

        INSERT INTO EventLikes (eventId, userId) VALUES (@eventId, @userId)
        SELECT SCOPE_IDENTITY() AS likeId;
        `;

        const request = connection.request();
        request.input("eventId", eventId);
        request.input("userId", userId);

        await request.query(sqlQuery);

        connection.close();

        return this.getEventById(eventId); 
    }
//Unlike an event
    static async unlikeEvent(eventId, userId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        UPDATE Events
        SET likes = (likes - 1) WHERE eventId = @eventId

        DELETE FROM EventLikes
        WHERE eventId = @eventId AND userId = @userId
        `;

        const request = connection.request();
        request.input("eventId", eventId);
        request.input("userId", userId);

        await request.query(sqlQuery);

        connection.close();

        return this.getEventById(eventId);
    }
//Retrieve like by user
    static async getLikeByUser(eventId, userId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            SELECT * FROM EventLikes
            WHERE eventId = @eventId AND userId = @userId;
        `;
        const request = connection.request();
        request.input("eventId", eventId);
        request.input("userId", userId);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.rowsAffected[0] > 0;
    }
//Retrieve event by user
    static async getEventByUser(eventId, userId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            SELECT * FROM EventUsers
            WHERE eventId = @eventId AND userId = @userId;
        `;
        const request = connection.request();
        request.input("eventId", eventId);
        request.input("userId", userId);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.rowsAffected[0] > 0;
    }
//Join event/participate
    static async joinEvent(eventId, userId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        INSERT INTO EventUsers (eventId, userId) VALUES (@eventId, @userId)
        SELECT SCOPE_IDENTITY() AS participateId;
        `;

        const request = connection.request();
        request.input("eventId", eventId);
        request.input("userId", userId);

        await request.query(sqlQuery);

        connection.close();

        return this.getEventById(eventId);
    }
//Withdraw/quit event
    static async withdrawEvent(eventId, userId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        DELETE FROM EventUsers 
        WHERE eventId = @eventId AND userId = @userId
        `;

        const request = connection.request();
        request.input("eventId", eventId);
        request.input("userId", userId);

        await request.query(sqlQuery);

        connection.close();

        return this.getEventById(eventId);
    }
//Get events participated by user
    static async getParticipatedEvents(userId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        SELECT * FROM Events e
        INNER JOIN EventUsers eu ON e.eventId = eu.eventId
        WHERE eu.userId = @userId
        `;

        const request = connection.request();
        request.input('userId', userId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
        (event) => 
            new Event(
                event.eventId[0],
                event.title,
                event.description,
                event.image,
                event.datePosted,
                event.location,
                event.startDate,
                event.startTime,
                event.status,
                event.likes,
                event.userId[0],
                event.username,
                event.staffId,
                event.staffName
            )
        )
    }
//Get events hosted by user
    static async getHostedEventsbyUser(userId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
        SELECT * FROM Events e
        INNER JOIN Users u ON e.userId = u.userId
        WHERE u.userId = @userId
        `;

        const request = connection.request();
        request.input('userId', userId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
        (event) => 
            new Event(
                event.eventId,
                event.title,
                event.description,
                event.image,
                event.datePosted,
                event.location[0],
                event.startDate,
                event.startTime,
                event.status,
                event.likes,
                event.userId[0],
                event.username[0],
                event.staffId,
                event.staffName
            )
        )
    }
}

module.exports = Event;
