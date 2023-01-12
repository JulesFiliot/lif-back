const Controller = require("./controller")
const express = require("express");
let router = express.Router();

let multer = require('multer');
let upload = multer();

const jwt = require('jsonwebtoken');
const secret = 'your-secret';

const authMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
        req.userId = decoded.id;
        next();
    });
}


router.get("/get-user/:id", upload.array(), Controller.getUser);
router.get("/get-all-users/", authMiddleware, Controller.getAllUsers);
router.post("/add-user/", Controller.addUser);
router.post("/edit-bio/", Controller.editBio);
router.post("/remove-user-achievement/", Controller.removeUserAchievement);
router.post("/add-user-achievement/", Controller.addUserAchievement);

//router.post('/notify', Controller.notif);
module.exports = router;
