const db = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const ensureAuthorization = require('../auth');
const jwt = require('jsonwebtoken');

const getBooks = (req, res) => {
  const response = {};

  const { category_id: categoryId, news: isNew, currentPage: page, limit } = req.query;

  let query = 'select sql_calc_found_rows *, (select count(*) from likes where book_id = book.id) as likes from book';
  let conditions = [];
  let values = [];

  if (categoryId) {
    conditions.push('category_id = ?');
    values.push(categoryId);
  }

  if (isNew === 'true') {
    conditions.push('pub_date between date_sub(now(), interval 2 month) and now()');
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

    response.books = results;

    db.query('select found_rows()', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
  
      response.pagination = {
        currentPage: pageNum,
        totalCount: results[0]['found_rows()']
      };
  
      return res.status(StatusCodes.OK).json(response);
    });
  });  
};

const getBook = (req, res) => {
  const authorization = ensureAuthorization(req, res);
  
  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      'message': '로그인 세션이 만료되었습니다. 다시 로그인 하세요.'
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      'message': '잘못된 토큰입니다.'
    });
  } else {
    const { id: memberId } = authorization;
    const { id: bookId } = req.params;

    let query = `
                  select b.*, b.pub_date as pubDate,
                    c.name as categoryName,
                    (select count(*) from likes where book_id = b.id) as likes
                `;

    const values = [bookId];

    if (!(authorization instanceof ReferenceError)) {
      query += `
                , 
                (select exists (select * from likes where member_id = ? and book_id = b.id)) as liked
              `;
      values.unshift(memberId);
    }

    query += `
              from book b
              left join category c on b.category_id = c.id
              where b.id = ?;
            `;

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
  }
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