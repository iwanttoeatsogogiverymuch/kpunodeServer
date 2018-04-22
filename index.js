'use strict'
//created by limsookyung
//2017-04-18 update
const express = require('express');
const app = express();
const helmet = require('helmet');
const mysql = require('mysql');

//router
const loginRouter = require('./router/loginrouter');
const apiRouter = require('./router/apirouter');
const registerRouter = require('./router/registerrouter');
//db초기화 작업
let pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  password: process.env.DB_PASSWROD,
  user:     process.env.DB_USER,
  database: process.env.DB_DATABASE
});

//에러처리

//보안
app.use(helmet());

//라우팅 설정
app.use('/api', apiRouter(pool));
app.use('/login', loginRouter(pool));
app.use('/register', registerRouter(pool));


app.listen(process.env.PORT || 3000, () => console.log('server is running on port 3000'));
