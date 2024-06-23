const express = require('express');
const { getComments, addComment } = require('../db/commentsQueries');
const router = express.Router();

// login route
router.get('/getComments' , async (req, res) => {
    const postId = req.query.post_id;

    try {
        const comments = await getComments(postId);
        
        return res.status(200).json({ message: 'success', comments: comments })
    } catch (err) {
        console.error('Error getting comments and replies: ' + err);
        return res.status(500).json({ message: 'error', data: [] })
    }
});

router.post('/addComment' , async (req, res) => {
    const postId = req.body.postId;
    const content = req.body.content;
    const userId = req.body.userId;

    console.log(postId);
    console.log(content);
    console.log(userId);

    try {
        const result = await addComment(postId, content, userId);
    } catch (err) {
        console.error('Error adding comment: ' + err)
    }

    return res.status(200).json({ message: 'success' })
});

module.exports = router;