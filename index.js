
require('dotenv').config();

const express = require('express');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('CinemaTicket API работает!');
});

app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT current_database() AS database, NOW() AS server_time'
        );

        res.json({
            status: 'ok',
            message: 'Подключение к PostgreSQL работает',
            database: result.rows[0].database,
            serverTime: result.rows[0].server_time,
        });
    } catch (error) {
        console.error('Ошибка PostgreSQL:', error);

        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
});


app.get('/api/roles', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT role_id, name, description FROM roles ORDER BY role_id'
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка получения ролей:', error.message);

        res.status(500).json({
            message: 'Не удалось получить роли',
        });
    }
});


app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});


