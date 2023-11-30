const db = require("../models");
const Report = db.reports;
const Joke = db.jokes;

// Create and Save a new Report
exports.create = async (req, res, next) => {
  const { jokeId, message } = req.body;
  try {
    // Create a Report
    const query = {
      jokeId,
      message,
      createdBy: req.user.username,
    };

    // Save Report in the database
    Report.findOneAndUpdate(query, {}, { upsert: true, new: true })
      .then((data) => {
        return Joke.findOneAndUpdate(
          { _id: jokeId },
          { $inc: { reports: 1 } },
          { upsert: true, new: true }
        );
      })
      .then((data) => {
        return res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Report.",
        });
      });
  } catch (err) {
    next(err);
  }
};

// Retrieve all reports from the database.
exports.findAll = async (req, res, next) => {
  Report.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving reports.",
      });
    });
};

// Find a single Report with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  const query = {
    jokeId: id,
    createdBy: req.user.username,
  };

  Report.findOne(query)
    .then((data) => {
      res.send(data || {});
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Report with id=" + id });
    });
};

// Update a Report by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Report.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Report with id=${id}. Maybe Report was not found!`,
        });
      } else res.send({ message: "Report was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Report with id=" + id,
      });
    });
};

// Delete a Report with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  Report.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Report with id=${id}. Maybe Report was not found!`,
        });
      } else {
        res.send({
          message: "Report was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Report with id=" + id,
      });
    });
};

// Delete all reports from the database.
exports.deleteAll = async (req, res) => {
  Report.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} reports were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all reports.",
      });
    });
};
