var express = require("express");
var router = express.Router();

var modules = require("../modules");
var mapper = require("./mapper.js");

/* GET fag */
router.get("/", async function (req, res) {
  try {
    res.data = {};
    res.data.products_recommend = await modules.pg.query(mapper.sqlDirectRecommend);
    res.data.products_all = await modules.pg.query(mapper.sqlDirectAll);

    res.render("product/", {req: req, res: res});
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

module.exports = router;
