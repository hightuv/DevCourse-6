const express = require('express');
const router = express.Router();

router.use(express.json());

// 주문하기
router.post('/orders', (req, res) => {
  res.json('주문하기');
});

// 주문 목록 조회
router.get('/orders', (req, res) => {
  res.json('주문 목록 조회');
});

// 주문 상세 조회
router.post('/orders/:id', (req, res) => {
  const { id } = req.params;
  res.json('주문 상세 조회');
});

module.exports = router;