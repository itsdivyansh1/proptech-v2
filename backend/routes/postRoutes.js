require("dotenv").config();
const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const postModel = require("../models/post");
const userModel = require("../models/user");
const postDetailModel = require("../models/postDetail");
const savedPostModel = require("../models/savedPost");

router.post("/createpost", isLoggedIn, async (req, res) => {
  const { basicInfo, postDetails } = req.body;
  const userId = req.user.id;

  try {
    const postDetailDoc = await postDetailModel.create(postDetails);

    const newPost = await postModel.create({
      basicInfo,
      userId,
      postDetail: postDetailDoc._id,
    });

    const user = await userModel.findOne({ _id: userId });
    user.posts.push(newPost._id);
    await user.save();

    await postDetailModel.findByIdAndUpdate(postDetailDoc._id, {
      postId: newPost._id,
      username: user.username,
      avatar: user.avatar,
    });

    return res.status(200).json({ message: "post created", newPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to add post" });
  }
});

router.get("/getposts", async (req, res) => {
  try {
    const { category, city, minPrice, maxPrice, address } = req.query;

    let query = {};

    if (category) query["basicInfo.category"] = category;
    if (city) query["basicInfo.city"] = { $regex: new RegExp(city, "i") };

    if (minPrice || maxPrice) {
      query["basicInfo.price"] = {};
      if (minPrice) query["basicInfo.price"].$gte = Number(minPrice);
      if (maxPrice) query["basicInfo.price"].$lte = Number(maxPrice);
    }

    if (address && address.trim() !== "") {
      console.log("Address search term:", address);
      const addressTerms = address
        .trim()
        .split(/\s+/)
        .filter((term) => term.length > 0);

      const addressRegex = addressTerms
        .map((term) => {
          if (/^\d+$/.test(term)) {
            return `(^|\\s)${term}(\\s|$)`;
          }
          return term;
        })
        .join(".*");

      console.log("Address regex:", addressRegex);

      query["basicInfo.address"] = {
        $regex: new RegExp(addressRegex, "i"),
      };
    }

    console.log("Query:", JSON.stringify(query, null, 2));

    const posts = await postModel.find(query).select("basicInfo");

    if (!posts || posts.length === 0) {
      return res.status(200).json({ posts });
    }

    return res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get posts" });
  }
});

router.get("/getpost/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await postModel.findOne({ _id: id }).populate("postDetail");
    if (!post) {
      return res.json({ message: "no post found" });
    }

    return res.status(200).json({ post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "no post found" });
  }
});

router.put("/updatepost/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { basicInfo, postDetails } = req.body;

  try {
    const post = await postModel.findOne({ _id: id });
    if (!post) {
      return res.json({ message: "Post not available" });
    }

    if (post.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedpost = await postModel.findByIdAndUpdate(
      id,
      { basicInfo },
      { new: true }
    );

    if (postDetails) {
      const postDetailDoc = await postDetailModel.findByIdAndUpdate(
        post.postDetail,
        postDetails,
        { new: true }
      );
      if (!postDetailDoc) {
        return res.json({ message: "Post detail not available" });
      }
    }

    return res.json({ message: "post updated", updatedpost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update post" });
  }
});

router.delete("/deletepost/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await postModel.findById(id);
    if (!post) {
      return res.json({ message: "post not available" });
    }
    const postdetailid = post.postDetail.toString();
    const userId = post.userId;

    await postModel.findByIdAndDelete(id);
    await postDetailModel.findByIdAndDelete(postdetailid);

    await userModel.updateOne({ _id: userId }, { $pull: { posts: id } });

    return res.json({ message: "post deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete post" });
  }
});

router.post("/save/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const savedPost = await savedPostModel.findOne({
      userId,
      postId: id,
    });

    if (savedPost) {
      await savedPostModel.findByIdAndDelete(savedPost._id);
      const user = await userModel.findById(userId);
      user.savedPost = user.savedPost.filter(
        (post) => !post.equals(savedPost._id)
      );
      await user.save();
      return res.json({ message: "post unsaved", saved: false });
    }

    const newSavedPost = await savedPostModel.create({
      userId,
      postId: id,
    });

    const user = await userModel.findById(userId);
    user.savedPost.push(newSavedPost._id);
    await user.save();
    return res.status(200).json({ message: "post saved", saved: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to save post" });
  }
});

module.exports = router;
