const mongoose = require("../config/db");

const postSchema = mongoose.Schema({
  basicInfo: {
    title: {
      type: String,
    },
    price: {
      type: Number,
    },
    images: [
      {
        type: String,
      },
    ],
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    bedroom: {
      type: String,
    },
    bathroom: {
      type: String,
    },
    category: {
      type: String,
    },
    propertyType: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  postDetail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PostDetail",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
