const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const pool = require('./src/db/connection');
const loginRoute = require('./src/routes/login');
const feedRoute = require('./src/routes/feed');
const loggedInUserRoute = require('./src/routes/loggedInUser');
const createUserRoute = require('./src/routes/createUser');
const postsRoute = require('./src/routes/getPostsById');
const likesRoute = require('./src/routes/like');
const editProfileRoute = require('./src/routes/editProfile');
const createPostRoute = require('./src/routes/createPost');
const deletePostRoute = require('./src/routes/deletePost');
const commentsRoute = require('./src/routes/comments');

const app = express()
const port = process.env.PORT || 5000;

const isProduction = process.env.NODE_ENV === "production";

// Allow all origins (not recommended for production)
app.use(cors({
    origin : isProduction ? "https://www.pictureper.com" : "http://localhost:3000",
    credentials: true,
}));

// Allow app to use json
app.use(express.json());

// Allow cooikes to be sent to client
app.use(cookieParser());

// Define routes
app.use('/', loginRoute);
app.use('/', feedRoute);
app.use('/', loggedInUserRoute);
app.use('/', createUserRoute);
app.use('/', postsRoute);
app.use('/', likesRoute);
app.use('/', createPostRoute);
app.use('/', editProfileRoute);
app.use('/', deletePostRoute);
app.use('/', commentsRoute);

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});


// handle server shutdown
process.on('SIGTERM', () => {
    if (pool) {
        pool.end();
    }
    process.exit(0);
});

process.on('SIGINT', () => {
    if (pool) {
        pool.end();
    }
    process.exit(0);
});