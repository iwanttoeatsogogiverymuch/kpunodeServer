const moment = require('moment');
const admin = require('firebase-admin');
const key = require('../key/fcm-push-example-43e46-firebase-adminsdk-0mi12-e8ce2d5672.json');

let fcm;

module.exports = class FcmHelper
{
    constructor()
    {   

    }

    static setInstance()
    {
        if(!fcm){
            fcm = admin.initializeApp(
                {
                    credential: admin.credential.cert(key),
                    databaseURL: 'https://fcm-push-example-43e46.firebaseio.com'
                });
        }
    }
    static sendToDevice(fcmtoken){

        if(fcm){

            const registrationToken = fcmtoken ;
           // const data = alramdata;


            const timestamp = new Date();
            const datelocal = timestamp.toLocaleDateString();
            const payload = {
                notification:{
                        title:"고양이출입알람",
                        body:"고양이가 출입하였습니다."
                         }
                    };

            fcm.messaging().sendToDevice(registrationToken, payload)
                .then(function(response) {

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

    static sendToDevice_humidity(fcmtoken){

        if(fcm){

            const registrationToken = fcmtoken ;
           // const data = alramdata;

            const payload = {
                notification:{
                        title:"고양이출입알람",
                        body:Date.now()
                    }
                    };

            fcm.messaging().sendToDevice(registrationToken, payload)
                .then(function(response) {

                    console.log("Successfully sent message:", response);
                })
                .catch(function(error) {
                    console.log("Error sending message:", error);
                });
        }
        else{
            throw Error("fcm admin is not initialized..");
        }
    }

};