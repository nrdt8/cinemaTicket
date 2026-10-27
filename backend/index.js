const express = require('express');
const pool = require('./db')

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('CinemaTicket API работает')
})

app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM roles;')

        res.json({
            message: result,
            database: result.rows[0].current_database
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Ошибки подключения в DB"
        })
    }
})

app.listen(PORT, () => {
    console.log('Сервак работает')
})

