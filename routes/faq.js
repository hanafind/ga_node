var express = require("express");
var router = express.Router();
var modules = require("../modules");
var mapper = require("./mapper.js");

/* GET article page. */
router.get("/", async function (req, res) {
    try {
      res.render("faq", {
      });
    } catch (err) {
      res.redirect("/");
    }
  });


  module.exports = router;