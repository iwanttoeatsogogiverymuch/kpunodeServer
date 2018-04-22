const router = require('express').Router();
const fcm = require('firebase-admin');
const key = require('../key/fcm-push-example-43e46-firebase-adminsdk-0mi12-e8ce2d5672.json');

module.exports = function() {

  router.get('/test', function(req, res) {
    const params = {
      password:req.params.password,
      id:req.params.id,
    };

    const queryString1 = 'SELECT  FROM user WHERE id=?';
    const queryString2 = '';

    pool.getConnection(function (err,connection) {
      if(err){
        console.log(err);
        res.send('error');
        process.exit(1);
      }
      connection.query(queryString,params.id,function (error, results, fields) {
        if(error){
          console.log(error);
          connection.release();
          res.statusCode(503).send('error');
          process.exit(1);
        }

          res.send(results);
          console.log(results);
          connection.release();
      });
    });


  });

  router.get('/', function(req, res) {
    res.send('hello');

  });

  return router;
};
