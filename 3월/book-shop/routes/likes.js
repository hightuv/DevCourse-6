const express = require('express');
const router = express.Router();

router.use(express.json());

// 좋아요 추가
router.post('/likes/:id', (req, res) => {
  const { id } = req.params;
  res.json('좋아요 추가');
});

// 좋아요 취소
router.delete('/likes/:id', (req, res) => {
  const { id } = req.params;
  res.json('좋아요 취소');
});

module.exports = router;