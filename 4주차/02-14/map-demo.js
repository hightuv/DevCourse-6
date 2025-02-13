const express = require('express');
const app = express();
app.listen(3000);

let db = new Map();

let notebook = {
  productName : 'Notebook',
  price : 20000
};
let cup = {
  productName : 'Cup',
  price : 3000
};
let chair = {
  productName : 'Chair',
  price : 100000
};
let poster = {
  productName : 'Poster',
  price : 20000
};

db.set(1, notebook);
db.set(2, cup);
db.set(3, chair);
db.set(4, poster);

// console.log(db);
// console.log(db.get(1));
// console.log(db.get(2));
// console.log(db.get(3));
// console.log(db.get(4));

app.get('/favicon.ico', function(req, res) {
  res.status(204);
});

app.get('/:productId', function(req, res) {
  const productId = parseInt(req.params.productId);
  const product = db.get(productId);

  // console.log(`URL: ${req.url}, 상품:`, product);
  // console.log(product);
  // res.json(product);

  if (!product) {
    res.json({
      message : '없는 상품입니다.'
    });
  } else {
    // product.id = productId;
    product['id'] = productId;
    res.json(product);
  };
  
});
