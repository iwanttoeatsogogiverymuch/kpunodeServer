const fcm = require('../db/fcmhelper.js');
const Pool = require('../db/pool');
const router = require('express').Router();

module.exports = function(){
    
    let PoolClass = new Pool();
    PoolClass.setPoolEvent();
    let pool = PoolClass.getInstance();

    router.post('/',function(res,req){

        const tocken = res.query.tocken;
        
        pool.getConnection(function(err,con){
            if(err){
                console.log("error in getConnection");
            }
            else{
                con.query(function(err,){});
            }
        });
    });
    
    return router;
};