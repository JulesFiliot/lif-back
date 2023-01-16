const authentication_service = require('../service/authentication_service');

exports.login = (req,res) => {
    authentication_service.login(req,res,(error,data) => {
    if (error) {
            res.status(404).json(error);
        } else {
            res.status(200).json(data);
        }
    });
}

exports.register = (req,res) => {
    authentication_service.register(req,res,(error,data) => {
    if (error) {
            res.status(404).json(error);
        } else {
            res.status(200).json(data);
        }
    });
}

exports.verify = (req,res) => {
    authentication_service.verify(req,res,(error,data) => {
    if (error) {
            res.status(404).json(error);
        } else {
            res.status(200).json(data);
        }
    });
}