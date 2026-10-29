
require('dotenv').config();

const express = require('express');
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;

app.use(express.json());

// Проверка работы сервера
app.get('/', (req, res) => {
    res.send('CinemaTicket API работает');
});

// Регистрация
app.post('/api/auth/register', async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({
            message: 'Логин и пароль обязательны'
        });
    }

    if (
        typeof login !== 'string' ||
        !/^[a-zA-Z0-9_-]{3,20}$/.test(login)
    ) {
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
        );

        if (selectResult.rows.length > 0) {
            return res.status(409).json({
                message: 'Такой логин уже занят'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const insertResult = await pool.query(
            `INSERT INTO users (login, password_hash, role_id)
             VALUES ($1, $2, 1)
                 RETURNING user_id, login, role_id, created_at`,
            [login, passwordHash]
        );

        return res.status(201).json({
            message: 'Регистрация успешна',
            user: insertResult.rows[0]
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: 'Внутренняя ошибка сервера'
        });
    }
});

// Вход
app.post('/api/auth/login', async (req, res) => {
    const { login, password } = req.body;

    if (
        typeof login !== 'string' ||
        typeof password !== 'string' ||
        !login ||
        !password
    ) {
        return res.status(400).json({
            message: 'Логин и пароль обязательны'
        });
    }

    try {
        const result = await pool.query(
            `SELECT user_id, login, password_hash, role_id
             FROM users
             WHERE login = $1`,
            [login]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: 'Неверный логин или пароль'
            });
        }

        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Неверный логин или пароль'
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET не задан в .env');
        }

        // Создаём токен на 2 часа
        const token = jwt.sign(
            {
                user_id: user.user_id,
                role_id: user.role_id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );

        return res.status(200).json({
            message: 'Вход выполнен успешно',
            token: token,
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

// Проверка токена пользователя
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Требуется авторизация'
        });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            message: 'Сервер не настроен для проверки токенов'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) {
            return res.status(403).json({
                message: 'Недействительный или просроченный токен'
            });
        }

        req.user = decodedUser;
        next();
    });
}

// Получение профиля авторизованного пользователя
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT user_id, login, role_id, created_at
             FROM users
             WHERE user_id = $1`,
            [req.user.user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        return res.status(200).json({
            user: result.rows[0]
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: 'Внутренняя ошибка сервера'
        });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`CinemaTicket API работает на порту ${PORT}`);
});
