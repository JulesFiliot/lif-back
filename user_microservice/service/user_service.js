require('dotenv').config();

const buffer = require('buffer');
const UserDTO = require('../dto/user_dto');
const RegisterUserDTO = require('../dto/register_user_dto');
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
            const utf8_dict = Object.fromEntries(
                    Object.entries(data.val()).map(([key, value]) => {
                    if (key === 'username') {
                        value = buffer.Buffer.from(value, 'base64').toString('utf-8');
                    }
                    return [key, value];
                })
            );
            return callback("", utf8_dict);
        } else {
            return callback("The id given in parameter is either wrong or doesn't exist.", null);
        }
    });
};

exports.getAllUsers = (req, res, callback) => {
    db.ref('users/').once('value', (data) => {
        if (data.val()){
            utf8_dict = Object.fromEntries(
                Object.entries(data.val()).map(([key, value]) => {
                    value.username = buffer.Buffer.from(value.username, 'base64').toString('utf-8');
                    return [key, value];
                })
            );
            return callback("", utf8_dict);
        } else {
            return callback("Error while fetching all users: there might be no user.", null);
        }
    });
};

exports.addUser = (req, res, callback) => {
    const registerUserDto = new RegisterUserDTO (req.body.username, req.body.email);
    if (registerUserDto) {
        db.ref('users/').push(registerUserDto).then((user) => {
            console.log(user.key);
            return callback(null, user.key);
        });
    } else {
        return callback("Error while creating user.", null);
    }
};


exports.editBio = (req, res, callback) => {
    db.ref('users/' + req.body.user_id).update({'bio':req.body.bio}).then(()=> {
        return callback(null,"OK");
    });
};

exports.removeUserAchievement = (req, res, callback) => {
    const userId = req.body.user_id;
    const userAchievementId = req.body.user_achievement_id;
    const subcat_id = req.body.subcat_id;
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
            let this_subcat_count = data.val().subcat_count[subcat_id] - 1;
            db.ref('users/'+userId).update({'user_achievements': list_achievements, "subcat_count": {[subcat_id]: this_subcat_count}});
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
    const subcat_id = req.body.subcat_id;
    let list_achievements = [];
    let this_subcat_count = 1;
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
            if(data.val().subcat_count && data.val().subcat_count[subcat_id]) {
                this_subcat_count += data.val().subcat_count[subcat_id];
            }
            db.ref('users/'+userId).update({'user_achievements': list_achievements, "subcat_count": {[subcat_id]: this_subcat_count}});
            const userDto = new UserDTO(data.val().username, data.val().email, list_achievements, data.val().bio);
            return callback("", userDto);
        } else {
            return callback("The id given in parameter is either wrong or doesn't exist.", null);
        }
    })
};