const express = require('express');

const { movies } = require('../controllers/moviesControllers');

const router = express.Router();

router.get("/", movies)

module.exports = router;
