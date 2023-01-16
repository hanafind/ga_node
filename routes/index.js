var express = require("express");
var router = express.Router();
const fs = require("fs");
var modules = require("../modules");
var mapper = require("./mapper.js");

router.get(["/rss.xml", "/rss"], async function (req, res) {
  let sql = mapper.sqlPostList +
            ` order by p.posting_date desc
            limit 20`;
  var result = await modules.pg.query(sql);
  var rssFeed = await modules.rss.generateFullContentFeed(result);
  res.type('xml')
  res.send(rssFeed.xml());
});

router.get(["/robots.txt"], async function (req, res) {
  res.type('txt');
  res.send(`User-agent: *\n${process.env.NODE_ENV == 'production'?'Allow':'Disallow'}: /`);
});

router.get('/sitemap.xml', async (req, res, next) => {
  res.set('xml');
  res.send(fs.readFileSync('./sitemap.xml', 'utf8'));
});

router.get('/markup_guide', async (req, res, next) => {
  res.render('guide/index', {});
});

/* GET home page. */
router.get(["/", "/:page"], async function (req, res) {
  try {
    // 포스트 목록
    let sql =
      mapper.sqlPostList +
      ` order by p.posting_date desc
    limit 9
    offset ($1-1) * 9;`;
    req.params.page = req.params.page !== undefined ? req.params.page : 1;
    let values = [req.params.page];
    var result = await modules.pg.query(sql, values);

    // 추천 포스트
    sql = mapper.sqlRecommandPost;
    var result2 = await modules.pg.query(sql);

    // 포스트 페이지 카운트
    sql = mapper.sqlPostPageCount;
    var result3 = await modules.pg.query(sql);
    result3[0].currentPage = req.params.page;
    // result3[0].url = '/';

    res.render("index", {
      title: "홈",
      data: result,
      data_recommand: result2,
      data_pageInfo: result3,
    });
  } catch (err) {
    res.redirect("/");
  }
});

module.exports = router;
