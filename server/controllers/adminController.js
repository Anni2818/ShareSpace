const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const Request = require('../models/Request'); // if applicable

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting post' });
  }
};

// DELETE REQUEST (if needed)
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting request' });
  }
};


exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🧪 Email received in request:", email);

    const admin = await User.findOne({ email });
    console.log("📌 Fetched Admin:", admin); // 🔍 Log user fetched

    if (!admin || admin.role !== 'admin') {
      console.log("❌ Not an admin or user not found");
      return res.status(401).json({ message: 'Unauthorized: Not an admin' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("🔍 Password match:", isMatch); // 🔍 Log password comparison

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, admin });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};


// In AdminController.js
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['seeker', 'poster'] } }).select('-password');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// In AdminController.js
exports.verifyUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    ).select('-password');

    res.json({ message: 'User verified', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying user' });
  }
};

//Get all posts

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name email');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};




// Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('post', 'title location') // show post title and location
      .populate('seeker', 'name email'); // show seeker details

    res.json(requests);
  } catch (err) {
    console.error('❌ Error fetching requests:', err);
    res.status(500).json({ message: 'Error fetching requests' });
  }
};

