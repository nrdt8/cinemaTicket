const express = require('express');
const pool = require('./config/db');

// routes
const authRoutes = require('./routes/authRoutes');
const moviesRoutes = require('./routes/moviesRoutes');
const sessionsRoutes = require('./routes/sessionsRoutes');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/movies', moviesRoutes);

app.use('/api/sessions', sessionsRoutes);

app.listen(3000);