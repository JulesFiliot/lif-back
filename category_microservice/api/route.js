const Controller = require("./controller")
const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios');

let router = express.Router();
router.use(bodyParser.json());

const authMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    payload = {token: token};
    axios.post("http://127.0.0.1:3005/verify/", payload).then((data) => {
        console.log(data);
        next();
    }).catch((err) => {
        res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    });
}

router.get("/categories", authMiddleware,Controller.getCategories);
router.get("/subcategories/:cat_id?", authMiddleware,Controller.getSubcats);
router.post("/category", authMiddleware,Controller.createCategory);
router.post("/subcategory", authMiddleware,Controller.createSubcat);

module.exports = router;