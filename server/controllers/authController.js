// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // Register a new user
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role, hobbies, preferences, aadharCardUrl } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already in use' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       hobbies,
//       preferences,
//       aadharCardUrl,
//       isVerified: !!aadharCardUrl,
//     });

//     const user = await newUser.save();

//     res.status(201).json({
//       message: 'User registered successfully',
//       userId: user._id,
//     });
//   } catch (err) {
//     console.error('Register Error:', err);
//     res.status(500).json({ message: 'Server error during registration' });
//   }
// };

// // Login user
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.json({
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         isVerified: user.isVerified,
//         hobbies: user.hobbies,
//         preferences: user.preferences,
//         aadharCardUrl: user.aadharCardUrl,
//       },
//     });
//   } catch (err) {
//     console.error('Login Error:', err);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// };

// // Get user profile
// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     console.error('Profile Fetch Error:', err);
//     res.status(500).json({ message: 'Error fetching profile' });
//   }
// };
// // Update user profile
// exports.updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const {
//       name,
//       hobbies,
//       preferences,
//       aadharCardUrl,
//     } = req.body;

//     const updateData = {
//       name,
//       hobbies,
//       preferences,
//     };

//     // If Aadhar was newly uploaded, mark verified
//     if (aadharCardUrl) {
//       updateData.aadharCardUrl = aadharCardUrl;
//       updateData.isVerified = true;
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     ).select('-password');

//     res.json({
//       message: 'Profile updated successfully',
//       user: updatedUser,
//     });
//   } catch (err) {
//     console.error('Update Profile Error:', err);
//     res.status(500).json({ message: 'Failed to update profile' });
//   }
// };

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, hobbies, preferences, aadharCardUrl } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name, email, password: hashedPassword, role, hobbies, preferences, aadharCardUrl,
      isVerified: false,
    });

    const savedUser = await newUser.save();

    // Send email verification token
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
    await sendEmail(savedUser.email, 'Verify your email', `Click to verify: ${url}`);

    res.status(201).json({ message: 'Registered successfully. Check email to verify.' });
  } catch (err) {
    console.error(err);
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
    res.status(400).json({ message: 'Invalid or expired verification token' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isVerified) return res.status(403).json({ message: 'Email not verified' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        _id: user._id, name: user.name, email: user.email, role: user.role,
        isVerified: user.isVerified, hobbies: user.hobbies, preferences: user.preferences,
        aadharCardUrl: user.aadharCardUrl,
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

// GET /me - Get Logged In User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// PUT /me - Update Logged In User Profile
exports.updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true }
    ).select('-password');

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
