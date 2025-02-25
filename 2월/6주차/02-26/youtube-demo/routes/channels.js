const express = require('express');
const router = express.Router();
router.use(express.json());

const db = require('../mariadb');

router
  .route('/')
  .get((req, res) => { // 채널 전체 조회
    const memberId = parseInt(req.body.memberId);
    
    const query = 'select * from channel where member_id = ?';

    if (memberId) {
      db.query(query, memberId, (err, results) => {
        if (!results.length) {
          notFoundChannel(res);
        } else {
          res.status(200).json(results);
        }
      });
    } else {
      res.status(400).end();
    }
  })
  .post((req, res) => { // 채널 개별 생성
    const { name } = req.body;
    const memberId = parseInt(req.body.memberId);
    
    if (!name || !memberId) {
      res.status(400).json({
        message: '요청 값을 제대로 보내주세요.'
      });
    } else {
      const query = 'insert into channel (name, member_id) values (?, ?)';
      const values = [name, memberId];

      db.query(query, values, (err, results) => {
        if (!results.affectedRows) {

        } else {
          res.status(201).json({
            message: `${name} 채널이 생성되었습니다.`
          });
        }
      });
    }
  });

router
  .route('/:id')
  .get((req, res) => { // 채널 개별 조회
    const id = parseInt(req.params.id);

    const query = 'select * from channel where id = ?';

    db.query(query, id, (err, results) => {
      if (!results.length) {
        notFoundChannel(res);
      } else {
        res.status(200).json(results[0]);
      }
    });
  })
  .put((req, res) => { // 채널 개별 수정
    const id = parseInt(req.params.id);
    const findChannel = db.get(id);

    if (!findChannel) {
      res.status(404).json({
        message: '채널 정보를 찾을 수 없습니다.'
      });
    } else {
      const oldChannelTitle = findChannel.channelTitle;
      const newChannelTitle = req.body.channelTitle;

      const updatedChannel = {
        ...findChannel,
        channelTitle: newChannelTitle
      };
      
      db.set(id, updatedChannel);
      res.status(200).json({
        message: `채널명이 성공적으로 수정되었습니다. 기존 : ${oldChannelTitle} → 수정 : ${newChannelTitle}`
      });
    }
  })
  .delete((req, res) => { // 채널 개별 삭제
    const id = parseInt(req.params.id);
    const findChannel = db.get(id);

    if (!findChannel) {
      res.status(404).json({
        message: '채널 정보를 찾을 수 없습니다.'
      });
    } else {
      const { channelTitle } = findChannel;

      db.delete(id);
      res.status(200).json({
        message: `${channelTitle}이 정상적으로 삭제되었습니다.`
      });
    }
  });

function notFoundChannel(res) {
  res.status(404).json({
    message: '채널 정보를 찾을 수 없습니다.'
  });
}

  module.exports = router;
  