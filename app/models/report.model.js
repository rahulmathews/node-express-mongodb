module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      jokeId: { type: mongoose.Schema.Types.ObjectId, ref: "Joke" },
      message: String,
      createdBy: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Report = mongoose.model("report", schema);
  return Report;
};
