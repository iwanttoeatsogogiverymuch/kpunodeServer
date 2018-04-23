const admin = require('firebase-admin');
const key = require('../key/fcm-push-example-43e46-firebase-adminsdk-0mi12-e8ce2d5672.json');
class FcmHelper {
    static fcm;
    constructor() {

    }
    static init() {
        this.fcm = admin.initializeApp({
            credential: admin.credential.cert(key),
            databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
        });
    }
    get getInstance() {

    }
}