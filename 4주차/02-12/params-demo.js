const express = require('express');
const app = express();

app.get('/products/:n', function (req, res) {
  res.json({
    num : req.params.n
  });
});

app.listen(3000);