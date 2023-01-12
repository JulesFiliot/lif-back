require('dotenv').config();

const axios = require('axios');
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
    const username_b64 = buffer.Buffer.from(username).toString('base64')
    db.ref('authentication/').orderByChild('username').equalTo(username_b64).once('value', (data) => {
        const hashed_pwd_b64 = Object.values(data.val())[0].password;
        console.log(hashed_pwd_b64);
        if (!(hashed_pwd_b64)){
            return callback("Username or password incorrect.", null);
        }
        const hashed_pwd = buffer.Buffer.from(hashed_pwd_b64, 'base64').toString('utf8');
        bcrypt.compare(password, hashed_pwd).then((isMatch) => {
            if (isMatch) {
                const payload = {
                    user: username
                };
                const secret = 'your-secret';
                const options = {
                    expiresIn: '1h'
                };
                return callback('',jwt.sign(payload, secret, options));
            } else {
                return callback("Username or password incorrect.", null);
            };
        });
    });
};


exports.register = (req, res, callback) => {
    const {username, password, email} = req.body;
    if (!username || !password || !email) return callback("Empty entry, please complete each entry on the registration form.", null);
    // check if username already exists
    const username_b64 = buffer.Buffer.from(username).toString('base64');
    db.ref('authentication/' + username_b64).once('value', data => {
        if (data.val()) {
            return callback("Username already exists.", null);
        }
        const payload = {
            username: username_b64, 
            email: email, 
        };
        axios.post("http://127.0.0.1:3001/add-user/", payload).then((id) => {
            bcrypt.hash(password, 10).then((hash)=>{
                console.log(id.data);
                hash_pwd_b64 = buffer.Buffer.from(hash).toString('base64');
                db.ref('authentication/').update({[id.data]:{password:hash_pwd_b64, username:username_b64}});
                return callback(null, "New user added: " + payload);
            });
        }).catch((err)=>{
            return callback("Error while adding user.",null);
        });
    });
};

exports.verify = (req, res, callback) => {
    const token = req.body.token;
    try {
        const verified = jwt.verify(token, 'your-secret');
        return callback(null, verified);
    } catch (error) {
        return callback('Invalid token', null);
    }
};
