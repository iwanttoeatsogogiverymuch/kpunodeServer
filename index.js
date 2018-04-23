'use strict'
//created by limsookyung
//2017-04-18 update
const express = require('express');
const app = express();
const helmet = require('helmet');
const mysql = require('mysql');
const logger = require('morgan');

//router
const config = require('dotenv').config();
const loginRouter = require('./router/loginrouter');
const apiRouter = require('./router/apirouter');
const registerRouter = require('./router/registerrouter');
console.log(config);


//logging
app.use(logger());

//error handleing
//app.use();

//security
app.use(helmet());

//setting router
app.use('/api', apiRouter());
app.use('/login', loginRouter());
app.use('/register', registerRouter());


app.listen(process.env.PORT || 3000, () => console.log('server is running on port 3000'));