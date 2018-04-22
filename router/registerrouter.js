
const router = require('express').Router();
const fcm = require('firebase-admin');

module.exports = function (){

  router.get('/test', function(req, res) {
    const queryString = 'SELECT * FROM user';
    pool.getConnection(function (err,connection) {
      if(err){
        console.log(err);
        console.log('nnnnnnnnnoooooooooooooooooooooo');
        process.exit(1);
        res.send('error');
      }
      connection.query(queryString,function (error, results, fields) {
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

  router.get('/', function (req,res){

    res.send('hello');

  });

  return router;
};
