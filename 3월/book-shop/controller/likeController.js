const db = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const addLike = (req, res) => {
  const { memberId } = req.body;
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
  const { memberId } = req.body;
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