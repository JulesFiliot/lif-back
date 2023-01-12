const Controller = require("./controller")
const express = require("express");
const bodyParser = require("body-parser");

let router = express.Router();
router.use(bodyParser.json());

router.get("/threads", Controller.getThreads);
router.get("/threads/:subcat_id", Controller.getSubcatThreads);
router.post("/create-thread", Controller.createThread);
router.post("/vote/:thread_id", Controller.voteThread);

module.exports = router;