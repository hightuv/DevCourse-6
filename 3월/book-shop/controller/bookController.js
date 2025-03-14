const db = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const getBooks = (req, res) => {
  const { categoryId, new: isNew, limit, page } = req.query;

  let query = 'select *, (select count(*) from likes where book_id = book.id) as likes from book';
  let conditions = [];
  let values = [];

  if (categoryId) {
    conditions.push('category_id = ?');
    values.push(categoryId);
  }

  if (isNew) {
    conditions.push('pub_date between date_sub(now(), interval 1 month) and now()');
  }

  if (conditions.length) {
    query += ` where ${conditions.join(' and ')}`;
  }

  // 페이징 추가
  let limitNum = parseInt(limit) || 3;
  const pageNum = parseInt(page) || 1;
  const offset = limitNum * (pageNum - 1);

  query += ` limit ? offset ?`;
  values.push(limitNum, offset);

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
  const { memberId } = req.body;
  const { id: bookId } = req.params;

  // const query = 'select b.*, c.name as category_name from book b left join category c on b.category_id = c.id where b.id = ?';
  const query = `
                select b.*,
                  c.name as category_name,
                  (select count(*) from likes where book_id = b.id) as likes,
                  (select exists (select * from likes where member_id = ? and book_id = b.id)) as liked
                from book b
                left join category c on b.category_id = c.id
                where b.id = ?;
                `;
  const values = [memberId, bookId];

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