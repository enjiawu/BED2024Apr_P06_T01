module.exports = {
    user: "bed_assignment", // Replace with your SQL Server login username
    password: "fullmarksplease", // Replace with your SQL Server login password
    server: "localhost",
    database: "rethink_bed",
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
};

