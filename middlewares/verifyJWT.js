const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from a .env file into process.env

function verifyJWT(req, res, next) {
    //console.log(req.headers);
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Forbidden" });
        }

        // Define authorized roles for different endpoints
        const authorizedRoles = {
            "/allmember": ["member"], // Root endpoint for testing
            "/alladmin": ["admin"], // Root endpoint for testing

            // member
            //"^/profile/[0-9]+": ["member"], // Members can access their own profile
            "^/profile/[0-9]+/edit": ["member"], // Member can edit their own profile
            "^/posts/[0-9]+": ["member"], // Members can view their own posts
            "^/events/[0-9]+": ["member"], // Members can view events they hosted
            "^/events$": ["member", "admin", "event"], // Anyone can view events
            "^/events/[0-9]+/status$": ["event"], // Only 'event' can update status

            // Community route - Only for logged in users
            // Post routes
            "^/": ["member", "admin", "event"], // Anyone can create a post or comment
            "^/[0-9]+": ["member", "admin", "event"], // Members and admins update and delete a post
            
            // Like Routes
            "^/[0-9]+/modify-like": ["member", "admin", "event"], // Anyone can like/unlike a post
            "^/comments/[0-9]+/modify-like": ["member", "admin", "event"], // Members can like/unlike a comment

            // Comment route
            "^/comments/[0-9]+": ["member", "admin", "event"], // Anyone can update and delete a comment
            "^/[0-9]+/comments": ["member", "admin", "event"], // Anyone can create a comment
            "^/[0-9]+/comments/[0-9]+/reply": ["member", "admin", "event"], // Anyone can create a post

            // Report Routes
            "^/report-post": ["member", "admin", "event"], // Anyone can report a post
            "^/report-comment": ["member", "admin", "event"], // Anyone can report a comment

            // Topic routes - only admin or event manager can create, update and delete topics
            "^/topics": ["admin", "event"], // Only admin or event manager can create a topic
            "^/topics/[0-9]+": ["admin", "event"], // Only admin or event manager can update or delete a topic
        };

        const requestedEndpoint = req.url;
        const userRole = decoded.role;

        // Log the requested endpoint and the user role
        console.log(`Requested endpoint: ${requestedEndpoint}`);
        console.log(`User role: ${userRole}`);

        // Check if user is authorized for the requested endpoint
        const isAuthorized = Object.entries(authorizedRoles).find(
            ([endpointPattern, roles]) => {
                const regex = new RegExp(endpointPattern);
                return regex.test(requestedEndpoint) && roles.includes(userRole);
            }
        );

        if (!isAuthorized) {
            return res.status(403).json({ error: "Forbidden" });
        }

        req.user = decoded; // Attach decoded user information to the request object
        next();
    });
}

module.exports = verifyJWT;