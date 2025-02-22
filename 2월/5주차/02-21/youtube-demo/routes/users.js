const express = require('express');

// express 모듈 세팅
const router = express.Router();
router.use(express.json());

let db = new Map();

const user1 = {
  userId: 'hightuv1',
  password: '1234',
  username: 'hightuv1'
};

const user2 = {
  userId: 'hightuv2',
  password: '5678',
  username: 'hightuv2'
};

db.set(user1.userId, user1);
db.set(user2.userId, user2); // 기본 테스트용 유저

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
router.post('/login', (req, res) => {
  const { userId, password } = req.body;
  let loginUser;

  db.forEach((user) => {
    // userId 비교
    if (user.userId === userId) {
      loginUser = user;
    }
  });

  if (!loginUser) {
    res.status(404).json({
      message: '존재하지 않는 계정입니다.'
    });
  } else {
    // password 비교
    if (loginUser.password === password) {
      res.status(200).json({
        message : `${loginUser.username}님 로그인 되셨습니다.`
      });
    } else {
      res.status(400).json({
        message : '비밀번호가 틀렸습니다.'
      });
    }
  }
});

// 회원가입
router.post('/join', (req, res) => {
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

    db.set(userId, newUser);
    res.status(201).json({
      message: `${username}님 환영합니다.`
    });
  }
});

// 회원 개별 조회
router.get('/users', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(404).json({
      message: '로그인이 필요한 페이지입니다.'
    })
  }

  const findUser = db.get(userId);

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
router.delete('/users', (req, res) => {
  const { userId } = req.body;
  const findUser = db.get(userId);

  if (!findUser) {
    res.status(404).json({
      message: '회원 정보가 없습니다.'
    });
  } else {
    const { username } = findUser;
    db.delete(userId);
    res.json({
      message: `${username}님 다음에 또 뵙겠습니다.`
    });
  }
});

module.exports = router;
