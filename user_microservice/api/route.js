const Controller = require("./controller")
const express = require("express");
let router = express.Router();

let multer = require('multer');
let upload = multer();

const authMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    payload = {token: token};
    
    axios.post("http://127.0.0.1:3005/verify/", payload).then((data) => {
        console.log(data);
        next();
    }).catch((err) => {
        res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    });
}



router.get("/user/:id", upload.array(), Controller.getUser);
router.get("/users/", upload.array(), Controller.getAllUsers);
router.post("/user/", Controller.addUser);
router.post("/edit-bio/", Controller.editBio);
router.post("/remove-user-achievement/", Controller.removeUserAchievement);
router.post("/user-achievement/", Controller.addUserAchievement);
router.get("/valid-user-count/:subcat_id",Controller.getValidUserCount);
//router.post('/notify', Controller.notif);
module.exports = router;
