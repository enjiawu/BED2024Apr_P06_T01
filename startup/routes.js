// routes.js
const express = require("express");
const communityForumRouter = require("../routes/communityForumRouter");
const reportsRouter = require("../routes/reportsRouter");
const usersRouter = require("../routes/usersRouter");
const eventsRouter = require("../routes/eventsRouter");
const messagesRouter = require("../routes/messagesRouter");
const repliesRouter = require("../routes/repliesRouter");

module.exports = function (app) {
    app.use(express.json());

    app.use("/communityforum", communityForumRouter);
    app.use("/reports", reportsRouter);
    app.use("/users", usersRouter);
    app.use("/events", eventsRouter);
    app.use("/messages", messagesRouter);
    app.use("/replies", repliesRouter);
};
