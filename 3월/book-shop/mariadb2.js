const dotenv = require('dotenv');
dotenv.config();

const mariadb = require('mysql2/promise');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.PASSWORD,
  database: 'Bookshop',
  dateStrings: true,
  connectionLimit: 10
});

module.exports = {
  getConnection: () => {
    return pool.getConnection();
  },
  releaseConnection: (conn) => {
    if (conn) conn.release();
  }
};