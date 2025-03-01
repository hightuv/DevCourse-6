const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;
app.listen(port);
app.use(express.json());

// user-demo
const userRouter = require('./routes/members');
app.use('/', userRouter);

// channel-demo
const channelRouter = require('./routes/channels');
app.use('/channels', channelRouter);
