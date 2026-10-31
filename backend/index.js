const express = require('express');
const pool = require('./db');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

app.post('/register', async (req, res) => {
    const { first_name, last_name, login, password } = req.body;

    if (
        typeof first_name !== 'string' ||
        typeof last_name !== 'string' ||
        typeof login !== 'string' ||
        typeof password !== 'string'
    ) {
        return res.status(400).json({
            message: 'All fields must be strings'
        });
    }

    if (
        !first_name.trim() ||
        !last_name.trim() ||
        !login.trim() ||
        !password.trim()
    ) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(login)) {
        return res.status(400).json({
            message: 'Login must be 3–20 characters long and contain only English letters, digits, _ or -'
        });
    }

    if (
        !/^[\p{L}'-]{2,50}$/u.test(first_name.trim()) ||
        !/^[\p{L}'-]{2,50}$/u.test(last_name.trim())
    ) {
        return res.status(400).json({
            message: 'Names must contain 2–50 letters. Hyphens and apostrophes are allowed.'
        });
    }

    if (!/^[\x21-\x7E]{8,72}$/.test(password)) {
        return res.status(400).json({
            message: 'Password must be 8–72 characters long and contain only English letters, numbers, and special characters.'
        });
    }

    try {

        const checkLogin = await pool.query(
            "SELECT * FROM users WHERE login = $1",
            [login]
        )

        if(checkLogin.rows.length > 0){
            return res.status(400).send({error: 'This login is already taken'});
        }

        const password_hash = bcrypt.hashSync(password, 12);

        const insertUsers = await pool.query(
            `INSERT INTO users (first_name, last_name, login, password_hash, role_id)
            VALUES ($1, $2, $3, $4, 1)
                RETURNING id, first_name, last_name, login, role_id, created_at`,
            [first_name, last_name, login, password_hash]
        )

        return res.status(201).send({
            status: 201,
            data: insertUsers.rows[0],
        })

    } catch (error) {
        console.error(error);

        res.status(500).send({error: error.message});
    }
})

app.post('/login', async (req, res) => {
    const { login, password } = req.body;

    if (typeof login !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
            message: 'All fields must be strings'
        });
    }

    if (!login.trim() || !password.trim()) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    try {
        const checkLogin = await pool.query(
            `SELECT * FROM users WHERE login = $1`,
            [login]
        )

        if (checkLogin.rows.length === 0){
            return res.status(400).send({
                message: 'Login not found'
            })
        }

        const isPasswordValid = await bcrypt.compare(password, checkLogin.rows[0].password_hash);

        if (!isPasswordValid) {
            return res.status(400).send({
                message: 'Passwords do not match'
            })
        }

        const token = jwt.sign(
            {
                id: checkLogin.rows[0].id,
                role_id: checkLogin.rows[0].role_id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30d'
            }
        )

        const user = checkLogin.rows[0]

        return res.status(200).send({
            status: 200,
            data: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                login: user.login,
                role_id: user.role_id,
                created_at: user.created_at
            },
            token: token
        })


    } catch (error) {
        console.error(error);

        return res.status(500).send({error: error.message});
    }
});

app.get('/profile', async (req, res) => {
    const authorization = req.headers.authorization;

    const token = authorization.split(' ')[1]

    try {

        const result = jwt.verify(
            token,
            process.env.JWT_SECRET,
        )

        return res.status(200).send({
            message: result,
        })
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
})

function authMiddleware (req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).send({
            message: 'Invalid authorization header'
        })
    }

    const token = authorization.split(' ')[1]

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
        )

        return decoded
    } catch (err) {
        return res.status(401).send({
            "message": "Unauthorized",
        })
    }
}

app.listen(3000);