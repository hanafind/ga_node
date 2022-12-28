var express = require('express');
var router = express.Router();
var modules = require('../modules');
var mapper = require('./mapper.js');
const url = require('url');
const { query } = require('express');


/* GET home page. */
router.get(['/','/:page'], async function(req, res) {
  // 포스트 목록
  let sql = mapper.sqlPostList + 
          ` order by p.idx desc
            limit 3
            offset ($1-1) * 3;`;
  req.params.page = (req.params.page !== undefined)?req.params.page:1;
  let values = [req.params.page];          
  var result = await modules.pg.query(sql, values);
  
  // 추천 포스트
  sql = mapper.sqlRecommandPost;
  var result2 = await modules.pg.query(sql);

  // 포스트 페이지 카운트
  sql = mapper.sqlPostPageCount;
  var result3 = await modules.pg.query(sql);
  result3[0].currentPage = req.params.page;
  // result3[0].url = '?page=';

  res.render('index', { title: '홈', data: result, data_recommand: result2, data_pageInfo: result3});  
});

/* GET categories page. */
router.get('/categories/:category', async function(req, res) {
  let sql = mapper.sqlPostList +
          ` AND pcm.post_categories_idx = $1 
            order by p.idx desc;`;
  let values = [req.params.category];
  var result = await modules.pg.query(sql, values);

  // 포스트 페이지 카운트
  sql = mapper.sqlPostPageCount + 
         ` and pcm.post_categories_idx = $1`;
   
   req.params.page = (req.params.page !== undefined)?req.params.page:1;
   values = [req.params.page];
   var result2 = await modules.pg.query(sql, values);

   result2[0].currentPage = req.params.page;
   result2[0].url = 'categories/'+req.params.category+'/:page';
   
  res.render('categories', { title: '카테고리', data: result, data_pageInfo: result2});
});

router.get('/view/:post/:url_slug', async function(req, res) {
  // 포스트 상세
  let sql = mapper.sqlPostView;
  let values = [req.params.post];
  var result = await modules.pg.query(sql, values);
  
  // 연관 포스트
  sql = mapper.sqlPostList +
       `AND p.idx <> $1
        AND pcm.post_categories_idx = $2
        ORDER BY p.idx desc 
        LIMIT 2;`;
  values = [req.params.post, result[0].category_idx];
  var result2 = await modules.pg.query(sql, values);
  
  // 추천 포스트
  sql = mapper.sqlRecommandPost + 
        ` LIMIT 2`;
  var result3 = await modules.pg.query(sql);
  res.render('view', { title: '상세', data: result, data_relation: result2, data_recommand: result3});
});


module.exports = router;