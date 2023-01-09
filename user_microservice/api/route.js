const Controller = require("./controller")
const express = require("express");
let router = express.Router();

let multer = require('multer');
let upload = multer();

  

router.get("/get-user/:id", upload.array(), Controller.getUser);
router.get("/get-all-users/", upload.array(), Controller.getAllUsers);
router.post("/add-user/", Controller.addUser);
router.post("/edit-bio/", Controller.editBio);
router.post("/remove-user-achievement/", Controller.removeUserAchievement);
router.post("/add-user-achievement/", Controller.addUserAchievement);

//router.post('/notify', Controller.notif);
module.exports = router;
