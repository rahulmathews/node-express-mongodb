const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.users = require("./user.model.js")(mongoose);
db.jokes = require("./joke.model.js")(mongoose);
db.upvotes = require("./upvote.model.js")(mongoose);
db.downvotes = require("./downvote.model.js")(mongoose);
db.views = require("./view.model.js")(mongoose);
db.reports = require("./report.model.js")(mongoose);

module.exports = db;
