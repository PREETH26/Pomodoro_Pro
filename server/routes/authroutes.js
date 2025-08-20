const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile,getAllUsers } = require('../controllers/authcontroller');
const authMiddleware = require('../middleware/authmiddleware');

// Signup route
router.post('/signup', register);

// Login route
router.post('/login', login);

// Logout route (optional)
router.post('/logout', logout);

// Protected route
router.get('/profile', authMiddleware, getProfile);
router.get('/', getAllUsers);
module.exports = router;
