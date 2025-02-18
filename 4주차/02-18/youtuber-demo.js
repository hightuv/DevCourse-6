const express = require('express');
const app = express();
app.use(express.json());
app.listen(3000);

let youtuber1 = {
  channelTitle: '십오야',
  sub: '593만명',
  videoNum: '993개'
}

let youtuber2 = {
  channelTitle: '침착맨',
  sub: '227만명',
  videoNum: '6.6천개'
}

let youtuber3 = {
  channelTitle: '테오',
  sub: '54.8만명',
  videoNum: '726개'
}

const db = new Map();
let id = 1;

db.set(id++, youtuber1);
db.set(id++, youtuber2);
db.set(id++, youtuber3);

// 유튜버 전체 조회
app.get('/youtubers', (req, res) => {
  // const youtubers = Array.from(db.values());
  const youtubers = [...db.values()];
  res.json(youtubers);
});

// 유튜버 개별 조회
app.get('/youtubers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const youtuber = db.get(id);

  if (!youtuber) {
    res.json({
      message: '유튜버 정보를 찾을 수 없습니다.'
    });
  } else {
    res.json(youtuber);
  }
});

// 유튜버 등록
app.post('/youtubers', (req, res) => {
    const { channelTitle } = req.body;
    const youtuber = {
      channelTitle,
      sub: '0명',
      videoNum: '0개'
    }

    db.set(id++, youtuber);

    res.json({
      message: `${channelTitle}님, 환영합니다!`
    });
});

// 특정 유튜버 삭제
app.delete('/youtubers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const youtuber = db.get(id);

  if (!youtuber) {
    res.json({
      message: '유튜버 정보를 찾을 수 없습니다.'
    });
  } else {
    const { channelTitle } = youtuber;
    db.delete(id);
    res.json({
      message: `${channelTitle}님, 다음에 또 만나요.`
    });
  }
});

// 전체 유튜버 삭제
app.delete('/youtubers', (req, res) => {
  let message;

  if (!db.size) { // db.size가 0이면 수행됨
    message = '삭제할 유튜버가 없습니다.';
  } else {
    db.clear();
    message =  '전체 유튜버가 삭제되었습니다.';
  }

  res.json({
    message
  });
});

// 유튜버 정보 수정
app.put('/youtubers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const youtuber = db.get(id);
  let message;

  if (!youtuber) {
    message = '유튜버 정보를 찾을 수 없습니다.';
  } else {
    const oldChannelTitle = youtuber.channelTitle;
    const newChannelTitle = req.body.channelTitle;
    const updatedYoutuber = { ...youtuber, channelTitle: newChannelTitle };
    
    // youtuber.channelTitle = newChannelTitle;
    db.set(id, updatedYoutuber);
    message = `${oldChannelTitle}에서 ${newChannelTitle}로 채널명이 변경되었습니다.`;
  }

  res.json({
    message
  });
});
