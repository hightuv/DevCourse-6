const express = require('express');
const app = express();
const port = 3000;
app.listen(port);
app.use(express.json());

// user-demo
const userRouter = require('./routes/users');
app.use('/', userRouter);

// channel-demo
const channelRouter = require('./routes/channels');
app.use('/channels', channelRouter);
