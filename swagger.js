const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json"; // Output file for the spec
const routes = ["./app.js"]; // Path to your API route files

const doc = {
    info: {
        title: "ReThink API Documentation",
        description:
            "API for a comprehensive sustainability app featuring a community page, events, volunteering opportunities, a carbon footprint calculator, and insightful articles. Join us in making a positive environmental impact and fostering a greener future.",
    },
    host: "localhost:3000", // Replace with your actual host if needed
};

swaggerAutogen(outputFile, routes, doc);
