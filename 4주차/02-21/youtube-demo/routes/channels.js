const express = require('express');

// express 모듈 세팅
const router = express.Router();
router.use(express.json());

let db = new Map();
let id = 1;

const channel1 = {
  userId: 'hightuv1',
  channelTitle: 'hightuv1Ch1',
  sub: '0명',
  videoNum: '0개'
};

const channel2 = {
  userId: 'hightuv1',
  channelTitle: 'hightuv1Ch2',
  sub: '0명',
  videoNum: '0개'
};

db.set(id++, channel1);
db.set(id++, channel2); // 기본 테스트용 채널

router
  .route('/')
  .get((req, res) => { // 채널 전체 조회
    const { userId } = req.body;

    if (!userId) { // 로그인 세션 만료 가정
      return res.status(400).json({
        message: '로그인이 필요한 페이지입니다.'
      });
    }

    let channels = [];

    db.forEach((channel) => {
      if (channel.userId === userId) {
        channels.push(channel);
      }
    });

    if (!channels.length) { // userId에 해당하는 회원에게 채널이 없는 경우
      res.status(404).json({
        message: '조회할 채널이 없습니다.'
      });
    } else {
      res.json(channels);
    }
  })
  .post((req, res) => { // 채널 개별 생성
    const { userId } = req.body;
    const { channelTitle } = req.body;

    if (!channelTitle) {
      res.status(400).json({
        message: '요청 값을 제대로 보내주세요'
      });
    } else {
      const newChannel = {
        userId,
        channelTitle,
        sub: 0,
        videoNum: 0,
      };

      db.set(id++, newChannel);
      res.status(201).json({
        message: `${channelTitle} 채널이 생성되었습니다.`
      });
    }
  });

router
  .route('/:id')
  .get((req, res) => { // 채널 개별 조회
    const id = parseInt(req.params.id);
    const findChannel = db.get(id);

    if (!findChannel) {
      res.status(404).json({
        message: '채널 정보를 찾을 수 없습니다.'
      });
    } else {
      res.status(200).json(findChannel);
    }
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

  module.exports = router;
  