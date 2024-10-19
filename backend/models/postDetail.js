const mongoose = require("../config/db");

const postDetailSchema = mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  description: {
    type: String,
  },
  totalArea: {
    type: Number,
  },
  FurnishingStatus: {
    type: String,
    enum: ["Fully Furnished", "Semi-Furnished", "Unfurnished"],
  },
  amenities: {
    type: [String],
    default: [],
  },
  balcony: {
    type: String,
  },
  waterSupply: {
    type: String,
  },
  pets: {
    type: String,
  },
  maintenance: {
    type: Number,
  },
  username: {
    type: String,
  },
  avatar: {
    type: String,
  },
});

const postDetailModel = mongoose.model("PostDetail", postDetailSchema);

module.exports = postDetailModel;
