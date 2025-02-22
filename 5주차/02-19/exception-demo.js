const express = require('express');
const app = express();
app.listen(3000);

const fruits = [
  { 
    id: 1,
    name: 'apple'
  },
  { 
    id: 2,
    name: 'orange'
  },
  { 
    id: 3,
    name: 'strawberry'
  },
  { 
    id: 4,
    name: 'blueberry'
  }
];

// 과일 전체 조회
app.get('/fruits', (req, res) => {
  res.json(fruits);
});

// 과일 개별 조회
app.get('/fruits/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const findFruit = fruits.find(fruit => fruit.id === id);

  if (!findFruit) {
    res.status(404).json({ // Not Found
      message: `${id}에 해당되는 과일이 없습니다.`
    });
  } else {
    res.json(findFruit);
  }
});
