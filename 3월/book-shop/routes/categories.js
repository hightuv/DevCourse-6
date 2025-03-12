const express = require('express');
const router = express.Router();
router.use(express.json());

const {
  getCategories
} = require('../controller/categoryController');

router.get('/', getCategories); // 카테고리 전체 조회

module.exports = router;
