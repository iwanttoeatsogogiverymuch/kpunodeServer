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
    const querystring3 = "UPDATE user SET fcmtoken=? where id=?";
    pool.getConnection(function (error,connection) {
      if(error){
        let errorcode = error.code;
        console.log(errorcode);
        res
        .status(503)
        .json(JSON.parse({
          errorCode:errorcode,
          msg:"getConnection Error"
        }));
        pool.end(function(err){
          process.exit(1);
        });
      }
      else{
        connection.beginTransaction(function(err){

          let isCorrect = false;

          if(err){
            throw err;
          }
          else{
            console.log("loginnnnn");
            connection.query(queryString1,req.query.id,function (error, results, fields) {
              if(error){
    
                console.log(errorcode);
                let errorcode = error.code;
                res
                .status(503)
                .json({ msg:"query Error" });

                connection.commit(function(err){
                  if(err) throw err;
                });

              }
              else if(results.length === 0){
                res
                .status(503)
                .json({msg:"id incorrect"});


                connection.commit(function(err){
                  if(err) throw err;
                });


              }
              else if(results[0].password == params.password ){
                console.log("password right");

                  connection.query(querystring3,[req.query.fcmtoken,req.query.id],function(error,results2,fields){

                    connection.commit(function(err){
                      if(err) {
                        console.log("error in commit");
                      }
                    });

                      if(error){
                        console.log("error query");
                        res.json({msg:"error query"});
                      }
                      else{
                        console.log("fuuuuuuuuuuuck");
                        res
                        .status(200)
                        .json(results); 
                      }

                  });
              }
              else{
                res
                .status(503)
                .json({msg:"cannot login"});

              }
      
            });


          }

        });
        connection.release();

      }
     
    });
  });
router.post("/register", function(req, res) {
  
    const params = {
      id:req.query.id,
      password:req.query.password,
      fcmtoken:req.query.fcmtoken
    };

    const queryString1 = "INSERT INTO user SET ?";

    pool.getConnection(function (err,connection) {
      if(err){
        console.log(err);
        res
          .status(503)
          .json(
            {
              msg:"getConnection Error"                
          });
        pool.end(function(err){
          process.exit(1);
        });
      }
      else{
        connection.query(queryString1,params,function (error, results, fields) {
          connection.release();

          if(error){
            console.log(error);
            res.status(503).json({msg:"id is already in use"});
          }
          else if(results.length === 0){
            res.status(503).json({msg:"id is already in use..incorrect"});
            //console.log(results[0].password);
          }
          else {
              res.status(200).json(results);
          }

  
        });
      }
     
    });
  });

  return router;
};
