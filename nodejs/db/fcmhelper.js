
const admin = require('firebase-admin');
const key = require('../key/fcm-push-example-43e46-firebase-adminsdk-0mi12-e8ce2d5672.json');
const pool = require('./pool.js');

module.exports = class FcmHelper
{
    constructor()
    {   
        this.TAG = "FcmHelper";
        let PoolClass = new poolhelper('test');
        PoolClass.setPoolEvent();
        this.pool = PoolClass.getInstance();
        this.fcm = admin.initializeApp(
            {
                credential: admin.credential.cert(key),
                databaseURL: 'https://fcm-push-example-43e46.firebaseio.com'
            });
        this.defaultadmintoken = "";
        this.queryString = "SELECT fcmtoken FROM user WHERE id=?";
    }

    static get getInstance()
    {
        return this.fcm;
    }
    static sendToDevice(userid,devicelog,res){

        if(this.fcm && this.pool){

            // This registration token comes from the client FCM SDKs.
            const vregistrationToken = fcmtoekn || this.defaultadmintoken;
            const vuserid = userid;
            const vdevicelog = devicelog;

            this.pool.getConnection(function(err,con){
                if(err){
                    console.log("getCon error in ${this.TAG}");
                    res.status(503).json({
                        msg:"getCon error in ${this.TAG}",
                        error:err.code });
                 }
                else{
                    con.query(queryString,,function(err,result,field){
                        con.release();
                        if(err){
                            console.log("query error in  ${this.TAG}");
                            res.status(503).json({msg:"fail in query"});
                        }
                        else if(result.length === 0){
                            console.log("result length error in  ${this.TAG}");
                            res.status(503).json({msg:"no results"});
                        }
                        else if(result.length === 1){
                            res.status(200).json({
                                msg:"",

                            });
                        }
                        else{
                            console.log("nothing in fcm token sending..");
                        }
                    });
                }
            });
            // See the "Defining the message payload" section below for details
            // on how to define a message payload.
            const payload = {
                    data: {
                        score: "850",
                        time: "2:45"
                        }
                    };

            // Send a message to the device corresponding to the provided
            // registration token.
            this.fcm.messaging().sendToDevice(registrationToken, payload)
                .then(function(response) {
                    // See the MessagingDevicesResponse reference documentation for
                    // the contents of response.
                    console.log("Successfully sent message:", response);
                })
                .catch(function(error) {
                    console.log("Error sending message:", error);
                });
                
        }
        else{
            throw Error("fcm admin is not initalized..");
        }
    }
};