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


//env
console.log(config);


//logging
app.use(logger('combined'));

//error handleing
app.use(function(err, req, res, next) {

    if (err) {
        console.log(err.code);
        console.log(req.params || "no params");
        console.log(req.header || "there is no header property");
        console.log(req.method);
        console.log(req.originUrl);

    }
    next();
});

//security
app.use(helmet());

//setting router
app.use('/api', apiRouter());
app.use('/login', loginRouter());
app.use('/register', registerRouter());
app.use('/registertoken',registerRouter());

app.use(function (req, res, next) {
    res.status(404).send('404 - Not Found!');
});
app.use(function (err, req, res, next) {
    res.status(500).send('500 - Something was error!');
});

app.listen(process.env.PORT || 3000, () => console.log('server is running on port 3000'));