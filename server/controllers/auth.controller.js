import bcrypt from 'bcrypt';
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import db from '../config/database';

const mysql = require('mysql2');

/**
 * Returns jwt token if valid email and password is provided
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function login(req, res) {
    const {email, password} = req.body;
    const sqlSearch = 'Select * from userTable where email = ?';
    const searchQuery = mysql.format(sqlSearch, [email]);

    const promisePool = db.promise();
    const [fields] = await promisePool.query(searchQuery);

    if (!fields.length) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
            success: false, message: 'Invalid username or password.'
        });
    }

    const [user] = fields;
    const hashedPassword = user.password;

    if (!await bcrypt.compare(password, hashedPassword)) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
            success: false,
            message: 'Authentication failed. Invalid password.'
        });
    }

    const token = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.TOKEN_SECRET_KEY);

    return res.json({
        success: true,
        token,
        email: user.email
    });
}