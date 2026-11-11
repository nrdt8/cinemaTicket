const pool = require("../config/db");

// all films

const movies = async (req, res) => {
    try {
        const checkMovies = await pool.query(
            `SELECT * FROM movies`
        )

        if (checkMovies.rows.length === 0) {
            return res.status(404).json({
                error: "No movies found"
            })
        }

        return res.status(200).send({
            status: 200,
            data: checkMovies.rows,
        })

    } catch (error) {
        return res.status(500).json({
            error: "Database connection error"
        })
    }

}

// films that have sessions

module.exports = {
    movies
}