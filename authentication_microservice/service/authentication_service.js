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
    const email = req.body.email;
    const password = req.body.password;
    const email_b64 = buffer.Buffer.from(email).toString('base64');
    db.ref('authentication/').orderByChild('email').equalTo(email_b64).once('value', (data) => {
        if (!data.val()) {
            return callback("Username or password incorrect.", null);
        }
        
        const user_id = Object.keys(data.val())[0];
        const hashed_pwd_b64 = Object.values(data.val())[0].password;
        console.log(hashed_pwd_b64);
        if (!(hashed_pwd_b64)){
            return callback("Username or password incorrect.", null);
        }
        const hashed_pwd = buffer.Buffer.from(hashed_pwd_b64, 'base64').toString('utf8');
        bcrypt.compare(password, hashed_pwd).then((isMatch) => {
            if (isMatch) {
                const payload = {
                    user: email
                };
                const secret = 'your-secret';
                const options = {
                    expiresIn: '1h'
                };
                axios.get("http://127.0.0.1:3001/user/" + user_id, payload).then((user) => {
                    user.data['id'] = user_id;
                    return callback('',{token:jwt.sign(payload, secret, options),user:user.data});
                })
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
    const email_b64 = buffer.Buffer.from(email).toString('base64');
    const username_b64 = buffer.Buffer.from(username).toString('base64');
    db.ref('authentication/' + email_b64).once('value', data => {
        if (data.val()) {
            return callback("Username already exists.", null);
        }
        const payload = {
            username: username_b64, 
            email: email_b64, 
        };
        axios.post("http://127.0.0.1:3001/user/", payload).then((id) => {
            bcrypt.hash(password, 10).then((hash)=>{
                hash_pwd_b64 = buffer.Buffer.from(hash).toString('base64');
                db.ref('authentication/').update({[id.data]:{password:hash_pwd_b64, email:email_b64}});
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
        callback(null, verified);
        es.send({ verified });
    } catch (error) {
        callback('Invalid token', null);
    }
};
