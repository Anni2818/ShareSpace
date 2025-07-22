const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// REGISTER
exports.register = async (req, res) => {
  try {
    const {
      name, email, password, roles,
      hobbies, preferences, aadharCardUrl,
      profilePic, bio, phoneNumber, location
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const newUser = new User({
      name,
      email,
      password, // password is hashed in pre-save middleware
      roles: roles || ['seeker', 'poster'], // default both roles if not passed
      hobbies,
      preferences,
      aadharCardUrl,
      profilePic,
      bio,
      phoneNumber,
      location,
      isVerified: false,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
    await sendEmail(savedUser.email, 'Verify your email', `Click to verify your account: ${url}`);

    res.status(201).json({ message: 'Registered successfully. Check your email to verify.' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// LOGIN
// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // REMOVE email verification check
    // if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first.' });

    const token = jwt.sign(
      { userId: user._id, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        isVerified: user.isVerified,
        hobbies: user.hobbies,
        preferences: user.preferences,
        aadharCardUrl: user.aadharCardUrl,
        profilePic: user.profilePic,
        bio: user.bio,
        phoneNumber: user.phoneNumber,
        location: user.location,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};


// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not registered' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendEmail(email, 'Reset Password', `Click to reset your password: ${url}`);
    res.json({ message: 'Reset link sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send reset link' });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// GET /me - Get profile of logged in user
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// PUT /me - Update logged in user profile
exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
