const achievement = require('../service/achievement');

exports.createAchievement = (req,res)=>{
    achievement.createAchievement(req,res,(error,data)=>{
        if (error){
            res.send("error");
        }else{
            res.send(data);
        }
    })
}

exports.getAchievements = (req,res)=>{
    achievement.getAchievements(req,res,(error,data)=>{
        if (error){
            res.send("error");
        }else{
            res.send(data);
        }
    })
}

exports.addUserAchievement = (req,res)=>{
    achievement.addUserAchievement(req,res,(error,data)=>{
        if (error){
            res.send("error");
        }else{
            res.send(data);
        }
    })
}

exports.removeUserAchievement = (req,res)=>{
    achievement.removeUserAchievement(req,res,(error,data)=>{
        if (error){
            res.send("error");
        }else{
            res.send(data);
        }
    })
}

exports.getUserAchievements = (req,res)=>{
    achievement.getUserAchievements(req,res,(error,data)=>{
        if (error){
            res.send("error");
        }else{
            res.send(data);
        }
    })
}

exports.voteAchievement = (req,res)=>{
    achievement.voteAchievement(req,res,(error,data)=>{
        if (error){
            res.send("error");
        }else{
            res.send(data);
        }
    })
}