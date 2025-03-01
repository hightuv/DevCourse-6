const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.PASSWORD,
  database: 'Youtube',
  dateStrings: true
});

db.connect(err => {
  if (err) {
    console.log(err)
    console.log('DB 연결 실패');
  } else {
    console.log('DB 연결 성공');
  }
});

module.exports = db;