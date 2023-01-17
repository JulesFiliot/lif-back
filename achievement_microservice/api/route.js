const Controller = require("./controller")
const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const upload = multer();
let router = express.Router();
const axios = require('axios');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const authMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    payload = {token: token};
    axios.post("http://127.0.0.1:3005/verify/", payload).then((data) => {
        next();
    }).catch((err) => {
        res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    });
}

router.post("/achievement", authMiddleware, Controller.createAchievement);
router.get("/achievements", authMiddleware, Controller.getAchievements);
router.post("/user-achievement", authMiddleware, upload.single('image'), Controller.addUserAchievement);
router.post("/remove-user-achievement", authMiddleware, Controller.removeUserAchievement);
router.get("/user-achievements", authMiddleware, Controller.getUserAchievements);
router.post("/vote/:achievement_id", authMiddleware, Controller.voteAchievement);
router.get("/subcat-achievements/:subcat_id/:user_id?", authMiddleware, Controller.getSubcatAchievements);

module.exports = router;