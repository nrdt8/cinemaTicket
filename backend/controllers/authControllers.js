const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { first_name, last_name, login, password } = req.body;

    if (typeof first_name !== 'string' || typeof last_name !== 'string' || typeof login !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
            error: "INVALID_FIELD_TYPE"
        });
    }

    if (!first_name.trim() || !last_name.trim() || !login.trim() || !password.trim()) {
        return res.status(400).json({
            error: "FIELDS_REQUIRED"
        });
    }

    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(login)) {
        return res.status(400).json({
            error: "INVALID_LOGIN"
        });
    }

    if (!/^[\p{L}'-]{2,50}$/u.test(first_name.trim()) || !/^[\p{L}'-]{2,50}$/u.test(last_name.trim())) {
        return res.status(400).json({
            error: "INVALID_NAME"
        });
    }

    if (!/^[\x21-\x7E]{8,72}$/.test(password)) {
        return res.status(400).json({
            error: "INVALID_PASSWORD"
        });
    }

    try {
        const checkLogin = await pool.query(
            "SELECT * FROM users WHERE Login = $1",
            [login]
        )

        if (checkLogin.rows.length > 0){
            return res.status(409).send({error: "LOGIN_ALREADY_EXISTS"});
        }

        const password_hash = await bcrypt.hash(password, 12);

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
        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR"
        })
    }
};

const login = async (req, res) => {
    const { login, password } = req.body;

    if (typeof login !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
            error: "INVALID_FIELD_TYPE"
        });
    }

    if (!login.trim() || !password.trim()) {
        return res.status(400).json({
            error: "FIELDS_REQUIRED"
        });
    }

    try {
        const checkLogin = await pool.query(
            "SELECT * FROM users WHERE Login = $1",
            [login]
        );

        if (checkLogin.rows.length === 0) {
            return res.status(401).json({
                error: "INVALID_CREDENTIALS"
            });
        }

        const user = checkLogin.rows[0];

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                error: "INVALID_CREDENTIALS"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role_id: user.role_id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30d'
            }
        );

        return res.status(200).json({
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
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR"
        });
    }
};

const authMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            error: "INVALID_AUTHORIZATION_HEADER"
        });
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded.id;

        next();

    } catch (error) {
        return res.status(401).json({
            error: "INVALID_TOKEN"
        });
    }
};

const profile = async (req, res) => {
    try {
        const selectProfile = await pool.query(
            `SELECT id, first_name, last_name, login, role_id, created_at
             FROM users WHERE id = $1`,
            [req.user]
        );

        if (selectProfile.rows.length === 0) {
            return res.status(404).json({
                error: "USER_NOT_FOUND"
            });
        }

        return res.status(200).json({
            status: 200,
            data: selectProfile.rows[0]
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR"
        });
    }
};

module.exports = {
    register, login, authMiddleware, profile
};