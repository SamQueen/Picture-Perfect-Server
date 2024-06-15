const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// like post route
router.post('/like' , async (req, res) => {
    const userId = req.body.user_id;
    const postId = req.body.post_id;
    const query1 = `SELECT * FROM database2.likes
                    WHERE user_id = ?
                    AND post_id = ?;`;
    const query2 = `INSERT INTO database2.likes(user_id, post_id)
                    VALUES ( ?, ?);`

    try {
        const [results] = await pool.query(query1, [userId, postId]);
        
        if (results.length === 0) {
            await pool.query(query2, [userId, postId]);

            return res.status(200).json({ message: 'success' });
        }
        
        return res.status(400).json({ message: 'duplicate request' });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: 'error' });
    }
});

// unlike post route
router.post('/unlike' , async (req, res) => {
    const userId = req.body.user_id;
    const postId = req.body.post_id;
    const query1 = `DELETE FROM database2.likes
                    WHERE user_id = ?
                    AND post_id = ?;`;

    try {
        const [results] = await pool.query(query1, [userId, postId]);
        
        return res.status(200).json({ message: 'success' });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: 'error' });
    }
});

module.exports = router;