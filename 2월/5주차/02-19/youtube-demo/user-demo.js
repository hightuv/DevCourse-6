const express = require('express');
const app = express();
const port = 3000;
app.listen(port);
app.use(express.json());

let db = new Map();
let id = 1;

// 로그인
app.post('/login', (req, res) => {
  const { userId, password } = req.body;

});

// 회원가입
app.post('/join', (req, res) => {
  const { userId, password, username } = req.body;

  if (!userId || !password || !username) {
    res.status(400).json({
      message: '입력 값을 다시 확인해주세요'
    });
  } else {
    const newUser = {
      userId,
      password,
      username
    };

    db.set(id++, newUser);
    res.status(201).json({
      message: `${username}님 환영합니다.`
    });
  }
});

// 회원 개별 조회
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const findUser = db.get(id);

  if (!findUser) {
    res.status(404).json({
      message: '회원 정보가 없습니다.'
    });
  } else {
    const { userId, username } = findUser;
    res.json({
      userId,
      username
    });
  }
});

// 회원 개별 탈퇴
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const findUser = db.get(id);

  if (!findUser) {
    res.status(404).json({
      message: '회원 정보가 없습니다.'
    });
  } else {
    const { username } = findUser;
    db.delete(id);
    res.json({
      message: `${username}님 다음에 또 뵙겠습니다.`
    });
  }
});
