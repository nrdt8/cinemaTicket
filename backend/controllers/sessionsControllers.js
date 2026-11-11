const pool = require("../config/db");

const sessions = async (req, res) => {
    try {
        const checkSessions = await pool.query(
            `SELECT * FROM sessions`
        )

        if (checkSessions.rows.length === 0) {
            return res.status(404).json({
                error: "No session found"
            })
        }

        return res.status(200).send({
            status: 200,
            data: checkSessions.rows,
        })

    } catch (error) {
        return res.status(500).json({
            error: "Database connection error"
        })
    }

}

module.exports = {
    sessions
}