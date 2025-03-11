const db = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const join = (req, res) => {
  const { email, password } = req.body;

  // 비밀번호 암호화
  const salt = crypto.randomBytes(10).toString('base64');
  const encryptedPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

  const query = 'insert into member (email, password, salt) values (?, ?, ?)';
  const values = [email, encryptedPassword, salt];

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.CREATED).json(results);
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  const query = 'select * from member where email = ?';
  const values = [email];

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const loginMember = results[0];
    const encryptedPassword = crypto.pbkdf2Sync(password, loginMember.salt, 10000, 10, 'sha512').toString('base64');

    if (loginMember && loginMember.password === encryptedPassword) {
      const token = jwt.sign({
        email: loginMember.email
      }, process.env.PRIVATE_KEY, {
        expiresIn: '5m',
        issuer: 'hightuv'
      });

      res.cookie('token', token, {
        httpOnly: true
      });
      console.log(token);

      return res.status(StatusCodes.OK).json(results);
    }

    return res.status(StatusCodes.UNAUTHORIZED).end();
  });
};

const passwordResetRequest = (req, res) => {
  const { email } = req.body;

  const query = 'select * from member where email = ?';
  const values = [email];

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const findMember = results[0];

    if (findMember) {
      return res.status(StatusCodes.OK).json({
        email
      });
    }

    return res.status(StatusCodes.UNAUTHORIZED).end();
  });
};

const passwordReset = (req, res) => {
  const { email, password } = req.body;

  // 새로 암호화
  const salt = crypto.randomBytes(10).toString('base64');
  const encryptedPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

  const query = 'update member set password = ?, salt = ? where email = ?'
  const values = [encryptedPassword, salt, email];

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (!results.affectedRows) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
}

module.exports = {
  join,
  login,
  passwordResetRequest,
  passwordReset
};