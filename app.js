const express = require('express');
const app = express()

const cors = require('cors');
const cookieParser = require('cookie-parser');
const pool = require('./src/db/connection');
const { getAllUsers } = require('./src/db/userQueries')
const http = require('http');
const  server = http.createServer(app);
const { Server } = require("socket.io");
const { sendMessage } = require('./src/db/messageQueries');

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
const messagesRoute = require('./src/routes/messages');

const port = process.env.PORT || 5000;

const isProduction = process.env.NODE_ENV === "production";

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

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
app.use('/', messagesRoute);
 

io.on('connection', (socket) => {
    console.log('User connected via socket');

    socket.on('send_message', async(data, callback) => {
        // add message to database
        try {
            const response = await sendMessage(data.userId, data.otherUserId, data.message);

            if (response.status === 'error') return;
            
            socket.broadcast.emit("rec_message", response.data[0]);

            // return response to the client that sent the message
            callback(response.data[0]);
        } catch (err) {
            console.error('Error sending message: ', err);
        }
    })
});

app.get('/searchUsers', async(req, res) => {
    const input = req.query.input;
    
    try {
        const response = await getAllUsers(input);

        if (response.status === 'error') {
            return res.status(500).json({ message: response.message })
        }

        return res.status(200).json({ users: response.data })
    } catch (err) {
        console.error('Error getting all users: ', err);
        return res.status(500).json({ message: err })
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
});

server.listen(port, () => {
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