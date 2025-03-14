const express = require('express');
const router = express.Router();
router.use(express.json());

const {
  addLike,
  removeLike
} = require('../controller/likeController');

router.post('/:id', addLike); // 좋아요 추가
router.delete('/:id', removeLike); // 좋아요 취소

module.exports = router;