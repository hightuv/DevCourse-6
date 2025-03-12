const express = require('express');
const router = express.Router();
router.use(express.json());

const {
  getBooks,
  getBook,
  // getBooksByCategory
} = require('../controller/bookController');

// router.get('/', getBooksByCategory); // 카테고리 별 도서 목록 조회
router.get('/', getBooks); // 전체 도서 목록 조회
router.get('/:id', getBook); // 개별 도서 조회

module.exports = router;