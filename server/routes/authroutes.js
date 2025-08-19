const express = require('express');
const router = express.Router();
const { signup, login, getProfile } = require('../controllers/authcontroller');
const authMiddleware = require('../middleware/authmiddleware');

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Protected route (only logged-in users with valid token can access)
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
