const db = require("../models");
const Downvote = db.downvotes;

// Create and Save a new Downvote
exports.create = async (req, res, next) => {
  const { jokeId } = req.body;
  try {
    // Create a Downvote
    const query = {
      jokeId,
      createdBy: req.user.username,
    };

    // Save Downvote in the database
    Downvote.findOneAndUpdate(query, {}, { upset: true, new: true })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Downvote.",
        });
      });
  } catch (err) {
    next(err);
  }
};

// Retrieve all downvotes from the database.
exports.findAll = async (req, res, next) => {
  Downvote.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving downvotes.",
      });
    });
};

// Find a single Downvote with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  const query = {
    jokeId: id,
    createdBy: req.user.username,
  };

  Downvote.findOne(query)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Downvote with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Downvote with id=" + id });
    });
};

// Update a Downvote by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Downvote.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Downvote with id=${id}. Maybe Downvote was not found!`,
        });
      } else res.send({ message: "Downvote was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Downvote with id=" + id,
      });
    });
};

// Delete a Downvote with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  Downvote.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Downvote with id=${id}. Maybe Downvote was not found!`,
        });
      } else {
        res.send({
          message: "Downvote was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Downvote with id=" + id,
      });
    });
};

// Delete all downvotes from the database.
exports.deleteAll = async (req, res) => {
  Downvote.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} downvotes were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all downvotes.",
      });
    });
};
