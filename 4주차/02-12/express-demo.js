const express = require('express');
const app = express();

// GET + '/'
app.get('/', function (req, res) {
  res.send('Hello World');
});

let book = {
  title : 'Node.js를 배워보자 (책)',
  price : 20000,
  description : 'Node.js 기본서'
};

app.get('/products/1', function (req, res) {
  res.json(book);
});

app.listen(3000);