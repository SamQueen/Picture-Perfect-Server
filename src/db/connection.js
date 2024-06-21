// /db/connection.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// local testing connection
/* const pool = mysql.createPool({
    host: 'mysql://b9f4abbb22f7c7:fbf1d34a@us-cluster-east-01.k8s.cleardb.net/heroku_52f7453ae4271ef?reconnect=true',
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
 */

// production connection
const pool = mysql.createPool({
    host: process.env.CLEARDB_HOSTNAME,
    user: process.env.CLEARDB_USERNAME,
    database: 'heroku_52f7453ae4271ef',
    password: process.env.CLEARDB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 3,
    maxIdle: 3, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

module.exports = pool;