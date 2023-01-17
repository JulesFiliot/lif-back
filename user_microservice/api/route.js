const Controller = require("./controller")
const express = require("express");
let router = express.Router();
const axios = require('axios');

const authMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    payload = {token: token};

    axios.post("http://127.0.0.1:3005/verify/", payload).then((data) => {
        next();
    }).catch((err) => {
        res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    });
}


router.get("/user/:id", authMiddleware, Controller.getUser);
router.get("/users/", authMiddleware, Controller.getAllUsers);
router.post("/user/", Controller.addUser);
router.post("/edit-bio/", authMiddleware,Controller.editBio);
router.post("/remove-user-achievement/", authMiddleware,Controller.removeUserAchievement);
router.post("/user-achievement/", authMiddleware,Controller.addUserAchievement);
router.get("/valid-user-count/:subcat_id", authMiddleware,Controller.getValidUserCount);

module.exports = router;
