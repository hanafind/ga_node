var express = require("express");
var router = express.Router();
const fs = require("fs");
const SitemapGenerator = require('sitemap-generator');

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

router.post('/sitemap', async (req, res, next) => {
  // create generator
  //const generator = SitemapGenerator(`${req.protocol}://${req.headers.host}/`, {
  const generator = SitemapGenerator(`https://insure.hanafind.com/`, {
    stripQuerystring: false,
    lastMod: true,
    changeFreq: 'daily'
  });

  // register event listeners
  generator.on('done', () => {
      res.end(`sitemap created`);
  });

  generator.on('error', (error) => {
      console.log(error);
  });

    // start the crawler
  await generator.start();
});

router.get('/sitemap.xml', async (req, res, next) => {
  res.type('xml');
  res.send(fs.readFileSync('./sitemap.xml', 'utf8'));
});

router.get('/markup_guide', async (req, res, next) => {
  res.render('guide/index', {});
});


/* GET home page. */
router.get(["/"], async function (req, res) {
  try {
    // 포스트 목록
    let sql =
      mapper.sqlPostList +
      ` order by p.posting_date desc
    limit 9
    offset ($1-1) * 9`;
    req.query.page = req.query.page !== undefined ? req.query.page : 1;
    let values = [req.query.page];
    var result = await modules.pg.query(sql, values);

    // 추천 포스트
    sql = mapper.sqlRecommandPost;
    var result2 = await modules.pg.query(sql);

    // 포스트 페이지 카운트
    sql = mapper.sqlPostPageCount;
    var result3 = await modules.pg.query(sql);
    result3[0].currentPage = req.query.page;

    res.render("index", {
      title: "홈",
      data: result,
      data_recommand: result2,
      data_pageInfo: result3,
      req: req,
      res, res
    });
  } catch (err) {
    res.redirect("/");
  }
});

module.exports = router;
