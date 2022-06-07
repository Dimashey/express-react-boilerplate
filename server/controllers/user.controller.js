import bcrypt from 'bcrypt';
import HttpStatus from 'http-status-codes';
import db from '../config/database';

const mysql = require('mysql2');

/**
 * Store new user
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function store(req, res) {
    const {first_name: firstName, last_name: lastName, password, email} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const searchQuery = mysql.format('SELECT * FROM userTable WHERE email = ?', [email]);
    const insertQuery = mysql.format('INSERT INTO userTable VALUES (0,?,?,?,?)', [firstName, lastName, hashedPassword, email]);

    const promisePool = db.promise();

    const [rows] = await promisePool.query(searchQuery);

    if (rows.length) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: 'Pizda'
            }
        );
    }

    await promisePool.query(insertQuery);

    return res.json({
        success: true,
        data: {
            firstName,
            lastName,
            hashedPassword,
            email
        }
    });
}