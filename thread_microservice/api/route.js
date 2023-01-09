const Controller = require("./controller")
const express = require("express");
const bodyParser = require("body-parser");

let router = express.Router();
router.use(bodyParser.json());

router.get("/get-threads", Controller.getThreads);
router.post("/create-thread", Controller.createThread);
router.post("/:thread_id/vote", Controller.voteThread);

module.exports = router;