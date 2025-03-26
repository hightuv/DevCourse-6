const dotenv = require('dotenv');
dotenv.config();

const mariadb = require('mysql2');

const db = mariadb.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.PASSWORD,
  database: 'Bookshop',
  dateStrings: true
});

module.exports = db;