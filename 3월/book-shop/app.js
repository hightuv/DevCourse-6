const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const port = process.env.PORT;

app.use(express.json());

const cors = require('cors');
app.use(cors({
  origin: true,
  credentials: true
}));

const bookRouter = require('./routes/books');
const cartRouter = require('./routes/carts');
const likeRouter = require('./routes/likes');
const memberRouter = require('./routes/members');
const orderRouter = require('./routes/orders');
const categoryRouter = require('./routes/categories');

app.use('/books', bookRouter);
app.use('/carts', cartRouter);
app.use('/likes', likeRouter);
app.use('/members', memberRouter);
app.use('/orders', orderRouter);
app.use('/categories', categoryRouter);

app.listen(port, () => {
  console.log(`http://localhost:${port} 에서 서버 실행 중`);
});
