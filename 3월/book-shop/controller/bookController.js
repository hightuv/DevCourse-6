const db = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const getBooks = (req, res) => {
  const { categoryId } = req.query;

  let query = 'select * from book';
  let values = [];

  if (categoryId) {
    query = 'select * from book where category_id = ?';
    values = [categoryId];
  }

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }

    if (!results.length) {
      return res.status(StatusCodes.NOT_FOUND).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

const getBook = (req, res) => {
  const { id: bookId } = req.params;

  const query = 'select * from book where id = ?';
  const values = [bookId];

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }

    const book = results[0];

    if (!book) {
      return res.status(StatusCodes.NOT_FOUND).end();
    }

    return res.status(StatusCodes.OK).json(book);
  });

};

// const getBooksByCategory = (req, res) => {
//   const { categoryId } = req.query;

//   const query = 'select * from book where category_id = ?';
//   const values = [categoryId];

//   db.query(query, values, (err, results) => {
//     if (err) {
//       console.log(err);
//       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
//     }

//     if (!results.length) {
//       return res.status(StatusCodes.NOT_FOUND).end();
//     }

//     return res.status(StatusCodes.OK).json(results);
//   });
// };

module.exports = {
  getBooks,
  getBook,
  // getBooksByCategory
};