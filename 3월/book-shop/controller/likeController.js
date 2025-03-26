const db = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const ensureAuthorization = require('../auth');
const jwt = require('jsonwebtoken');

const addLike = (req, res) => {
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
  const { id: bookId } = req.params;

  const query = 'insert into likes (member_id, book_id) values (?, ?)';
  const values = [memberId, bookId];

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

const removeLike = (req, res) => {
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
  const { id: bookId } = req.params;

  const query = 'delete from likes where member_id = ? and book_id = ?';
  const values = [memberId, bookId];

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
  addLike,
  removeLike
};