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
   
////////////////////////////////////////////////////////////

    //post router
    router.post('/', function(req, res)
    {

        // console.log(typeof req.query.id);
        // console.log(typeof req.query.sensor);

        const params = {
            device_uid:parseInt(req.query.device_id),
            humidity:  parseFloat(req.query.humidity)
        };
        const queryString = "INSERT INTO humidity SET ?";


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
                conn.beginTransaction(function(err){
                    if(err){
                        console.log("transaction error");
                        res.json({msg:"transaction error"});
                    }
                    else{
                        conn.query(queryString, params, function(err, result, field)
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
                            //post the humidity information
                           else{
                                //
                                if (result.length === 0)
                                {
                                    const msg = {
                                        msg:"lentgh is zero"
                                    };
                                    res.json(msg);
                                   
                                }
                                else
                                {
                                    res.json({msg:"scuessfully inserted"});
                                    console.log("no error in humidityrouter post");
                                   
                                }
        
                            }
                        });
                    }
                });


            }
        });

    });

    /////////////////////////////////////////////////////////////////////
    //get router
    router.get('/:device_uid', function(req, res)
    {
        console.log("humidity /:id->");
        if (!(req.params.device_uid))
        {
            console.log("no paramter pass");
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
                    pool.end(function(err){
                        process.exit(1);
                    });

                }
                else
                {
                    const queryString = 'SELECT * FROM humidity WHERE device_uid=?';
                    conn.query(queryString, req.params.device_uid, function(err, result, field)
                    {
                        conn.release();
                        if (err)
                        {
                            console.log(err);
                            console.log("query error");
                            res.json({msg:"query error"});
                        }
                        //get the device information from android
                        else
                        {
                            if (result.length === 0)
                            {
                                res.status(200).json({msg:"no results"});
                            }
                            else
                            {
                                res.status(200).json(result);
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