const express = require('express');
const router = express.Router();
const { createUser } = require('../db/userQueries');

// login route
router.post('/createUser', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;

    try {
        const result = await createUser(username, firstName, lastName, email, password)
        
        if (result.status === 'error') {
            return res.json(result).status(result.status);
        }
        
        res.json(result).status(200);
    } catch {
        return res.status(500).json({ 
            status: 'error', 
            message: 'Server error', 
            error: err.message 
        });
    }
});

module.exports = router;