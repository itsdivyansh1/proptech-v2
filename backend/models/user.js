const mongoose = require("../config/db");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
    ],
    avatar: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    savedPost: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "savedPost",
      },
    ],
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "chat" }],
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
