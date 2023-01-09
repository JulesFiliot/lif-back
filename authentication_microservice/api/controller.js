const authentication_service = require('../service/authentication_service');

exports.login = (req,res) => {
    authentication_service.login(req,res,(error,data) => {
    if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
}

exports.register = (req,res) => {
    authentication_service.register(req,res,(error,data) => {
    if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
}

exports.verify = (req,res) => {
    authentication_service.verify(req,res,(error,data) => {
    if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
}