const express = require("express");

const routes = express.Router();

const UserController = require("./app/controllers/UserController");

routes.get("/", UserController.store);

module.exports = routes;
