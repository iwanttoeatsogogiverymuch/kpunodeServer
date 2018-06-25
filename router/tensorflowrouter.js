const router = require("express").Router();
const kerasjs = require('keras-js');
const poolhelper = require('../db/pool.js');
const path = require('path');
//const serveStatic = require('serve_static');
const tensorscript = require('./test.js');
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


 /////////////////////////////////////////////////////////////////////
    //get router
    router.get('/getlabel/:id', function(req, res)
    {
        console.log("/getlabel/:id->");
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
                console.log('tensorflowrouter:   ' + 'get:   ' + 'pool getConnection');
                if (err)
                {
                    console.log("getConnerrror");
                    console.log(err);
                    process.exit(1);
                }
                else
                {
                    const query = " SELECT utill.today,FLOOR(HOUR(utill.today)/6) AS time_period, "+
                                    "count(dv.sensor) AS sum_6 "+
                                    "FROM (SELECT * FROM "+
                                    "(SELECT CONCAT(DATE_SUB(CURDATE(),INTERVAL 7 DAY),' 00:00:00') + INTERVAL seq HOUR as today "+
                                    "FROM seq_0_to_999) as d " +
                                    "WHERE DATE_SUB(CURDATE(),INTERVAL 7 DAY) < d.today AND CURDATE() > d.today) as utill "+
                                    "LEFT JOIN device_log as dv ON utill.today=DATE(dv.entrance_time) AND dv.device_uid=? "+
                                    "GROUP BY DATE(utill.today),time_period "+
                                    "ORDER BY utill.today";
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

                                console.log("this is keras model prediction....");
                                const input_array= new Float32Array(28); 
                               // let model = tensorscript;
                               const model = new kerasjs.Model({

                                filepath:'cat_model.bin',
                                filesystem:true
                                });

                                console.log("this is result to inpt layer.");
                                    result.forEach((element,index) => {
                                    input_array[index]=element.sum_6;
                                });
                                console.log(input_array);
                                model.ready().then(() => model.predict(
                                    {input:new Float32Array(input_array)}
                                )).then(({output}) => {
                                    let predictionProbability = -1;
                                    let predictedDigit = null;
                                    Object.entries(output).forEach(([digit, probability]) => {
                                      if (probability > predictionProbability) {
                                        predictionProbability = probability;
                                        predictedDigit = digit;
                                      }
                                    });
                                    res.json({
                                      Predicted : predictedDigit,
                                      probability :predictionProbability.toFixed(3)
                                    }

                                    );   

                                });

                               
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



