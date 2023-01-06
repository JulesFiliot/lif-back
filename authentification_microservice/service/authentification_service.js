require('dotenv').config();

const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const admin = require('firebase-admin');
const buffer = require('buffer');
const serviceAccount = require(process.env.SERVICE_ACCOUNT_KEY_PATH);
const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount),
    apiKey: "AIzaSyCmmvusffkyhITJBWJuN-eN58XQKBwCRDQ",
    authDomain: "lif-inc.firebaseapp.com",
    projectId: "lif-inc",
    storageBucket: "lif-inc.appspot.com",
    messagingSenderId: "106325689547",
    appId: "1:106325689547:web:043220d36608dd139a074e",
    databaseURL:"https://lif-inc-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = admin.initializeApp(firebaseConfig);
const db = admin.database();

exports.login = (req, res, callback) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log("AUTH: ", username, password);
    bcrypt.hash(username, 10, null).then((hash) => {
        try {
            db.ref('authentification/').once('value', (data) => {
                
                console.log("data: ",data.val());
                const username_hash_b64 = buffer.Buffer.from(hash).toString('base64')
                console.log("username_hash_b64: ", username_hash_b64);
                const hashed_pwd_b64 = data.val()[username_hash_b64];
                console.log("hashed_pwd_b64",hashed_pwd_b64);
                const hashed_pwd = buffer.Buffer.from(hashed_pwd_b64, 'base64').toString('utf8');
                console.log("hashed_pwd",hashed_pwd);
                bcrypt.compare(password, hashed_pwd).then((isMatch) => {
                    if (isMatch) {
                        console.log('Password and username are correct');
                    } else {
                        return callback("Username or password incorrect.", null);
                    };
                });
            });
        } catch (e) {
            return callback("Username or password incorrect.", null);
        }
    })


    //TODO: check password in database (currently hardcoded)
    /*bcrypt.hash(password, 10)
    .then((hash) => {
        
    })*/

    // If the credentials are valid, create a JWT for the user.
    const payload = {
        user: username
    };
    const secret = 'your-secret';
    const options = {
        expiresIn: '1h'
    };

    return callback('',jwt.sign(payload, secret, options));
};

exports.verify = (req, res, callback) => {
    const token = req.body.token;
    try {
        const verified = jwt.verify(token, 'your-secret');
        callback(null, verified);
        es.send({ verified });
    } catch (error) {
        callback('Invalid token', null);
    }
};
