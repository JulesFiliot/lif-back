const Controller = require("./controller")
const express = require("express");
let router = express.Router();

let multer = require('multer');
let upload = multer();

  

router.get("/getUser/:id", upload.array(), Controller.getUser);
router.get("/getAllUsers/", upload.array(), Controller.getAllUsers);
router.post("/addUser/", Controller.addUser);

//router.post('/notify', Controller.notif);
module.exports = router;
