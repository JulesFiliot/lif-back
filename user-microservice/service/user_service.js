require("dotenv").config();
const UserDTO = require('../dto/user_dto');
const admin = require('firebase-admin');
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

exports.getUser = (req, res ,callback) => {
    db.ref('users/'+req.params.id).once('value', (data) => {
        if(data.val()) {
            return callback("", data.val());
        } else {
            return callback("The id given in parameter is either wrong or doesn't exist.", null);
        }
    });
};

exports.getAllUsers = (req, res, callback) => {
    db.ref('users/').once('value', (data) => {
        if (data.val()){
            return callback("", data.val());
        } else {
            return callback("Error while fetching all users: there might be no user.", null);
        }
    });
};

exports.addUser = (req, res, callback) => {
    console.log(req.body);
    const userDto = new UserDTO (req.body.username, req.body.email, req.body.user_achievements, req.body.bio);
    if (userDto) {
        db.ref('users/').push(userDto)
        return callback(null, userDto);
    } else {
        return callback("Error while creating user.", null);
    }
};

exports.removeUserAchievement = (req, res, callback) => {
    const userId = req.body.user_id;
    const achievementId = req.body.achievement_id;
    db.ref('users/' + userId).once('value', (data) => {
        if(data.val() && data.val().user_achievements) {
            let list_achievements = data.val().user_achievements;
            if(list_achievements.length >= 1) {
                var index = list_achievements.indexOf(parseInt(achievementId));
                if (index !== -1) {
                    list_achievements.splice(index, 1);
                } else return callback("The id given in parameter is either wrong or doesn't exist.", null);
            } else if(list_achievements[0] == achievementId){
                list_achievements = [];
            }
            db.ref('users/'+userId).update({'user_achievements': list_achievements})
            const userDto = new UserDTO(data.val().username, data.val().email, list_achievements, data.val().bio);
            return callback("", userDto);
        } else {
            return callback("The id given in parameter is either wrong or doesn't exist.", null);
        }
    })
};

exports.addUserAchievement = (req, res, callback) => {
    const userId = req.body.user_id;
    const achievementId = parseInt(req.body.achievement_id);
    let list_achievements = [];
    db.ref('users/'+userId).once('value', (data) => {
        if(data.val()) {
            if(data.val().user_achievements) {
                list_achievements = data.val().user_achievements;
            }
            if (list_achievements.indexOf(achievementId) == -1) {
                list_achievements.push(achievementId)
            } else {
                return callback("The user already have this achievement.", null);
            }
            db.ref('users/'+userId).update({'user_achievements': list_achievements})
            const userDto = new UserDTO(data.val().username, data.val().email, list_achievements, data.val().bio);
            return callback("", userDto);
        } else {
            return callback("The id given in parameter is either wrong or doesn't exist.", null);
        }
    })
};