const fcm = require('../db/fcmhelper.js');
const Pool = require('../db/pool');
const router = require('express').Router();

module.exports = function(){
    
    let PoolClass = new Pool('test');
    PoolClass.setPoolEvent();
    let pool = PoolClass.getInstance();

    router.post('/',function(req,res){

        const tocken = req.query.tocken;
        
        // pool.getConnection(function(err,con){
        //     if(err){
        //         console.log("error in getConnection");
        //     }
        //     else{
        //         con.query("select * from user",fucntion(err,result){
        //             con.release();
        //         });
        //     }
        // });
    });
    
    return router;
};