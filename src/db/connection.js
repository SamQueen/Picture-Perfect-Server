// /db/connection.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const inProduction = process.env.NODE_ENV === 'production';
let pool;

if (!inProduction) {
    // local testing connection
    pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        database: 'database2',
        password: '5121',
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
    });
} else {
    // production connection
    pool = mysql.createPool({
        host: process.env.CLEARDB_HOSTNAME,
        user: process.env.CLEARDB_USERNAME,
        database: 'heroku_52f7453ae4271ef',
        password: process.env.CLEARDB_PASSWORD,
        port: process.env.CLEARDB_PORT,
        waitForConnections: true,
        connectionLimit: 3,
        maxIdle: 3, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
    });
}

module.exports = pool;