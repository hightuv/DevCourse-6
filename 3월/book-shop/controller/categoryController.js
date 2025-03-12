const db = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const getCategories = (req, res) => {
  const query = 'select * from category';

  db.query(query, (err, results) => {
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

module.exports = {
  getCategories
};