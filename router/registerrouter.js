
const router = require('express').Router();
const fcm = require('firebase-admin');
const key = require('../key/fcm-push-example-43e46-firebase-adminsdk-0mi12-e8ce2d5672.json');
const poolhelper = require("../db/pool.js");

module.exports = function (){

  let PoolClass = new poolhelper('test');
  PoolClass.setPoolEvent();
  let pool = PoolClass.getInstance();

  router.post("/", function(req, res) {
    const params = {
      password:req.query.password,
      id:req.query.id,
      fcmtoken:req.query.fcmtoken
    };
    console.log(params);

    const queryString1 = "INSERT INTO user SET ?";
    pool.getConnection(function (err,connection) {
      if(err){
        console.log(err);
        res.send('error');
        pool.end(function(err){
          process.exit(1);
        });
      }
      else{
        connection.query(queryString1,params,function (error, results, fields) {
          connection.release();

          if(error){
            console.log(error);
            res.status(503).json(JSON.parse({msg:"query error"}));
          }
          else if(results.length === 0){
            res.json(JSON.parse({msg:"error register"}));
            console.log(results[0].password);
          }
          else if(results[0].affectedRows ){
            res.json(JSON.parse({msg:"success register"}));
          }
          else{
            console.log("nothing");
            res.json(JSON.parse({msg:"nothing"}));
          }
  
        });
      }
     
    });
  });
  return router;
};
