const express = require('express');
const app = express();
const port = 3000;
app.listen(port);
app.use(express.json());

let db = new Map();
let id = 1;

const user1 = {
  userId: 'hightuv',
  password: 'pwd',
  username: 'hightuv'
};

db.set(id++, user1); // 기본 테스트용 유저

// 회원 API
/* // 강의에서 소개한 방식의 로그인
app.post('/login', (req, res) => {
  const { userId, password } = req.body;
  let hasUserId = false;
  let loginUser = {};

  db.forEach((user) => {
    if (user.userId === userId) {
      hasUserId = true;
      loginUser = user;
    }
  });

  if (!isEmpty(loginUser)) {
    if (loginUser.password === password) {
      res.json({
        message: `${loginUser.username}님 환영합니다.`
      });
    } else {
      res.json({
        message: '비밀번호가 틀렸습니다.'
      });
    }
  }
});

function isEmpty(obj) {
  if (Object.keys(obj).length === 0) {
    return true;
  } else {
    return false;
  }
} */

// 로그인
app.post('/login', (req, res) => {
  const { userId, password } = req.body;
  let message = '존재하지 않는 계정입니다.';

  db.forEach((user) => {
    // userId 비교
    if (user.userId === userId) {
      // password 비교
      if (user.password === password) {
        message = `${user.username}님 환영합니다.`;
      } else {
        message = `비밀번호가 틀렸습니다.`;
      }
    }
  });

  res.json({
    message
  });
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
