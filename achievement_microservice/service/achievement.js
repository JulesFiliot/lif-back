require('dotenv').config();
const UserDTO = require('../dto/user-dto');
const AchievementDTO = require('../dto/achievement-dto');
const UserAchievementDTO = require('../dto/user-achievement-dto');
const Achievement = require('../entity/achievement');
const axios = require('axios');
const admin = require('firebase-admin');
const serviceAccount = require(process.env.SERVICE_ACCOUNT_KEY_PATH); //add path to service_account_key.json
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
const userServiceRoute = "http://localhost:3001/"

const app = admin.initializeApp(firebaseConfig);

exports.createAchievement = (req,res,callback) => {
    const achievement = new AchievementDTO(req.body.achievement.name,req.body.achievement.desc,req.body.achievement.rank, req.body.achievement.sub_id);
    const ref = admin.database().ref('achievements/')
    ref.push(achievement);
    callback("","created");
}

exports.getAchievements = (req,res,callback) => {
    let response = "";
    const ref = admin.database().ref('achievements/')
    ref.once('value', (snapshot) => {
        response = snapshot.val();
        callback("",response);
      });
}

exports.addUserAchievement = (req,res,callback) => {
    const user_achievement = new UserAchievementDTO(req.body.user_achievement.user_id,req.body.user_achievement.achievement_id ,req.body.user_achievement.date ,req.body.user_achievement.location, req.body.user_achievement.image);
    const ref = admin.database().ref('user_achievements/')
    const user_achievement_ref = ref.push(user_achievement);
    console.log("-----",user_achievement_ref.key)

    //request to user microservice to add to user_achievements list
    let payload = {
        user_id : req.body.user_achievement.user_id,
        user_achievement_id : user_achievement_ref.key
    };
    axios.post(userServiceRoute+'add-user-achievement/', payload).catch((err)=>{
        //console.log(err)
    });
    callback("",'added');
}

exports.removeUserAchievement = (req,res,callback) => {
    const ref = admin.database().ref('user_achievements/'+req.body.user_achievement.user_achievement_id)
    ref.remove();

    //request to user microservice to remove from user_achievements list
    let payload = {
        user_id : req.body.user_achievement.user_id,
        user_achievement_id : req.body.user_achievement.user_achievement_id
    };
    axios.post(userServiceRoute+'remove-user-achievement/', payload).catch((err)=>{
        //console.log(err)
    });
    callback("",'removed');
}

exports.getUserAchievements = (req,res,callback) => {
    let response = "";
    if (req.params.user_id) {
        const ref = admin.database().ref('user_achievements').orderByChild('user_id').equalTo(req.params.user_id);
        ref.once('value', (snapshot) => {
            response = snapshot.val();
            callback("", response);
        });
    } else {
        const ref = admin.database().ref('user_achievements');
        ref.once('value', (snapshot) => {
            response = snapshot.val();
            callback("", response);
        });
    }
}
