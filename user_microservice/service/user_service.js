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
                    if (key === 'email') {
                        value = buffer.Buffer.from(value, 'base64').toString('utf-8');
                    }
                    if (key === 'bio') {
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
    const username = req.body.username ? req.body.username.toString() : null;
    const email = req.body.email ? req.body.email.toString() : null;
    if (username && email) {
        const registerUserDto = new RegisterUserDTO (username, email);
        if (registerUserDto) {
            db.ref('users/').push(registerUserDto).then((user) => {
                return callback(null, user.key);
            });
        } else {
            return callback("Error while creating user.", null);
        }
    } else {
        return callback("Error while creating user.", null);
    }
};


exports.editBio = (req, res, callback) => {
    db.ref('users/' + req.body.user_id?req.body.toString():null).update({'bio':req.body.bio?req.body.bio.toString():null}).then(()=> {
        return callback(null,"OK");
    }).catch((err)=>{
        return callback(1,null);
    });
};

exports.removeUserAchievement = (req, res, callback) => {
    const userId = req.body.user_id ? req.body.user_id.toString() : null;
    const userAchievementId = req.body.user_achievement_id ? req.body.user_achievement_id.toString() : null;
    const subcat_id = req.body.subcat_id ? req.body.subcat_id.toString() : null;
    let list_achievements = [];
    let return_data = {};
    db.ref('users/' + userId).transaction((data) => {
        if(data && data.user_achievements) {
            list_achievements = data.user_achievements;
            if(list_achievements.length >= 1) {
                var index = list_achievements.indexOf(userAchievementId);
                if (index !== -1) {
                    list_achievements.splice(index, 1);
                } else throw ("The id given in parameter is either wrong or doesn't exist.");
            } else if(list_achievements[0] == userAchievementId){
                list_achievements = [];
            }
            let this_subcat_count = data.subcat_count[subcat_id];
            data.user_achievements = list_achievements;
            data.subcat_count[subcat_id]=this_subcat_count - 1;
            return_data = data;
            return data
        } else {
            return null;
        }
    }).then(()=>{
        const userDto = new UserDTO(return_data.username, return_data.email, list_achievements, return_data.bio);
        return callback("", userDto);
    }).catch((error)=>{
        return callback("The id given in parameter is either wrong or doesn't exist.", null);
    })
};

exports.addUserAchievement = (req, res, callback) => {
    const userId = req.body.user_id ? req.body.user_id.toString() : null;
    const userAchievementId = req.body.user_achievement_id ? req.body.user_achievement_id.toString() : null;
    const subcat_id = req.body.subcat_id ? req.body.subcat_id.toString() : null;
    let list_achievements = [];
    let this_subcat_count = 1;
    let return_data = {};
    return db.ref('users/'+userId).transaction((data) => {
        if(data) {
            if(data.user_achievements) {
                list_achievements = data.user_achievements;
            }
            if (list_achievements.indexOf(userAchievementId) == -1) {
                list_achievements.push(userAchievementId)
            } else {
                throw ("The user already have this achievement.");
            }
            if(data.subcat_count && data.subcat_count[subcat_id]) {
                this_subcat_count += data.subcat_count[subcat_id];
            }

            data.user_achievements = list_achievements;
            if (data.subcat_count) {data.subcat_count[subcat_id]=this_subcat_count}
            else {
                data.subcat_count = {};
                data.subcat_count[subcat_id]=this_subcat_count;
            }
            return_data = data;
            return data
        } else {
            return null;
        }
    }).then(()=>{
        const userDto = new UserDTO(return_data.username, return_data.email, list_achievements, return_data.bio);
        return callback("", userDto);
    }).catch((error)=>{
        return callback("The id given in parameter is either wrong or doesn't exist.", null);
    })
};

exports.getValidUserCount = (req, res, callback) => {
    try {
        db.ref('users/').orderByChild('subcat_count/'+req.params.subcat_id).startAt(5).once('value', (data) => {
            valid_users = data.val();
            return callback("", {count:valid_users ? Object.keys(valid_users).length : 0});
        });
    } catch (err) {
        return callback(1);
    }
};