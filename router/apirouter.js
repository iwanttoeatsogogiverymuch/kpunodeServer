const router = require('express').Router();
const fcm = require('firebase-admin');

module.exports = function(pool) {

  router.post('/devicelog', function(req, res) {
    pool.getConnection(function (err,conn) {
      if(err){
        console.log(err.errorcode);
      }
      conn.release();
    });
    res.send('post devicelog');
    conn.release();
  });

  router.get('devicelog',function (req,res) {
    const device = {

    };
  });
  return router;
};
