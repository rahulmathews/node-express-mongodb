module.exports = (app) => {
  const downvotes = require("../controllers/downvote.controller.js");

  const jwt_val = require("../libs/jwt-validator.js");

  var router = require("express").Router();

  // Create a new Downvote
  router.post("/", downvotes.create);

  // Retrieve all downvotes
  router.get("/", downvotes.findAll);

  // Retrieve a single Downvote with id
  router.get("/:id", downvotes.findOne);

  // Update a Downvote with id
  router.put("/:id", downvotes.update);

  // Delete a Downvote with id
  router.delete("/:id", downvotes.delete);

  // Create a new Downvote
  router.delete("/", downvotes.deleteAll);

  app.use("/api/downvotes", jwt_val.default(), router);
};
