const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const isAdmin = require('../middleware/isAdmin');

router.post('/login', AdminController.adminLogin);

router.get('/users', require('../middleware/isAdmin'), AdminController.getAllUsers);

router.patch('/users/:id/verify', require('../middleware/isAdmin'), AdminController.verifyUser);

router.get('/posts', require('../middleware/isAdmin'), AdminController.getAllPosts);

router.get('/requests',require('../middleware/isAdmin') , AdminController.getAllRequests);


router.delete('/users/:id', isAdmin, AdminController.deleteUser);
router.delete('/posts/:id', isAdmin, AdminController.deletePost);
router.delete('/requests/:id', isAdmin, AdminController.deleteRequest);

module.exports = router;
