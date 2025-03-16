const express = require('express');
const router = express.Router();
router.use(express.json());

const {
  addToCart,
  getCartItems,
  removeCartItem
} = require('../controller/cartController');

router.get('/', getCartItems); // 장바구니 아이템 목록 조회
router.post('/', addToCart); // 장바구니 담기
router.delete('/:id', removeCartItem); // 장바구니 도서 삭제

module.exports = router;
