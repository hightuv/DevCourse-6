const express = require('express');
const app = express();
app.listen(3000);

let youtuber1 = {
  channelTitle : '십오야',
  sub : '593만명',
  videoNum : '993개'
}

let youtuber2 = {
  channelTitle : '침착맨',
  sub : '227만명',
  videoNum : '6.6천개'
}

let youtuber3 = {
  channelTitle : '테오',
  sub : '54.8만명',
  videoNum : '726개'
}

const db = new Map();
let id = 1;

db.set(id++, youtuber1);
db.set(id++, youtuber2);
db.set(id++, youtuber3);

app.get('/youtubers', (req, res) => {
  res.json({
    message : 'test'
  });
});

app.get('/youtubers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const youtuber = db.get(id);

  if (!youtuber) {
    res.json({
      message : '유튜버 정보를 찾을 수 없습니다.'
    });
  } else {
    res.json(youtuber);
  }
});

app.use(express.json());

app.post('/youtubers', (req, res) => {
    const { channelTitle } = req.body;
    const youtuber = {
      channelTitle,
      sub : '0명',
      videoNum : '0개'
    }

    db.set(id++, youtuber);

    res.json({
      message : `${channelTitle}님, 환영합니다!`
    });
});
