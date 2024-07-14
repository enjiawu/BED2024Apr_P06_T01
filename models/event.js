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

    static async deleteEvent(eventId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM Events WHERE eventId = @eventId`;

        const request = connection.request();
        request.input("eventId", eventId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected > 0;
    }

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

    static async getEventCount() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT COUNT(*) AS 'eventCount' FROM Events";

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0];
    }

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
}

module.exports = Event;
