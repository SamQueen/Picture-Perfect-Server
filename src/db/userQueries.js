const pool = require('../db/connection');


/**
 * Creates a user fin the database by their first name, last name username, password and email.
 *
 * @param {number} id - The ID of the user to retrieve.
 * @returns {object}
 */
const createUser = async(username, firstName, lastName, email, password) => {
    const date = new Date();
    const defaultProfilePath = 'defaultProfile.jpg';
    const query = `INSERT INTO database2.users(username, first_name, last_name, email, password, profile_picture, role, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    try {
        const results = await pool.query(query, [username, firstName, lastName, email, password, defaultProfilePath, "user", "active", date]);

        return {
            status: 'success',
            message: 'User created successfully',
            data: results,
        }
    } catch(err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return {
                status: 'error',
                message: 'Duplicate username or email',
                code: 409,
            }
        }

        return {
            status: 'error',
            message: 'Error adding new user to database',
            code: 500,
        }
    }
}

/**
 * Retrieves a user from the database by their ID.
 *
 * @param {number} id - The ID of the user to retrieve.
 * @returns {Promise<Array>} A promise that resolves to an array of user records.
 */
const getUserById = async(id) => {
    try {
        const [rows] = await pool.query(`
            SELECT id, username, first_name, last_name, email, profile_picture, role, status, created_at
            FROM database2.users
            WHERE id = ?;
        `, [id]);

        return rows;
    } catch(err) {
        console.error(`Error getting user by ID from database: ${err.message}`);
        return [];
    }
}

module.exports = {
    createUser,
    getUserById
}
