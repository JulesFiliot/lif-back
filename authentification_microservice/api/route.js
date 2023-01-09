const Controller = require("./controller")
const express = require("express");
let router = express.Router();

router.post("/login/", Controller.login);
router.post("/verify/", Controller.verify);

module.exports = router;
