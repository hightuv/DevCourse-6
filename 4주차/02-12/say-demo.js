const express = require('express');
const app = express();

// GET + '/hello', '/bye', '/nicetomeetyou'
app.get('/hello', function (req, res) {
  res.json({
    say : '안녕하세요'
  });
});

app.get('/bye', function (req, res) {
  res.json({
    say : '안녕히 가세요'
  });
});

// 매개변수로 전달받은 콜백 함수를 호출 -> 서버에 세팅
app.get('/nicetomeetyou', function (req, res) {
  res.json({
    say : '만나서 반갑습니다'
  });
});

app.listen(3000);