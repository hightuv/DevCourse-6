const express = require('express');
const router = express.Router();
router.use(express.json());

const db = require('../mariadb');

// 로그인
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'select * from member where email = ?';
  const values = [email, password];

  db.query(query, values, (err, results) => {
    let loginUser = results[0];

    if (loginUser && loginUser.password === password) {
      res.status(200).json({
        message : `${loginUser.name}님 로그인 되셨습니다.`
      });
    } else {
      res.status(400).json({
        message: '이메일 또는 비밀번호가 틀렸습니다.'
      });
    }
  });
});

// 회원가입
router.post('/join', (req, res) => {
  const { email, name, password, contact = ''} = req.body;

  const query = 'insert into member (email, name, password, contact) values (?, ?, ?, ?)';
  const values = [email, name, password, contact];

  db.query(query, values, (err, results) => {
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
});

router
  .route('/members')
  .get((req, res) => { // 회원 개별 조회
    const { email } = req.body;

    const query = 'select * from member where email = ?';

    db.query(query, email, (err, results) => {
      if (!results.length) {
        res.status(404).json({
          message: '회원 정보가 없습니다.'
        });
      } else {
        res.status(200).json(results[0]);
      }
    });
  })
  .delete((req, res) => { // 회원 개별 탈퇴
    const { email } = req.body;

    const query = 'delete from member where email = ?';

    db.query(query, email, (err, results) => {
      if (!results.affectedRows) {
        res.status(404).json({
          message: '회원 정보가 없습니다.'
        });
      } else {
        res.status(200).json(results);
      }
    });
  });

module.exports = router;
