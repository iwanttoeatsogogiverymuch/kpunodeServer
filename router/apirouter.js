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

    //post 
    router.post('/devicelog', function(req, res)
    {

        const params = {

            device_uid:parseInt(req.query.device_id),
            sensor:  parseInt(req.query.sensor)
        };
        const query = "INSERT INTO device_log SET ?";
        const query2 = "SELECT fcmtoken FROM user WHERE device_uid=? ";

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
                    if(err) {console.log("transaction error");}

                    //begin here
                    //
                    else{
                        //first query of inserting devicelog

                        conn.query(query, params, function(err, result, field)
                        {
                            //error
                            if (err)
                            {
                                console.log("query error");
                                console.log(err.code);
                                console.log(err.fatal);
                                res.json({msg:"query error"});
        
                                conn.release();
                                pool.end(function(err){
                                    console.log("poll ended...");
                                    process.exit(1);
                                });
        
                            }


                            //get the device information
                            else {
                                //
                                if (result.length === 0)
                                {
                                    const msg = {
                                        errcode:"req.params.id",
                                        msg:req.params.id
                                    };
                                    res.json(msg);
                                   conn.release();
                                }
                                else
                                {
                                    conn.query(query2,req.query.device_id,function(err,result2){
                                            conn.release();
                                        if(err){
                                            console.log("query 2 error in transaction");
                                        }
                                        else{

                                            const fcmtoken = result2[0].fcmtoken;
                                            fcm.setInstance();
                                            fcm.sendToDevice(fcmtoken);
                                        }

                                    });
                                    res.json(result);
                                    console.log("no error in api router post");
                                   
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
    router.get('/devicelog/:id', function(req, res)
    {
        console.log("/devicelog/:id->");
        if (!(req.params.id))
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
                    process.exit(1);
                }
                else
                {
                    const query = "SELECT DATE_FORMAT(entrance_time,\'%m/%d\')" +
                     "AS date,SUM(sensor) AS sum_day " +
                     "FROM device_log " +
                     "WHERE device_uid=? " + 
                     "AND DATE_SUB(CURDATE(),INTERVAL 6 DAY) < entrance_time " +
                     "GROUP BY DATE(entrance_time) ORDER BY DATE(entrance_time)";
                    conn.query(query, req.params.id, function(err, result, field)
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

    router.get('/devicelog_day/:id', function(req, res)
    {
        console.log("/devicelog/:id->");
        if (!(req.params.id))
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
                    process.exit(1);
                }
                else
                {
                    const query = "SELECT * FROM device_log WHERE device_uid=?";
                    conn.query(query, req.params.id, function(err, result, field)
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
