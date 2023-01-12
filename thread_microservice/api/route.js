const Controller = require("./controller")
const express = require("express");
const bodyParser = require("body-parser");

let router = express.Router();
router.use(bodyParser.json());

router.get("/threads/:subcat_id?", Controller.getThreads);
router.post("/thread", Controller.createThread);
router.post("/vote/:thread_id", Controller.voteThread);

module.exports = router;