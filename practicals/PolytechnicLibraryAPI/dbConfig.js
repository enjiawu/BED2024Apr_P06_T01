module.exports = {
    user: "library_user",
    password: "password",
    server: "localhost",
    database: "poly_library",
    trustServerCertificate: true,
    options: {
        port: 1433, // Default SQL Server port
        connectionTimeout: 60000, // Connection timeout in millisecond
    },
};
