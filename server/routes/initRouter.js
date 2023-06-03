const express = require("express");

const initRoute = (app) => {
  app.use("/api/user", require("./userRouter"));
};

module.exports = initRoute;
