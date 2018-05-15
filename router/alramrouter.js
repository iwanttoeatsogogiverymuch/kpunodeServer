const router = require('express').Router();
const fcm = require('../db/fcmhelper.js');
const Pool = require('../db/pool.js');

module.exports = function(){

    //
    let PoolClass = new Pool('test');
    PoolClass.setPoolEvent();
    let pool = PoolClass.getInstance();

    //query strings
    let QueryString = "SELECT remote FROM alram WHERE id=?";
    let QueryString2 = "UPDATE alram SET remote=? WHERE id=?";
    let QueryString3 = "UPDATE alram SET remote=0 WHERE id=?";

    //arduino get
    router.get('/:id',function(req,res){

        pool.getConnection(function(err,con){

            if(err){
                console.log(err);
                //client
                res
                    .status(503)
                    .json(
                        {   
                            msg:"alram get connetion error"
                        });
                //server
                pool.end(function(err){
                    console.log('pool ended..program will exit');
                    process.exit(1);
                  });
            }
            else{
                con.beginTransaction(function(err){
                    if(err){
                        console.log("transaction error");
                        res.status(503).json({msg:"transaction error"});
                        con.release();
                    }
                    else{

                        con.query(QueryString,req.params.id,function(err,results,fields){
                            
                            if(err){
                                console.log(err);
                                res
                                    .status(503)
                                    .json({msg:"query error"});
                            }
                            else{
                                if (results.length === 0){
                                    console.log("results is empty");
                                    res
                                        .status(200)
                                        .json({msg:"no results"});
                                }
                                else if(results.length > 0){
                            
                                    if(results[0].remote === 0){
                                        console.log("no action");
                                        res
                                            .status(200)
                                            .json({msg:"0"});
                                    }
                                    else{
                                        con.query(QueryString3,req.params.id,function(err,result2){

                                            if(err){
                                                console.log("transaction 2 query error");
                                                res.status(503).json({msg:"transaction 2 query error"});
                                            }
                                            else{
                                                if(result2.changedRows === 1){
                                                    console.log("success");
                                                    res.status(200).json({msg:"1"});
                                                }
                                                else{
                                                    res.status(500).json({msg:"wrong"});
                                                }

                                            }

                                        });

                                    }
        
                                }
                            }

                            con.release();
                        });

                    }
                });
               
            }
        });

    });


    //android will ues this
    //when user controlling
    router.post('/',function(req,res){

        pool.getConnection(function(err,con){

            if(err){
                console.log(err);
                //client
                res
                    .status(503)
                    .json(
                        {   
                            msg:"alram get connetion error"
                        });
                //server
                pool.end(function(err){
                    console.log('pool ended..program will exit');
                    process.exit(1);
                  });
            }


            //query goes here
            else{
                con.query(QueryString2,[parseInt(req.query.remote), parseInt(req.query.id)],function(err,results,fields){
                    con.release();
                    if(err){
                        console.log(err);
                        res
                            .status(503)
                            .json({msg:"error in query"});
                    }
                    else{
                        if (results.length === 0){
                            console.log("results is empty");
                            res
                                .status(200)
                                .json({msg:"no results"});
                        }
                       
                        else if(results.affectedRows === 1){
                           
                            console.log(results);
                            res.status(200).json({msg:"changed"});
    
                        }
                        else{
                            console.log("???????????????");
                            res.status(200).json({msg:"errrrrrrrrrrrrrrrror"});
                        }
                    }
                });
            }
        });

    });

        
    return router;
};