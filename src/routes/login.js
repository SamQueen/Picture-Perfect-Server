require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../db/connection');

// login route
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    if (!email || !password) {
        return res.status(403).json({ message: "Email or password missing!" }); 
    }

    try {
        const [results] = await pool.query(
            "SELECT id, password FROM users WHERE email = ?", [email]
        );

        // if user not found in database
        if (results.length === 0) {
            return res.status(403).json({ message: "Incorrect email or password" });
        }

        const dbPassowrd = results[0].password;

        if (password == dbPassowrd) {
            const user = { user_id: results[0].id }
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            const isProduction = process.env.NODE_ENV === "production";

            if (isProduction)
                console.log('in production')

            // Set the token as a cookie
            res.cookie('access_token', accessToken, {
                httpOnly: true, // Make cookies inaccesible to Javascript on client side
                secure: false,//isProduction, // Ensure the cookie is sent over HTTPS in production
                sameSite: isProduction ? 'None' : "Lax", // Set SameSite attribute
                maxAge: 3600000, // 1 hour
                path: '/',
                domain: isProduction ? '.pictureper.com' : undefined,
            });

            return res.status(200).json({ message: 'login successful' });
        }

        // password does not match from database
        return res.status(403).json({ message: "Incorrect email or password" });
    } catch(err) {
        console.error('Error logging in: ' + err)
        return res.status(500).json({ message: "Error connecting to database. Try again later" });
    }
});

module.exports = router;