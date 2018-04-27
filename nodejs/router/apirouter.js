const router = require('express').Router();
const fcm = require('../db/fcmhelper.js');
const poolhelper = require('../db/pool.js');

//apiRouter
//accept and post device apiRouter

module.exports = function()
{

    
    let PoolClass = new poolhelper('test');
    PoolClass.setPoolEvent();
    let pool = PoolClass.getInstance();


    function logError(err)
    {
        console.log(err.code);
        console.log(err.fatal);
    }
    //error function
    function QueryErrorHandler(err)
    {
        logError(err);
        throw new Error("QueryError");

    }

    function ConnectionErrorHandler(err)
    {
        logError(err);
        throw new Error("connection error");

    }
    /////////////////////////////////////////////////////////////////////
    const APIROUTER = {
        GET: 'GET /api/devicelog/:id',
        POST: 'POST /api/devicelog'
    };

    router.param('id', function(req, res, next, id)
    {
        if (id == 1)
        {
            console.log('admin...');
        }
        next();
    });
    //post router
    router.post('/devicelog', function(req, res)
    {

        console.log(typeof req.query.id);
        console.log(typeof req.query.sensor);

        const params = {
            sensor:  parseInt(req.query.sensor)
        };
        const query = "INSERT INTO device_log SET ?";


        pool.getConnection(function(err, conn)
        {
            if (err)
            {
                console.log("getConnection error");
                console.log(err.code);
                console.log(err.fatal);
                process.exit(1);
            }
            else
            {

                conn.query(query, params, function(err, result, field)
                {
                    conn.release();
                    if (err)
                    {
                        console.log("query error");
                        console.log(err.code);
                        console.log(err.fatal);

                        pool.end(function(err){
                            console.log("poll ended...");
                            process.exit(1);
                        });

                    }
                    //get the device information from android
                    else
                    {
                        //
                        if (result.length === 0)
                        {
                            const msg = {
                                errcode:"req.params.id",
                                msg:req.params.id
                            };
                            res.json(msg);
                           
                        }
                        else
                        {
                            res.json(result);
                            console.log("no error in api router post");
                           
                        }

                    }
                });
            }
        });

    });

    /////////////////////////////////////////////////////////////////////
    //get router
    router.get('/devicelog/:id', function(req, res)
    {
        console.log("/devicelog/:id->");
        if (!(req.params.id))
        {
            console.log("   no paramter pass");
            res.send("wrong parameter");
        }
        else
        {
            //if no error
            pool.getConnection(function(err, conn)
            {
                console.log('apiRouter:   ' + 'get:   ' + 'pool getConnection');
                if (err)
                {
                    console.log("getConnerrror");
                    console.log(err);
                    process.exit(1);
                }
                else
                {
                    conn.query('SELECT * FROM device_log WHERE id=?', req.params.id, function(err, result, field)
                    {
                        conn.release();
                        if (err)
                        {
                            console.log(err);
                            console.log("query error");
                            res.send("errrrr");
                            process.exit(1);
                        }
                        //get the device information from android
                        else
                        {
                            if (result.length === 0)
                            {
                                res.send("no query result");
                            }
                            else
                            {
                                res.send(JSON.stringify(result));
                            }
                            //
                        }
                    });

                }
            });

        }
    });
    return router;
};