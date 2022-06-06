var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
var logger = require('morgan');
const cors = require('cors');
// router
var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');

var app = express();
require('./connections');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

process.on('uncaughtException', (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！');
  console.error(err.name);
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
});

// 未捕捉到的 catch
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
});

app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);

app.use(function (req, res, next) {
  res.status(404).send({
    message: '無路由',
  });
});

const errorProd = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const errorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

app.use(function (err, req, res, next) {
  //dev
  console.log(process.env.NODE_ENV);
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    return errorDev(err, res);
  }
  //prod
  if (err.name === 'ValidatorError') {
    err.message = '資料未填寫正確';
    err.isOperational = true;
    return errorProd(err, res);
  }
  errorProd(err, res);
});

module.exports = app;
