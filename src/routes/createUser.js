const express = require('express');
const router = express.Router();
const { createUser } = require('../db/userQueries');

router.post('/createUser', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;

    // validate input
    if(!username || !email || !firstName || !lastName || !password) {
        return res.status(400).json({ 
            status: 'error', 
            message: validationError 
        });
    }

    try {
        const result = await createUser(username, firstName, lastName, email, password)
        
        if (result.status === 'error') {
            console.error("Error creating new user: ", result.message);
            
            return res.status(500).json({ 
                message: result.message, 
            });
        }
        
        return res.status(200).json({ 
            message: 'success', 
        });
    } catch(err) {
        console.error("Error creating new user: ", err);

        return res.status(500).json({ 
            message: 'Server error', 
        });
    }
});

module.exports = router;