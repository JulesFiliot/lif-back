const Controller = require("./controller")
const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const upload = multer();
let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post("/achievement", Controller.createAchievement);
router.get("/achievements", Controller.getAchievements);
router.post("/user-achievement", upload.single('image'), Controller.addUserAchievement);
router.post("/remove-user-achievement", Controller.removeUserAchievement);
router.get("/user-achievements", Controller.getUserAchievements);
router.post("/vote/:achievement_id", Controller.voteAchievement);
router.get("/subcat-achievements/:subcat_id/:user_id?", Controller.getSubcatAchievements);

module.exports = router;