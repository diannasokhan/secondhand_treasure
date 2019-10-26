const express = require("express");
const multer = require("multer");
const upload = multer({
    dest: "uploads/"
})
const app = express();

const appConfig = require("./config/main-config.js")
const routeConfig = require("./config/route-config.js");


appConfig.init(app, express);
routeConfig.init(app);

module.exports = app;