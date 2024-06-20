const pool = require('../db/connection');

const getAllPosts = async(id) => {
    // returns posts by most likes
    const query = `SELECT  users.profile_picture, 
                    users.first_name, 
                    users.last_name, users.username, 
                    users.id AS user_id, 
                    posts.id, 
                    posts.caption,
                    posts.date, 
                    posts.image, COUNT(likes.id) AS like_count
                FROM database2.posts AS posts
                LEFT JOIN database2.likes AS likes
                ON posts.id = likes.post_id
                LEFT JOIN database2.users AS users
                ON posts.user_id = users.id
                GROUP BY posts.id, posts.caption, posts.date
                ORDER BY like_count DESC;`;

    // returns posts by most recent
    const query2 = `SELECT 
                    users.profile_picture, 
                    users.first_name, 
                    users.last_name, 
                    users.username, 
                    users.id AS user_id, 
                    posts.id AS post_id, 
                    posts.caption,
                    posts.date, 
                    posts.image, 
                    COUNT(likes.id) AS like_count,
                    MAX(CASE
                        WHEN likes.user_id = ? THEN TRUE
                        ELSE FALSE
                    END) AS is_liked
                    FROM database2.posts AS posts
                    LEFT JOIN database2.likes AS likes ON posts.id = likes.post_id
                    LEFT JOIN database2.users AS users ON posts.user_id = users.id
                    GROUP BY 
                    users.profile_picture, 
                    users.first_name, 
                    users.last_name, 
                    users.username, 
                    users.id, 
                    posts.id, 
                    posts.caption, 
                    posts.date, 
                    posts.image
                    ORDER BY posts.date DESC;`;
    
    try {
        const [rows] = await pool.query(query2, [id]);

        return rows;
    } catch {
        return [];
    }
}

/**
 * Retrieves all of the users posts by their ID.
 *
 * @param {number} id - The ID of the user to retrieve.
 * @returns {Promise<Array>} A promise that resolves to an array of user records.
 **/
const getPostsById = async(id) => {
    const query = `SELECT * FROM database2.posts
                   WHERE user_id = ?;`
    
    try {
        const [rows] = await pool.query(query, [id]);

        return {
            status: 'success',
            message: 'successfull',
            data: rows,
        }
    } catch(err) {
        return {
            status: 'error',
            message: 'Error getting user posts from database',
        }
    }
}

const createPost = async(userId, imageUrl, caption) => {
    const query = `INSERT INTO database2.posts (user_id, image, caption, date)
                    VALUES(?, ?, ?, now());`;

    try {
        const [rows] = await pool.query(query, [userId, imageUrl, caption]);

        return {
            status: 'success',
            message: 'successfull',
            data: rows,
        }
    } catch (err) {
        console.error('Error adding post to database: ' + err);

        return {
            status: 'error',
            message: 'Error adding post to database',
        }
    }
}

const deletePost = async(id) => {
    const query = `DELETE FROM database2.posts WHERE id = ?`;

    try {
        const response = await pool.query(query, [id]);

        return ({
            status: 'success',
            message: 'Post deleted'
        })
    } catch (err) {
        return ({
            status: 'error',
            message: err
        })
    }
}

module.exports = {
    getAllPosts,
    getPostsById,
    createPost,
    deletePost,
}