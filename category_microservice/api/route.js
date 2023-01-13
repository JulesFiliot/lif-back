const Controller = require("./controller")
const express = require("express");
const bodyParser = require("body-parser");

let router = express.Router();
router.use(bodyParser.json());

router.get("/categories", Controller.getCategories);
router.get("/subcategories/:cat_id?", Controller.getSubcats);
router.post("/category", Controller.createCategory);
router.post("/subcategory", Controller.createSubcat);

module.exports = router;