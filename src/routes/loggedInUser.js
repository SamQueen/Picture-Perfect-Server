const express = require('express');
const router = express.Router();
const authenticateToken  = require('../middlewares/authenticateToken');
const { getUserById } = require('../db/userQueries');

// login route
router.post('/loggedInUser' , authenticateToken, async (req, res) => {
    const user_id = req.user.user_id;

    const response = await getUserById(user_id);
    let user;

    if  (response.length) {
        user = response[0];
    }

    return res.json(user).status(200);
});

router.get('/userById', async(req,res) => {
    const userId = req.query.userId;

    const response = await getUserById(userId);
    let user;

    if  (response.length) {
        user = response[0];
    }

    return res.status(200).json(user);
});

module.exports = router;