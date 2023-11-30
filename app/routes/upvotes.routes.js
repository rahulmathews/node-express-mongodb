const s3 = require("../libs/aws-s3.js");

module.exports = (app) => {
  const upvotes = require("../controllers/upvote.controller.js");

  const jwt_val = require("../libs/jwt-validator.js");

  var router = require("express").Router();

  // Create a new Upvote
  router.post("/", upvotes.create);

  // Retrieve all upvotes
  router.get("/", upvotes.findAll);

  // Retrieve a single Upvote with id
  router.get("/:id", upvotes.findOne);

  // Update a Upvote with id
  router.put("/:id", upvotes.update);

  // Delete a Upvote with id
  router.delete("/:id", upvotes.delete);

  // Create a new Upvote
  router.delete("/", upvotes.deleteAll);

  app.use("/api/upvotes", jwt_val.default(), router);
};
