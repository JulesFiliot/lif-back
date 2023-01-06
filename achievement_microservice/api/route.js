const Controller = require("./controller")
const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const upload = multer();
let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post("/create-achievement", Controller.createAchievement);
router.get("/get-achievements", Controller.getAchievements);
router.post("/add-user-achievement", upload.single('image'), Controller.addUserAchievement);
router.post("/remove-user-achievement", Controller.removeUserAchievement);
router.get("/get-user-achievements/:user_id", Controller.getUserAchievements);

module.exports = router;