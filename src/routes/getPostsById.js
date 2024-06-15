const express = require('express');
const router = express.Router();
const { getPostsById } = require('../db/postsQueries');

// login route
router.get('/getPosts' , async (req, res) => {
    const id = req.query.id;
    
    try {
        const results = await getPostsById(id);

        if (results.status === 'success')
            return res.json({ data: results.data} ).status(200);

        return res.json({ data: []} ).status(404);
    } catch (err) {
        console.log('Error getting all posts: ' + err);
        return res.json({ data: []} ).status(500);
    }
});

module.exports = router;