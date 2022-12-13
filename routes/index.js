var express = require('express');
var router = express.Router();
var modules = require('../modules');

/* GET home page. */
router.get('/', async function(req, res) {
  var result = await modules.pg.query(`select * from posts`,'');
  res.render('index', { title: '홈', data: result});
  
});

module.exports = router;
