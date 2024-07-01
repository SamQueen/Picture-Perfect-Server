const pool = require('../db/connection');

const getMessagesByConversation = async(userId) => {
    const query = `SELECT 
                        m1.*, 
                        u.id AS otherUserId,
                        u.username AS otherUserUsername,
                        u.profile_picture AS otherUserProfilePhoto
                    FROM messages m1
                    INNER JOIN (
                        SELECT
                            GREATEST(sender_id, receiver_id) AS user1,
                            LEAST(sender_id, receiver_id) AS user2,
                            MAX(timestamp) AS latest_timestamp
                        FROM messages
                        WHERE sender_id = ? OR receiver_id = ?
                        GROUP BY user1, user2
                    ) m2 ON
                        GREATEST(m1.sender_id, m1.receiver_id) = m2.user1 AND
                        LEAST(m1.sender_id, m1.receiver_id) = m2.user2 AND
                        m1.timestamp = m2.latest_timestamp
                    INNER JOIN users u ON
                        (u.id = m1.sender_id AND m1.receiver_id = ?) OR
                        (u.id = m1.receiver_id AND m1.sender_id = ?)
                    WHERE m1.sender_id = ? OR m1.receiver_id = ?;` 

    try {
        const [rows] = await pool.query(query, [userId, userId, userId, userId, userId, userId]);
        
        return {
            status: 'success',
            data: rows,
        }
    } catch (err) {
        console.log(err);
        
        return {
            status: 'error',
            message: err,
        }
    }
}

const getMessagesBetweenUsers = async(userId, otherUserId) => {
    const query = `SELECT 
                        messages.*,
                        users.username AS username,
                        users.profile_picture AS profilePhoto,
                        users.id AS userId
                    FROM messages
                    JOIN users
                        ON sender_id = users.id
                    WHERE (sender_id = ? or receiver_id= ?)
                    AND (sender_id = ? or receiver_id = ?)
                    ORDER BY timestamp ASC;`;
    
    const query2 = `UPDATE messages
                    SET status = 'opened'
                    WHERE sender_id = 57 
                    AND receiver_id = 1;`;

    try {
        const [rows] = await pool.query(query, [userId, userId, otherUserId, otherUserId]);
        await pool.query(query2, [otherUserId, userId]);

        return {
            status: 'success',
            data: rows
        }
    } catch (err) {
        console.log(err);
        
        return {
            status: 'error',
            message: err,
        }
    }
}

const sendMessage = async(userId, otherUserId, message) => {
    const query = `INSERT INTO messages(sender_id, receiver_id, content, timestamp, status)
                    VALUES(?, ?, ?, now(), 'unopened');`;

    const query2 = `SELECT 
                        messages.*,
                        users.username AS username,
                        users.profile_picture AS profilePhoto,
                        users.id AS userId
                    FROM messages
                    JOIN users
                    ON sender_id = users.id
                    WHERE (sender_id = ? OR receiver_id = ?)
                    AND (sender_id = ? OR receiver_id = ?)
                    ORDER BY timestamp DESC
                    LIMIT 1;`;

    try {
        const response = await pool.query(query, [userId, otherUserId, message]); // inserts the new message into the database
        const [rows] = await pool.query(query2, [userId, userId, otherUserId, otherUserId]); // retreives the new message from the database
        
        return {
            status: 'success',
            data: rows,
        }
    } catch (err) {
        console.error('Error adding message to database: ', err);
        
        return {
            status: 'error',
            messgae: err,
        }
    }
}

module.exports = {
    getMessagesByConversation,
    getMessagesBetweenUsers,
    sendMessage,
}