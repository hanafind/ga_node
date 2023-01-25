var express = require("express");
var router = express.Router();
var modules = require("../modules");
var mapper = require("./mapper.js");

/* GET article page. */
router.get("/article/:url_slug", async function (req, res) {
    try {
      // 포스트 상세
      let sql = mapper.sqlPostView;
      let values = [req.params.url_slug];
      var result = await modules.pg.query(sql, values);
  
      // 연관 포스트
      sql =
        mapper.sqlPostList +
        `AND p.idx <> $1
          AND pcm.post_categories_idx = $2
          ORDER BY p.posting_date desc 
          LIMIT 2;`;
      values = [result[0].idx, result[0].category_idx];
      var result2 = await modules.pg.query(sql, values);
  
      // 추천 포스트
      sql = mapper.sqlRecommandPost + ` LIMIT 2`;
      var result3 = await modules.pg.query(sql);
      res.render("blog/view", {
        title: "상세",
        data: result,
        data_relation: result2,
        data_recommand: result3,
        req: req,
        res: res
      });
    } catch (err) {
      res.redirect("/");
    }
  });

/* GET categories page. */
router.get(["/:category"], async function (req, res) {
    try {
      req.query.page = req.query.page !== undefined ? req.query.page : 1;

      let sql =
        mapper.sqlPostList +
        ` AND pc.name = $1 
              order by p.posting_date desc
              limit 9
              offset ($2-1) * 9;`;
      let values = [req.params.category, req.query.page];

      // let sql = mapper.sqlPostList;
      // let sqlCategory = ` AND pc.name = ` + req.params.category;
              
      // let values = [req.params.page, sqlCategory];

      
      var result = await modules.pg.query(sql, values);
  
      // 포스트 페이지 카운트
      values = [result[0].category_idx];
      sql = mapper.sqlPostPageCount + ` and pcm.post_categories_idx = $1`;
  
      // values = [req.params.page];
      var result2 = await modules.pg.query(sql, values);
  
      result2[0].currentPage = req.query.page;
      result2[0].url = "/blog/" + req.params.category;
  
      res.render("blog/categories", {
        title: req.params.category,
        data: result,
        data_pageInfo: result2,
      });
    } catch (err) {
      res.redirect("/");
    }
  });
  
  
  
  module.exports = router;