// routes/posts.js
const express = require("express");
const router = express.Router();
const Post = require("../models/post");

// Get all properties
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      propertyType,
      city,
      search,
    } = req.query;

    let query = {};

    // Add filters if they exist
    if (category) {
      query["basicInfo.category"] = category;
    }

    if (propertyType) {
      query["basicInfo.propertyType"] = propertyType;
    }

    if (city) {
      query["basicInfo.city"] = city;
    }

    if (search) {
      query.$or = [
        { "basicInfo.title": { $regex: search, $options: "i" } },
        { "basicInfo.address": { $regex: search, $options: "i" } },
        { "basicInfo.city": { $regex: search, $options: "i" } },
      ];
    }

    const posts = await Post.find(query)
      .populate("userId", "name email")
      .populate("postDetail")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ "basicInfo.createdAt": -1 });

    const total = await Post.countDocuments(query);

    res.json({
      properties: posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new property
router.post("/", async (req, res) => {
  const post = new Post({
    basicInfo: req.body.basicInfo,
    postDetail: req.body.postDetail,
    userId: req.body.userId,
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get property by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("userId", "name email")
      .populate("postDetail");

    if (!post) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update property
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        basicInfo: req.body.basicInfo,
        postDetail: req.body.postDetail,
        userId: req.body.userId,
      },
      { new: true }
    )
      .populate("userId", "name email")
      .populate("postDetail");

    if (!post) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete property
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
