module.exports = (app) => {
  const reports = require("../controllers/report.controller.js");

  const jwt_val = require("../libs/jwt-validator.js");

  var router = require("express").Router();

  // Create a new Report
  router.post("/", reports.create);

  // Retrieve all reports
  router.get("/", reports.findAll);

  // Retrieve a single Report with id
  router.get("/:id", reports.findOne);

  // Update a Report with id
  router.put("/:id", reports.update);

  // Delete a Report with id
  router.delete("/:id", reports.delete);

  // Create a new Report
  router.delete("/", reports.deleteAll);

  app.use("/api/reports", jwt_val.default(), router);
};
