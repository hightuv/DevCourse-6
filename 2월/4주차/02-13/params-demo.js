const express = require('express');
const app = express();

app.get('/products/:n', function (req, res) {
  let number = parseInt(req.params.n);

  res.json({
    num : number
  });
});

app.get('/test/1', function (req, res) {
  res.json({
    test : 1
  });
});

/* app.get('/:nickname', function(req, res) {
  const param = req.params;

  res.json({
    channel : param.nickname
  });
}); */

// 영상 타임라인 주소 예시 : https://www.youtube.com/watch?v=2hyEDcBdTkA&t=266s
app.get('/watch', function(req, res) {
  const {v, t} = req.query;
  console.log(v);
  console.log(t);

  res.json({
    video : v,
    timeline : t
  });
});

app.listen(3000);