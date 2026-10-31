const express = require('express');
const pool = require('./db');
const bcrypt = require("bcrypt");

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
                RETURNING (id, first_name, last_name, login, role_id, created_at)`,
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

app.listen(3000);