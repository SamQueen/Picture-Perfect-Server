const express = require('express');
const router = express.Router();
const { getAllPosts } = require('../db/postsQueries');

// login route
router.get('/feed' , async (req, res) => {
  const user_id = req.query.id;
  
  try {
    const allPosts = await getAllPosts(user_id);
    res.send(allPosts);
  } catch (err) {
    console.log('Error getting all posts: ' + err);
    res.status(500);
  }
});

module.exports = router;