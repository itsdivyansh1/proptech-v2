const mongoose = require("../config/db");

const savedPostSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

savedPostSchema.index({ userId: 1, postId: 1 }, { unique: true });

const savedPostModel = mongoose.model("savedPost", savedPostSchema);

module.exports = savedPostModel;
