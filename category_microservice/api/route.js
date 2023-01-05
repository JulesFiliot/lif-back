const Controller = require("./controller")
const express = require("express");
const bodyParser = require("body-parser");

let router = express.Router();
router.use(bodyParser.json());

router.get("/get_categories", Controller.getCategories);
router.get("/get_subcategories/:cat_id?", Controller.getSubcats);
router.post("/create_category", Controller.createCategory);
router.post("/create_subcategory", Controller.createSubcat);

module.exports = router;