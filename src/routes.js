const express = require("express");

const routes = express.Router();

const UserController = require("./app/controllers/UserController");
const SessionController = require("./app/controllers/SessionController");

routes.post("/sessions", SessionController.store);

routes.get("/dashboard", (req, res) => {
  return res.status(200).send();
});

module.exports = routes;
