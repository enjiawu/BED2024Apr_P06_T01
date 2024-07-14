// routes.js
const express = require("express");
const communityForumRouter = require("../routes/communityForumRouter");
const postReportsRouter = require("../routes/postReportsRouter");
const commentReportsRouter = require("../routes/commentReportsRouter");
const usersRouter = require("../routes/usersRouter");
const eventsRouter = require("../routes/eventsRouter");
const messagesRouter = require("../routes/messagesRouter");
const repliesRouter = require("../routes/repliesRouter");
const calculateCarbonFootprintRouter = require("../routes/carbonFootprintCalculatorRouter");

module.exports = function (app) {
    app.use(express.json());

    app.use("/communityforum", communityForumRouter);
    app.use("/post-reports", postReportsRouter);
    app.use("/comment-reports", commentReportsRouter);
    app.use("/users", usersRouter);
    app.use("/events", eventsRouter);
    app.use("/messages", messagesRouter);
    app.use("/replies", repliesRouter);
    app.use("/calculatecarbonfootprint", calculateCarbonFootprintRouter);
}
