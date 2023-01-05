const Controller = require("./controller")
const express = require("express");
const bodyParser = require("body-parser");

let router = express.Router();
router.use(bodyParser.json());

router.get("/get-categories", Controller.getCategories);
router.get("/get-subcategories/:cat_id?", Controller.getSubcats);
router.post("/create-category", Controller.createCategory);
router.post("/create-subcategory", Controller.createSubcat);

module.exports = router;