const express = require('express');

const { sessions } = require('../controllers/sessionsControllers');

const router = express.Router();

router.get("/", sessions)

module.exports = router;
