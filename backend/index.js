const express = require('express');
const pool = require('./config/db');

// routes
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(3000);