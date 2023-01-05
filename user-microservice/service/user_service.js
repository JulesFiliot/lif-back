require('dotenv').config();
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



/*users = {
    1:{name:"Tao Pai Pai", email:"taopai.pai@gmail.com", xp:6945, achievments:[5,9,24,32,97]},
    2:{name:"Kakyoin", email:"kakyoin@gmail.com", xp:5287, achievments:[69,25,4,87,61]}
};*/

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
    const userAchievementId = req.body.user_achievement_id;
    db.ref('users/' + userId).once('value', (data) => {
        if(data.val() && data.val().user_achievements) {
            let list_achievements = data.val().user_achievements;
            if(list_achievements.length >= 1) {
                var index = list_achievements.indexOf(userAchievementId);
                if (index !== -1) {
                    list_achievements.splice(index, 1);
                } else return callback("The id given in parameter is either wrong or doesn't exist.", null);
            } else if(list_achievements[0] == userAchievementId){
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
    const userAchievementId = req.body.user_achievement_id;
    console.log("youuuuuhuou")
    let list_achievements = [];
    db.ref('users/'+userId).once('value', (data) => {
        if(data.val()) {
            if(data.val().user_achievements) {
                list_achievements = data.val().user_achievements;
            }
            if (list_achievements.indexOf(userAchievementId) == -1) {
                list_achievements.push(userAchievementId)
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