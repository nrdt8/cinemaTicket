const express = require('express');
const pool = require('./db')
const bcrypt = require('bcrypt');
const selectResult = require("pg/lib/query");

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('CinemaTicket API работает')
})

app.post('/api/auth/register', async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({
            message: 'Логин и пароль обязательны'
        });
    }

    if (typeof login !== 'string' || !/^[a-zA-Z0-9_-]{3,20}$/.test(login)) {
        return res.status(400).json({
            message: 'Логин должен содержать 3–20 символов: английские буквы, цифры, _ или -'
        });
    }

    if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({
            message: 'Пароль должен содержать минимум 8 символов'
        });
    }

    try {
        const selectResult = await pool.query(
            'SELECT user_id FROM users WHERE login = $1',
            [login]
        )

        if (selectResult.rows.length > 0) {
            return res.status(409).json({
                message: 'Такой логин уже занят'
            })
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const insertResult  = await pool.query(
            `INSERT INTO users (login, password_hash, role_id)
            VALUES ($1, $2, 1) 
            RETURNING user_id, login, role_id, created_at`,
            [login, passwordHash]
        )

        return res.status(201).json({
            message: 'Регистрация успешна',
            user: insertResult.rows[0]
        });



    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Внутренняя ошибка сервера"
        })
    }
})

app.post('/api/auth/login', async (req, res) => {
    const { login, password } = req.body;

    // 1. Проверяем входные данные
    if (!login || !password) {
        return res.status(400).json({
            message: 'Логин и пароль обязательны'
        });
    }

    try {
        // 2. Ищем пользователя в базе по логину
        const result = await pool.query(
            `SELECT user_id, login, password_hash, role_id
             FROM users
             WHERE login = $1`,
            [login]
        );

        // 3. Проверяем, существует ли пользователь
        if (result.rows.length === 0) {
            return res.status(401).json({
                message: 'Неверный логин или пароль'
            });
        }

        const user = result.rows[0];

        // 4. Сравниваем пароль с сохранённым хешем
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Неверный логин или пароль'
            });
        }

        // 5. Если всё правильно — сообщаем об успешном входе
        return res.status(200).json({
            message: 'Вход выполнен успешно',
            user: {
                user_id: user.user_id,
                login: user.login,
                role_id: user.role_id
            }
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: 'Внутренняя ошибка сервера'
        });
    }
});



app.listen(PORT, () => {
    console.log('Сервак работает')
})

