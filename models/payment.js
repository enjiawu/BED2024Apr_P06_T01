const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Payment {
    constructor(donationId, amount, currency, customerId, organization, time, status, userId, email, name) {
        this.donationId = donationId;
        this.amount = amount;
        this.currency = currency;
        this.customerId = customerId;
        this.organization = organization;
        this.time = time;
        this.status = status;
        this.userId = userId;
        this.email = email;
        this.name = name;
    }
    // Save payment details to the database
    static async savePaymentDetails(paymentDetails) { 
        const connection = await sql.connect(dbConfig);
        const checkQuery = `
            SELECT COUNT(*) AS count
            FROM Payments
            WHERE customerId = @customerId
            AND amount = @amount
            AND currency = @currency
            AND time = @time;
      `;
        const checkRequest = connection.request();
        checkRequest.input('customerId', paymentDetails.customer);
        checkRequest.input('amount', paymentDetails.amount);
        checkRequest.input('currency', paymentDetails.currency);
        checkRequest.input('time', paymentDetails.time);
        const checkResult = await checkRequest.query(checkQuery);

        if (checkResult.recordset[0].count > 0) {
            // Record already exists, no need to insert
            //console.log(`Payment with customerId ${paymentDetails.customer}, amount ${paymentDetails.amount}, currency ${paymentDetails.currency}, and time ${paymentDetails.time} already exists.`);
            return;
        }

        const sqlQuery = `
            INSERT INTO Payments (amount, currency, customerId, email, name, organization, status, time)
            VALUES (@amount, @currency, @customerId, @email, @name, @organization, @status, @time);
        `;
        const request = connection.request();
        request.input('amount', paymentDetails.amount);
        request.input('currency', paymentDetails.currency);
        request.input('customerId', paymentDetails.customer);
        request.input('email', paymentDetails.email);
        request.input('name', paymentDetails.name);
        request.input('organization', paymentDetails.organization);
        request.input('status', paymentDetails.status);
        request.input('time', paymentDetails.time);

        await request.query(sqlQuery);
        connection.close();
    }
  
    // Retrieve payment details by customer ID 
    static async getPaymentsByCustomerId(customerId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            SELECT * FROM Payments
            WHERE customerId = @customerId;
        `;
        const request = connection.request();
        request.input('customerId', customerId);
        const result = await request.query(sqlQuery);
        connection.close();
    
        return result.recordset; // Array of payment details
    }
    //Retrieve donation history by user
    static async getDonationHistorybyUser(userId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            SELECT * 
            FROM Payments p 
            INNER JOIN Users u ON p.email = u.email
            WHERE u.userId = @userId;
        `;
        const request = connection.request();
        request.input('userId', userId);
        const result = await request.query(sqlQuery);
        connection.close();
    
        return result.recordset.map(
        (donation) => 
            new Payment(
                donation.donationId,
                donation.amount / 100,
                donation.currency,
                donation.customerId,
                donation.organization,
                donation.time,
                donation.status,
                donation.userId,
                donation.email[0],
                donation.name
            )
        ) // Array of donation history
    }
    //Retrieve lifetime donation by user
    static async getLifetimeDonationByUser(userId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            SELECT SUM(amount)/100 AS 'Lifetime Donation'
            FROM Payments p
            INNER JOIN Users u ON p.email = u.email
            WHERE u.userId = @userId;
        `;
        const request = connection.request();
        request.input('userId', userId); 
        const result = await request.query(sqlQuery);
        connection.close();
    
        return result.recordset[0]['Lifetime Donation']; // Get the lifetime donation amount
    }
    //Retrieve average donation by user
    static async getAverageDonationByUser(userId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            SELECT ROUND(AVG(donation_amount), 2) AS 'Average Donation'
            FROM (
              SELECT SUM(amount) / 100 AS donation_amount
              FROM Payments p
              INNER JOIN Users u ON p.email = u.email
              WHERE u.userId = @userId
              GROUP BY donationId
            ) AS subquery;
        `;
        const request = connection.request();
        request.input('userId', sql.Int, userId); // Adjust the type if needed
        const result = await request.query(sqlQuery);
        connection.close();
    
        return result.recordset[0]['Average Donation']; // Get the average donation amount
    }
    //Retrieve number of donations by user
    static async getNumberOfDonationsByUser(userId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            SELECT 
                u.userId AS 'userId',
                COUNT(*) AS 'Number of Donations'
            FROM Payments p
            INNER JOIN Users u ON p.email = u.email
            WHERE u.userId = @userId
            GROUP BY u.userId;
        `;
        const request = connection.request();
        request.input('userId', userId); // Adjust the type if needed
        const result = await request.query(sqlQuery);
        connection.close();
    
        return result.recordset[0]['Number of Donations']; // Get the number of donations
    }

}
  
module.exports = Payment;