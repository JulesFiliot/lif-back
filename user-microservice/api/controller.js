const user_service = require('../service/user_service');

exports.getUser = (req,res) => {
    user_service.getUser(req,res,(error,data) => {
    if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
}

exports.getAllUsers = (req,res) => {
    user_service.getAllUsers(req,res,(error,data) => {
    if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
}

exports.addUser = (req,res) => {
    user_service.addUser(req,res,(error) => {
        if (error) {
            res.send(error);
        } else {
            res.sendStatus(200);
        }
    });
}

exports.removeUserAchievement = (req,res) => {
    user_service.removeUserAchievement(req,res,(error) => {
        if (error) {
            res.send(error);
        } else {
            res.sendStatus(200);
        }
    });
}

exports.addUserAchievement = (req,res) => {
    user_service.addUserAchievement(req,res,(error) => {
        if (error) {
            res.send(error);
        } else {
            res.sendStatus(200);
        }
    });
}