const Controller = require("./controller")
const express = require("express");
const bodyParser = require("body-parser");

let router = express.Router();
router.use(bodyParser.json());

router.post("/create_achievement", Controller.createAchievement);
router.get("/get_achievements", Controller.getAchievements);
router.post("/add_user_achievement", Controller.addUserAchievement);
router.post("/remove_user_achievement", Controller.removeUserAchievement);
router.get("/get_user_achievements/:user_id", Controller.getUserAchievements);

module.exports = router;