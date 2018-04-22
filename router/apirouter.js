const router = require('express').Router();
const fcm = require('../db/fcmhelper.js');

module.exports = function(pool) {
  router.post('/devicelog', function(req, res) {
    pool.getConnection(function(err, conn) {
      if (err) {
        console.log("getConnection error");
        console.log(err.errorcode);
        process.exit(1);
      }
      else {
        conn.query('SELECT * FROM devicelog WHERE id=?', req.params.deviceid, function(err, result, field) {
          if (err) {
            console.log("query error");
            console.log(err);
            conn.release();
            process.exit(1);
          }
          //get the device information from android
          else {
            //
            if (result.length = 0) {
              res.send(JSON.parse());
              return;
            }
            else{
              console.log('hi');
            }

          }
        });
        conn.release();
      }

    });
    res.send('post devicelog');
    conn.release();
  });


  router.get('/devicelog/:id', function(req, res) {
    console.log("sefsefse");
    const params = req.params;
    if(!params[id]){
      console.log("no paramter pass");
      res.send("wrong parameter");
    }
    else {
      pool.getConnection(function(err, conn) {
        console.log('dd');
        if (err) {
          console.log(err.errorcode);
          process.exit(1);
        } else {
          conn.query('SELECT * FROM device_log WHERE id=?', req.params.id, function(err, result, field) {
            if (err) {
              console.log(err);
              conn.release();
              process.exit(1);
            }
            //get the device information from android
            else {
              //
              if (result.length = 0) {

                res.send(JSON.parse());
              }
              let information;

              //
              //
            }
          });
          conn.release();
        }

      });
      res.send('get devicelog');
      conn.release();
    }

  });

  return router;
};
