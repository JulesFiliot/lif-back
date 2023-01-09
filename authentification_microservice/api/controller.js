const authentification_service = require('../service/authentification_service');

exports.login = (req,res) => {
    authentification_service.login(req,res,(error,data) => {
    if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
}

exports.register = (req,res) => {
    authentification_service.register(req,res,(error,data) => {
    if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
}

exports.verify = (req,res) => {
    authentification_service.verify(req,res,(error,data) => {
    if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
}