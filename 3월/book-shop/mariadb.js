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

db.connect((err) => {
  if (err) {
    console.log('DB 연결 실패');
  } else {
    console.log('DB 연결 성공');
  }
});

module.exports = db;