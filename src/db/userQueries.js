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
    const query = `INSERT INTO users(username, first_name, last_name, email, password, profile_picture, role, status, created_at)
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
            FROM users
            WHERE id = ?;
        `, [id]);

        return rows;
    } catch(err) {
        console.error(`Error getting user by ID from database: ${err.message}`);
        return [];
    }
}

const updateProfilePhoto = async(id, url) => {
    const query = `UPDATE users
                    SET profile_picture=?
                    WHERE id=?`;
    
    try {
        const[rows] = await pool.query(query, [url, id]);

        return {
            status: 'success',
            message: 'successfull',
            data: rows,
        }
    } catch(err) {
        console.error('Error updataing profile photo in database: ' + err);

        return {
            status: 'error',
            message: 'Error updating profile photo in database',
        }
    }
}

const getAllUsers = async(input) => {
    const query = `SELECT id, username, profile_picture AS profilePhoto 
                    FROM users
                    WHERE username LIKE ?;`;

    try {
        const [rows] = await pool.query(query, [`%${input}%`]);

        return {
            status: 'success',
            data: rows,
        }
    } catch(err) {
        console.error('Error getting all users from database: ', err);

        return {
            status: 'error',
            message: err,
        }
    }
}

module.exports = {
    createUser,
    getUserById,
    updateProfilePhoto,
    getAllUsers
}
