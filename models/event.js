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

    static async getEventCount() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "SELECT COUNT(*) AS 'eventCount' FROM Events";

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0];
    }
}

module.exports = Event;
