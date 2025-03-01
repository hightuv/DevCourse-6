const express = require('express');
const router = express.Router();
router.use(express.json());

// jwt 모듈
const jwt = require('jsonwebtoken');

// dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

const { body, validationResult } = require('express-validator');
const db = require('../mariadb');

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next(); // 다음 할 일 (미들웨어, 함수)
  } else {
    return res.status(400).json(err.array());
  }
};

// 로그인
router.post(
  '/login',
  [
    body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
    body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
    validate
  ]
  , (req, res) => {
    const { email, password } = req.body;

    const query = 'select * from member where email = ?';
    const values = [email, password];

    db.query(query, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).end();
      }

      let loginUser = results[0];

      if (loginUser && loginUser.password === password) {
        // token 발급
        const token = jwt.sign({
          email: loginUser.email,
          name: loginUser.name
        }, process.env.PRIVATE_KEY, {
          expiresIn: '5m',
          issuer: 'hightuv'
        });
        
        res.cookie('token', token, {
          httpOnly: true
        });

        res.status(200).json({
          message : `${loginUser.name}님 로그인 되셨습니다.`
        });
      } else {
        res.status(403).json({ // Forbidden from accessing a valid URL
          message: '이메일 또는 비밀번호가 틀렸습니다.'
        });
      }
    });
  }
);

// 회원가입
router.post(
  '/join',
  [
    body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
    body('name').notEmpty().isString().withMessage('이름 확인 필요'),
    body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
    body('contact').notEmpty().isString().withMessage('연락처 확인 필요'),
    validate
  ]
  , (req, res) => {
    const { email, name, password, contact = ''} = req.body;

    const query = 'insert into member (email, name, password, contact) values (?, ?, ?, ?)';
    const values = [email, name, password, contact];

    db.query(query, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).end();
      }

      if (!results.affectedRows) {
        res.status(500).json({
          message: 'DB오류'
        });
      } else {
        res.status(201).json({
          message: `${name}님 환영합니다.`
        });
      }
    });
  }
);

router
  .route('/members')
  .get(
    [
      body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
      body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
      validate
    ]
    , (req, res) => {
      // 회원 개별 조회
      const { email } = req.body;

      const query = 'select * from member where email = ?';

      db.query(query, email, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).end();
        }

        if (!results.length) {
          res.status(404).json({
            message: '회원 정보가 없습니다.'
          });
        } else {
          res.status(200).json(results[0]);
        }
      });
    }
  )
  .delete(
    [
      body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
      validate
    ]
    , (req, res) => {
      // 회원 탈퇴
      const { email } = req.body;

      const query = 'delete from member where email = ?';

      db.query(query, email, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).end();
        }

        if (!results.affectedRows) {
          res.status(404).json({
            message: '회원 정보가 없습니다.'
          });
        } else {
          res.status(200).json(results);
        }
      });
    }
  );

module.exports = router;
