const express = require("express");
const isAuthenticate = require("../MiddleWares/isAuthenticate");
const { getUserForSidebar, getUserForSearch, updateUserDetails } = require("../Controllers/userController");

const Router = express.Router();

Router.get("/conversation", isAuthenticate, getUserForSidebar)
Router.post("/search-users", isAuthenticate, getUserForSearch);
Router.post("/updateDetails", isAuthenticate, updateUserDetails);

module.exports = Router;
