const express = require('express');
const app = express();
app.listen(3000);

app.get('/', function(req, res) {
  res.send('Hello World!');
});

// localhost:3000/1 -> Notebook
// localhost:3000/2 -> Cup
// localhost:3000/3 -> Chair

let db = new Map();

db.set(1, 'Notebook');
db.set(2, 'Cup');
db.set(3, 'Chair');

// console.log(db);
// console.log(db.get(1));
// console.log(db.get(2));
// console.log(db.get(3));

app.get('/:productId', function(req, res) {
  const productId = parseInt(req.params.productId);
  const product = db.get(productId);

  console.log(product);

  if (!product) {
    res.json({
      message : '없는 상품입니다.'
    });
  } else {
    res.json({
      id : productId,
      productName : product
    });
  };
  
});
