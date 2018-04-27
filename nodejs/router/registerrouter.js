
const router = require('express').Router();
const fcm = require('firebase-admin');
const key = require('../key/fcm-push-example-43e46-firebase-adminsdk-0mi12-e8ce2d5672.json');
const poolhelper = require("../db/pool.js");

module.exports = function (){

  let PoolClass = new poolhelper('test');
  PoolClass.setPoolEvent();
  let pool = PoolClass.getInstance();

  router.get("/", function(req, res) {
    const params = {
      password:req.query.password,
      id:req.query.id,
    };
    console.log(params);

    const queryString1 = "INSERT INTO user SET ?";
    console.log("hiiiiiiiii");
    pool.getConnection(function (err,connection) {
      if(err){
        console.log(err);
        res.send('error');
        pool.end(function(err){
          process.exit(1);
        });
      }
      else{
        console.log("sefsaef");
        connection.query(queryString1,params,function (error, results, fields) {
          connection.release();

          if(error){
            console.log(error);
            res.status(503).send('error');
          }
          //==가 아닌 ===를 써야함 
          else if(results.length === 0){
            res.send("id incorrect");
            console.log(results[0].password);
          }
          //결과가 있으면 메세지를 보낸다
          else if(results.affectedRows ){
              res.json({msg:"sucesslogin",logintoken:"nothing"});
          }
          //나머지 에러처리
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
