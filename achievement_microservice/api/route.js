const Controller = require("./controller")
const express = require("express");
const bodyParser = require("body-parser");

let router = express.Router();
router.use(bodyParser.json());

router.post("/create-achievement", Controller.createAchievement);
router.get("/get-achievements", Controller.getAchievements);
router.post("/add-user-achievement", Controller.addUserAchievement);
router.post("/remove-user-achievement", Controller.removeUserAchievement);
router.get("/get-user-achievements/:user_id", Controller.getUserAchievements);

module.exports = router;