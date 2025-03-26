const db = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const ensureAuthorization = require('../auth');
const jwt = require('jsonwebtoken');

/** 장바구니 담기 */
const addToCart = (req, res) => {
  const authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      'message': '로그인 세션이 만료되었습니다. 다시 로그인 하세요.'
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      'message': '잘못된 토큰입니다.'
    });
  }
  
  const { id: memberId } = authorization;
  const { bookId, quantity } = req.body;

  const query = 'insert into cartItem (book_id, quantity, member_id) values (?, ?, ?)';
  const values = [bookId, quantity, memberId];

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }

    if (!results.affectedRows) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

/** 장바구니 아이템 목록 조회 */
const getCartItems = (req, res) => {
  const authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      'message': '로그인 세션이 만료되었습니다. 다시 로그인 하세요.'
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      'message': '잘못된 토큰입니다.'
    });
  }
  
  const { id: memberId } = authorization;
  const { selected } = req.body;

  let query = `
                select c.id, c.book_id, b.title, b.summary, c.quantity, b.price
                from cartItem c
                left join book b
                on c.book_id = b.id
                where c.member_id = ?
              `;
  let values = [memberId];

  if (selected) {
    query += ` and c.id in (?)`;
    values.push(selected);
  }

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }

    if (!results.length) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

/** 장바구니 아이템 삭제 */
const removeCartItem = (req, res) => {
  const { id: cartItemId } = req.params;

  const query = 'delete from cartItem where id = ?';
  const values = [cartItemId];

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }

    if (!results.affectedRows) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  addToCart,
  getCartItems,
  removeCartItem,
};