require('dotenv').config();

const mysql = require('mysql2');
const migration = require('mysql-migrations');

const db = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

migration.init(db, process.cwd() + '/server/migrations');

module.exports = db;