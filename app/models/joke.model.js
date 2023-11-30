module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      type: String,
      status: { type: String, default: "NEW" },
      content: String,
      s3Url: String,
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 },
      reports: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      rating: Number,
      createdBy: String,
    },

    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Joke = mongoose.model("joke", schema);
  return Joke;
};
