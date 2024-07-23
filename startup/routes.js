// routes.js
const express = require("express");
const communityForumRouter = require("../routes/communityForumRouter");
const reportsRouter = require("../routes/reportsRouter");
const usersRouter = require("../routes/usersRouter");
const staffsRouter = require("../routes/staffsRouter"); // Correct import
const eventsRouter = require("../routes/eventsRouter");
const messagesRouter = require("../routes/messagesRouter");
const repliesRouter = require("../routes/repliesRouter");
const calculateCarbonFootprintRouter = require("../routes/carbonFootprintCalculatorRouter");
const articlesRouter = require("../routes/articlesRouter");
const paymentRouter = require("../routes/paymentRouter");

module.exports = function (app) {
    app.use(express.json());

    app.use("/communityforum", communityForumRouter);
    app.use("/reports", reportsRouter);
    app.use("/users", usersRouter);
    app.use("/staffs", staffsRouter); // Correct usage
    app.use("/events", eventsRouter);
    app.use("/messages", messagesRouter);
    app.use("/replies", repliesRouter);
    app.use("/calculatecarbonfootprint", calculateCarbonFootprintRouter);
    app.use("/articles", articlesRouter);
    app.use("/payment", paymentRouter);
};
