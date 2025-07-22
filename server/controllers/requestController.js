const Request = require('../models/Request');
const Post = require('../models/Post');
const ChatRoom = require('../models/ChatRoom');

// @desc    Create request by seeker
// @route   POST /api/requests/:postId
exports.createRequest = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post || !post.isAvailable) {
      return res.status(404).json({ message: 'Post not found or unavailable' });
    }

    if (post.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot request your own post' });
    }

    const request = await Request.create({
      post: post._id,
      seeker: req.user._id
    });

    res.status(201).json(request);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Request already sent for this post' });
    }
    res.status(500).json({ message: err.message });
  }
};

// @desc    Poster accepts request
// @route   PATCH /api/requests/:requestId/accept
exports.acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId).populate('post');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    request.status = 'accepted';
    await request.save();

    // Create chat room if not exists
    const existingRoom = await ChatRoom.findOne({
      participants: { $all: [req.user._id, request.seeker] },
      post: request.post._id
    });

    if (!existingRoom) {
      await ChatRoom.create({
        participants: [req.user._id, request.seeker],
        post: request.post._id
      });
    }

    res.json({ message: 'Request accepted and chat room created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Poster rejects request
// @route   PATCH /api/requests/:requestId/reject
exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId).populate('post');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Request rejected' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all requests for a specific post (poster only)
// @route   GET /api/requests/post/:postId
exports.getRequestsForPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view requests' });
    }

    const requests = await Request.find({ post: req.params.postId })
      .populate('seeker', 'name profilePic email');

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all requests made by logged-in seeker
// @route   GET /api/requests/my
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ seeker: req.user._id })
      .populate('post', 'title location rent');

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
