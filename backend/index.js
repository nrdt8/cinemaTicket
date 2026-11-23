const express = require('express');
const cors = require("cors");
// routes
const authRoutes = require('./routes/authRoutes');
const moviesRoutes = require('./routes/moviesRoutes');
const sessionsRoutes = require('./routes/sessionsRoutes');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/movies', moviesRoutes);

app.use('/api/sessions', sessionsRoutes);

app.listen(3000);