require("dotenv").config(); // Import dotenv package to read environment variables

module.exports = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    trustServerCertificate: true, 
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
      encrypt:true, // Encryption
    },
    pool: {
      max: 10,
      min: 0,
    }
};

