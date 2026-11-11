const express = require('express');

const { register, login, authMiddleware, profile } = require('../controllers/authControllers');

const router = express.Router();

router.post('/register', register)

router.post('/login', login)

router.get('/profile', authMiddleware, profile)

module.exports = router;
