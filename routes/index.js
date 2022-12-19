var express = require('express');
var router = express.Router();
var modules = require('../modules');


/* GET home page. */
router.get('/', async function(req, res) {
  let sql = sqlPostList + ` order by p.created_at desc;`;
  
  let values = [];          
  var result = await modules.pg.query(sql, values);
  
  sql = sqlPostList +
       ` where idx in (1,2,3) 
         order by p.created_at desc;`;
  var result2 = await modules.pg.query(sql, values);
  
  res.render('index', { title: '홈', data: result, data_recommand: result2});
  
});

/* GET categories page. */
router.get('/categories', async function(req, res) {
  let sql = sqlPostList +
          ` where p.post_categories_idx = $1 
            order by p.created_at desc`;
  let values = [req.query.idx];
  var result = await modules.pg.query(sql, values);
  res.render('categories', { title: '카테고리', data: result });
});

/* GET view page. */
router.get('/view', async function(req, res) {
  let sql = `select p.*, ` +
             sqlCateName +
             sqlInterval +
            ` from posts p 
             where idx = $1`;
  let values = [req.query.idx];
  var result = await modules.pg.query(sql, values);
  res.render('view', { title: '상세', data: result});
});

module.exports = router;

// 카테고리 한글명
let sqlCateName = `(select name_ko 
                      from post_categories pc 
                      where pc.idx = p.post_categories_idx) cate_name,`;

// 시간
let sqlInterval = `(select 
                      case when now() - p.created_at < '10 minute' then '방금전'
                          when now() - p.created_at < '1 hour' then EXTRACT(MINUTE from now() - p.created_at +'0 day') || '분전'
                          when now() - p.created_at < '1 day' then EXTRACT(HOUR from now() - p.created_at +'0 day') || '시간전'
                          when now() - p.created_at < '1 month' then EXTRACT(DAY from now() - p.created_at +'0 day') || '일전'
                          else EXTRACT(MONTH from now() - p.created_at +'0 day') || '달전'
                          end 
                    ) as dt_interval `;

// 포스트 목록
let sqlPostList = `select p.idx,
                          p.title,
                          regexp_replace(p.contents, E'<[^>]+>', '', 'gi') contents,
                          p.cover_image_path,
                          p.created_at,`
                        + sqlCateName
                        + sqlInterval
                        + ` from posts p`;


