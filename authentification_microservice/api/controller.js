const authentification_service = require('../service/authentification_service');

exports.login = (req,res) => {
    console.log('controller');
    authentification_service.login(req,res,(error,data) => {
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