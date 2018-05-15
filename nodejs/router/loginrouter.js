
const router = require('express').Router();
const fcm = require('firebase-admin');
const key = require('../key/fcm-push-example-43e46-firebase-adminsdk-0mi12-e8ce2d5672.json');
const poolhelper = require("../db/pool.js");

module.exports = function() {

  let PoolClass = new poolhelper('test');
  PoolClass.setPoolEvent();
  let pool = PoolClass.getInstance();

  router.get("/", function(req, res) {
    
    const params = {
      password:req.query.password,
      id:req.query.id,
    };
    const queryString1 = "SELECT * FROM user WHERE id=?";
    pool.getConnection(function (error,connection) {
      if(error){
        let errorcode = error.code;
        console.log(errorcode);
        res
          .status(503)
          .json({
            errorCode:errorcode,
            msg:"getConnection Error"
          });
        pool.end(function(err){
          process.exit(1);
        });
      }
      else{
        connection.query(queryString1,req.query.id,function (error, results, fields) {
          connection.release();
          if(error){

              console.log(errorcode);
              let errorcode = error.code;
              res
                .status(503)
                .json(
                  {
                    errorCode:errorcode,
                    msg:"query Error"
                  }
                );
          }
          else if(results.length === 0){
              res
                .status(200)
                .json({msg:"id incorrect"});
          }
          else if(results[0].password == params.password ){
              res
                .status(200)
                .json({msg:"sucesslogin",logintoken:"nothing"});
          }
          else{
              res
                .status(200)
                .json({msg:"cannot login"});
          }
  
        });
      }
     
    });
  });
router.post("/", function(req, res) {
    const params = {
      password:req.query.password,
      id:req.query.id,
    };

    const queryString1 = "SELECT * FROM user WHERE id=?";

    pool.getConnection(function (err,connection) {
      if(err){
        console.log(err);
        res
          .status(503)
          .json(
            {errorCode:err.code,
              msg:"getConnection Error"                
          });
        pool.end(function(err){
          process.exit(1);
        });
      }
      else{
        connection.query(queryString1,params.id,function (error, results, fields) {
          connection.release();

          if(error){
            console.log(error);
            res.status(503).send('error');
          }
          else if(results.length === 0){
            res.send("id incorrect");
            console.log(results[0].password);
          }
          else if(results[0].password == params.password ){
              res.json({msg:"sucesslogin",logintoken:"nothing"});
          }
          else{
            console.log("nothing");
            res.json({msg:"cannot login"});
          }
  
        });
      }
     
    });
  });

  return router;
};
