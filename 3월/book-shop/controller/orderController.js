const { getConnection, releaseConnection } = require('../mariadb2');
const { StatusCodes } = require('http-status-codes');

const ensureAuthorization = require('../auth');
const jwt = require('jsonwebtoken');

/** 주문하기 */
const order = async (req, res) => {
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
  const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;

  let conn;
  let query;
  let values;
  let result;

  try {
    conn = await getConnection();
    await conn.beginTransaction();

    // delivery INSERT
    query = 'insert into delivery (address, receiver, contact) values (?, ?, ?)';
    values = [delivery.address, delivery.receiver, delivery.contact];
    
    [result] = await conn.query(query, values);
    let deliveryId = result.insertId;
    
    // orders INSERT
    query = 'insert into orders (book_title, total_quantity, total_price, member_id, delivery_id) values (?, ?, ?, ?, ?)';
    values = [firstBookTitle, totalQuantity, totalPrice, memberId, deliveryId];

    [result] = await conn.query(query, values);
    let orderId = result.insertId;

    // Get bookId, quantity from cartItem (items that will be actually ordered)
    query = 'select book_id, quantity FROM cartItem where id in (?)';
    values = items;

    let [orderItems] = await conn.query(query, [values]);

    // orderedBook INSERT
    query = 'insert into orderedBook (order_id, book_id, quantity) values ?';
    values = [];
    orderItems.forEach((item) => {
      values.push([orderId, item.book_id, item.quantity]);
    });

    [result] = await conn.query(query, [values]);

    // cartItem DELETE
    query = 'delete from cartItem where id in (?)';
    values = items;

    [result] = await conn.query(query, [values]);

    await conn.commit();
    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    if (conn) await conn.rollback();
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  } finally {
    if (conn) releaseConnection(conn);
  }
};

/** 주문 목록 조회 */
const getOrders = async (req, res) => {
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

  let conn;
  let query;
  let result;

  try {
    conn = await getConnection();
    await conn.beginTransaction();

    query = `
              select o.id, o.created_at as createdAt, d.address, d.receiver, d.contact, o.book_title as bookTitle, o.total_quantity as totalQuantity, o.total_price as totalPrice 
              from orders o left join delivery d
              on o.delivery_id = d.id;
            `;

    [result] = await conn.query(query);

    await conn.commit();
    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    if (conn) await conn.rollback();
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  } finally {
    if (conn) releaseConnection(conn);
  }
};

const getOrderDetail = async (req, res) => {
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
  const { id: orderId } = req.params;

  let conn;
  let query;
  let result;

  try {
    conn = await getConnection();
    await conn.beginTransaction();

    query = `
              select o.book_id as bookId, b.title, b.author, b.price, o.quantity
              from orderedBook o left join book b
              on o.book_id = b.id
              where o.order_id = ?;
            `;
    values = [orderId];

    [result] = await conn.query(query, values);

    await conn.commit();
    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    if (conn) await conn.rollback();
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  } finally {
    if (conn) releaseConnection(conn);
  }
};

module.exports = {
  order,
  getOrders,
  getOrderDetail
};