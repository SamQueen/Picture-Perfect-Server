const pool = require('../db/connection');
const { parseComments } = require('../lib/commentParser');

/**
 * Retrieves all comment and replies from the database by the post id.
 *
 * @param {postID} id - The ID of the post.
 * @returns {Promise<Array>} A promise that resolves to an array of user records.
 */
const getComments = async(postId) => {
    const query = `SELECT c1.id, c1.content, c1.created_at, u.username, u.profile_picture, u2.profile_picture AS reply_profile_picture, c2.id AS reply_id, c2.content AS reply_content, c2.created_at AS reply_created_at, u2.username AS reply_username
                    FROM comments c1
                    LEFT JOIN comments c2 ON c1.id = c2.parent_id
                    JOIN users u ON c1.user_id = u.id
                    LEFT JOIN users u2 ON c2.user_id = u2.id
                    WHERE c1.post_id = ? AND c1.parent_id IS NULL
                    ORDER BY c1.created_at, c2.created_at;`;
    
    try {
        const [rows] = await pool.query(query, [postId]);
        const parsedComments = parseComments(rows);

        return parsedComments;
    } catch(err) {
        console.error(`Error getting user by ID from database: ${err.message}`);
        return [];
    }
}

const addComment = async(postId, content, userId, parentId) => {
    const query = `INSERT INTO comments(user_id, post_id, parent_id, content, created_at)
                    VALUES(?, ?, ?, ?, now());`

    try {
        await pool.query(query, [userId, postId, parentId, content]);

        return {
            status: 'success',
            message: 'success'
        }
    } catch (err) {
        console.error('Error adding comment to database: ', err);

        return {
            status: 'error',
            message: 'Error adding comment to database: ' + err,
        }
    }
}

module.exports = {
    getComments,
    addComment
}
