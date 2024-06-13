const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Event {
    constructor(
        EventId,
        Title,
        Description,
        Image,
        DatePosted,
        Location,
        StartDate,
        StartTime,
        Status,
        Likes,
        UserId,
        Username,
        StaffId,
        StaffName
    ) {
        this.EventId = EventId;
        this.Description = Description;
        this.Image = Image;
        this.DatePosted = DatePosted;
        this.Location = Location;
        this.StartDate = StartDate;
        this.StartTime = StartTime;
        this.Status = Status;
        this.Likes = Likes;
        this.UserId = UserId;
        this.Username = Username;
        this.StaffId = StaffId;
        this.StaffName = StaffName;
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
