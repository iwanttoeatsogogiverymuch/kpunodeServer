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
const fcmregister = require('./router/fcmregister');
const alramrouter = require('./router/alramrouter');
const humidityrouter = require("./router/humidityrouter");
//env
console.log(config);

//logging
app.use(logger('dev'));

//security
app.use(helmet());

//setting router
app.use('/api', apiRouter());
app.use('/login', loginRouter());
app.use('/register', registerRouter());
app.use('/humidity',humidityrouter());
app.use('/alram',alramrouter());

//404 error
app.use(function (req, res, next) {
    res.status(404).send('404 - Not Found!');
    if (err) {

        console.log(err.code   || "no error");
        console.log(req.params || "no params");
        console.log(req.header);
        console.log(req.method);
        console.log(req.originUrl);

    }
    next();
});
//500 error
app.use(function (err, req, res, next) {
    res.status(500).send('500 - Something was error!');
    if (err) {

        console.log(err.code);
        console.log(req.params || "no params");
        console.log(req.header || "there is no header property");
        console.log(req.method);
        console.log(req.originUrl);

    }
    next();
});

app.listen(process.env.PORT || 3000, () => console.log('server is running on port 3000'));