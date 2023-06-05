const express = require("express");

const initRoute = (app) => {
  app.use("/api/user", require("./userRouter"));
  app.use("/api/chat", require("./chatRouter"));
};

module.exports = initRoute;
