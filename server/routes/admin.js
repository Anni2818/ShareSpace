const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

router.post('/login', AdminController.adminLogin);

router.get('/users', require('../middleware/isAdmin'), AdminController.getAllUsers);

router.patch('/users/:id/verify', require('../middleware/isAdmin'), AdminController.verifyUser);

router.get('/posts', require('../middleware/isAdmin'), AdminController.getAllPosts);

module.exports = router;
