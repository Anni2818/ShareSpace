const Post = require('../models/Post');

// @desc    Create new room post
// @route   POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
      user: req.user._id,
      ...req.body,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all posts (with optional filters)
exports.getAllPosts = async (req, res) => {
  try {
    const filters = {};

    if (req.query.location) filters.location = new RegExp(req.query.location, 'i');
    if (req.query.genderPreference) filters.genderPreference = req.query.genderPreference;
    if (req.query.roomType) filters.roomType = req.query.roomType;
    if (req.query.tags) filters.tags = { $in: req.query.tags.split(',') };
    if (req.query.hobbies) filters.hobbies = { $in: req.query.hobbies.split(',') };
    if (req.query.minRent || req.query.maxRent) {
      filters.rent = {};
      if (req.query.minRent) filters.rent.$gte = Number(req.query.minRent);
      if (req.query.maxRent) filters.rent.$lte = Number(req.query.maxRent);
    }

    const posts = await Post.find(filters).populate('user', 'name profilePic');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user') // populate full user details
      // .populate('requests') // uncomment if you store request ObjectIds in post
      // .populate('matches')  // uncomment if you store match ObjectIds in post
      .exec();

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error('Error fetching post by ID:', err);
    res.status(500).json({ message: err.message });
  }
};


// @desc    Update a post (only owner can update)
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a post (only owner can delete)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Post.findByIdAndDelete(post._id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all posts by current user
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
