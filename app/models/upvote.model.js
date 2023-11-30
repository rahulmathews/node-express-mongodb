module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      jokeId: { type: mongoose.Schema.Types.ObjectId, ref: "Joke" },
      createdBy: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Upvote = mongoose.model("upvote", schema);
  return Upvote;
};
