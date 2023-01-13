const Controller = require("./controller")
const express = require("express");
let router = express.Router();

let multer = require('multer');
let upload = multer();

  

router.get("/user/:id", upload.array(), Controller.getUser);
router.get("/users/", upload.array(), Controller.getAllUsers);
router.post("/user/", Controller.addUser);
router.post("/edit-bio/", Controller.editBio);
router.post("/remove-user-achievement/", Controller.removeUserAchievement);
router.post("/user-achievement/", Controller.addUserAchievement);
router.get("/valid-user-count/:subcat_id",Controller.getValidUserCount);
//router.post('/notify', Controller.notif);
module.exports = router;
