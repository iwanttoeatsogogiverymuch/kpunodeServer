const router = require('express').Router();
const fcm = require('../db/fcmhelper.js');

//apiRouter
//accept and post device apiRouter
module.exports = function() {

    const TAG = "nodejs/router/alaramrouter";
    const APIROUTER = {
        GET: 'GET /api/devicelog/:id',
        POST: 'POST /api/devicelog'
    };

    router.param('id', function(req, res, next, id) {
        if (id == 1) {
            console.log('admin...');
        }
        next();
    });
    router.param('id', function(req, res, next, id) {
        if (id == 1) {
            console.log('admin...');
        }
        next();
    });

    //post router
    router.post('/devicelog', function(req, res) {
        pool.getConnection(function(err, conn) {
            if (err) {
                console.log("getConnection error");
                console.log(err.code);
                console.log(err.fatal);
                pool.end(function() {

                });
                process.exit(1);

            } else {
                conn.query('SELECT * FROM devicelog WHERE id=?', '1', function(err, result, field) {
                    if (err) {
                        console.log("query error");
                        console.log(err.code);
                        console.log(err.fatal);
                        conn.release();
                        process.exit(1);
                    }
                    //get the device information from android
                    else {
                        //
                        if (result.length == 0) {
                            res.send(JSON.parse());
                            return;
                        } else {
                            console.log("no error in api router post");
                        }

                    }
                });
                conn.release();
            }

        });
        res.send('post devicelog');
        conn.release();
    });


    //get router
    router.get('/devicelog/:id', function(req, res) {

        console.log("/devicelog/:id->");
        if (!(req.params.id)) {
            console.log("   no paramter pass");
            res.send("wrong parameter");
        } else {
            pool.getConnection(function(err, conn) {
                console.log('apiRouter:' + 'get:' + 'pool getConnection');
                if (err) {
                    console.log("getConnerrror");
                    console.log(err);
                    process.exit(1);
                } else {
                    const query = 'SELECT * FROM device_log WHERE id=?';
                    conn.query(query, req.params.id, function(err, result, field) {
                        if (err) {
                            res.statusCode(500).send(JSON.parse());
                            console.log(err);
                            console.log("query error");
                            conn.release();
                            process.exit(1);
                        }
                        //get the device information from android
                        else {
                            //
                            if (result.length = 0) {

                                res.send(JSON.parse("no query results"));
                            } else {
                                console.log("nothing");
                            }
                            //
                            //
                        }
                    });
                    conn.release();
                }

            });
            res.send('get devicelog...');
        }

    });

    return router;
};