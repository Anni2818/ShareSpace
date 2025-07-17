// const express = require('express');
// const { register, login, getProfile, updateProfile } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);
// router.get('/profile', protect, getProfile);
// router.put('/profile', protect, updateProfile); // 🔥 New route

// module.exports = router;

const express = require('express');
const router = express.Router();

const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const {
  protect,
  requireVerified,
  authorizeRoles,
} = require('../middleware/authMiddleware');

const { getProfile, updateProfile } = require('../controllers/authController'); // ✅ correct controller

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// ✅ Protected Profile Routes
router.get('/me', protect, requireVerified, getProfile);
router.put('/me', protect, requireVerified, updateProfile);

// ✅ Example: Only 'admin' can access
// router.get('/admin-stats', protect, authorizeRoles('admin'), someAdminHandler);

module.exports = router;


