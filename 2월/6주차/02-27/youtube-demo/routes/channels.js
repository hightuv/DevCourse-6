const express = require('express');
const router = express.Router();
router.use(express.json());

const { body, param, validationResult } = require('express-validator');
const db = require('../mariadb');

const validate = (req, res) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    return res.status(400).json(err.array());
  }
}

router
  .route('/')
  .get(
    [body('memberId').notEmpty().isInt().withMessage('숫자 입력 필요'), validate]
    , (req, res) => { 
    // 채널 전체 조회
    const { memberId } = req.body;

    const query = 'select * from channel where member_id = ?';

    db.query(query, memberId, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).end();
      }
      if (!results.length) {
        notFoundChannel(res);
      } else {
        res.status(200).json(results);
      }
    });
  })
  .post(
    [body('memberId').notEmpty().isInt().withMessage('숫자 입력 필요'), 
     body('name').notEmpty().isString().withMessage('문자 입력 필요')]
    , (req, res) => { // 채널 개별 생성
    const err = validationResult(req);
    
    if (!err.isEmpty()) {
      return res.status(400).json(err.array());
    }

    const { name, memberId } = req.body;

    const query = 'insert into channel (name, member_id) values (?, ?)';
    const values = [name, memberId];

    db.query(query, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).end();
      }

      res.status(201).json({
        message: `${name} 채널이 생성되었습니다.`
      });
    });
  });

router
  .route('/:id')
  .get(param('id').notEmpty().isInt().withMessage('채널 ID 필요 (숫자)')
  , (req, res) => {
    // 채널 개별 조회
    const err = validationResult(req);

    if (!err.isEmpty()) {
      return res.status(400).json(err.array());
    }

    const { id } = req.params;

    const query = 'select * from channel where id = ?';

    db.query(query, id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).end();
      }

      if (!results.length) {
        notFoundChannel(res);
      } else {
        res.status(200).json(results[0]);
      }
    });
  })
  .put(
    [body('name').notEmpty().isString().withMessage('채널명 오류'),
    param('id').notEmpty().isInt().withMessage('채널 ID 필요 (숫자)')]
    , (req, res) => { 
    // 채널 개별 수정
    const err = validationResult(req);

    if (!err.isEmpty()) {
      return res.status(400).json(err.array());
    }

    const { name } = req.body;
    const { id } = req.params;

    const query = 'update channel set name = ? where id = ?';
    const values = [name, id];

    db.query(query, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).end();
      }

      if (!results.affectedRows) {
        return res.status(400).end();
      } else {
        res.status(200).json(results);
      }
    });
  })
  .delete(param('id').notEmpty().isInt().withMessage('채널 ID 필요 (숫자)')
    , (req, res) => {
    // 채널 개별 삭제
    const err = validationResult(req);

    if (!err.isEmpty()) {
      return res.status(400).json(err.array());
    }

    const { id } = req.params;
    const query = 'delete from channel where id = ?';

    db.query(query, id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).end();
      }

      if (!results.affectedRows) {
        return res.status(400).end();
      } else {
        res.status(200).json(results);
      }
    })
  });

function notFoundChannel(res) {
  res.status(404).json({
    message: '채널 정보를 찾을 수 없습니다.'
  });
}

  module.exports = router;
  