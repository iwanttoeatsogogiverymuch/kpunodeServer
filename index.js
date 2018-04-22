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

let pool = mysql.createPool({
  host: 'ec2-52-79-75-141.ap-northeast-2.compute.amazonaws.com',
  port: '3306',
  password: 'password',
  user: 'root',
  database: 'test'
});
app.use(function (err,req,res) {
  if(err){

    console.log('unexpected eroor..exit program');
    process.exit(1);
  }
});
app.use(helmet());
app.use('/api', apiRouter(pool));
app.use('/login', loginRouter(pool));
app.use('/register', registerRouter(pool));


app.listen(process.env.PORT || 3000, () => console.log('server is running on port 3000'));
