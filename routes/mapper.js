// 카테고리 정보
let sqlCategory = 
`select pc.idx, pc.name. pc.name_ko from blog.post_categories pc`;

// 시간
let sqlInterval = 
`(select
    case when to_char(now(), 'yyyymmdd') = to_char(p.posting_date, 'yyyymmdd') then '오늘'
        else to_char(p.posting_date, 'yyyy. mm. dd')
        end 
  ) as dt_interval `;

// 포스트 목록
let sqlPostList = 
`select p.idx,
        pc.idx as category_idx, pc.name, pc.name_ko,
        p.title, regexp_replace(p.contents, E'<[^>]+>', '', 'gi') as contents, p.created_at, p.posting_date, p.audit_grant_start_date, p.audit_grant_end_date, p.is_visible,
        p.cover_image_url, p.url_slug, p.cover_type, p.cover_video_url, p.cover_image_urls, `
+ sqlInterval
+ ` from blog.posts as p, blog.posts_post_categories_map as pcm, blog.post_categories as pc
    where p.idx = pcm.posts_idx
    AND pc.idx = pcm.post_categories_idx
    AND p.is_visible = true `;

// 추천 포스트
let sqlRecommandPost = 
`SELECT
p.idx,
pc.idx as category_idx, pc.name, pc.name_ko, p.url_slug, p.cover_type, p.cover_video_url,
p.title, regexp_replace(p.contents, E'<[^>]+>', '', 'gi') as contents, p.cover_image_url, p.cover_image_urls, p.created_at, p.posting_date, p.audit_grant_start_date, p.audit_grant_end_date, p.is_visible,`
+ sqlInterval
+` FROM
    blog.posts as p, blog.posts_post_categories_map as pcm, blog.post_categories as pc, blog.post_recommends as pr
WHERE
    p.idx = pcm.posts_idx
    AND p.idx = pr.posts_idx
    AND pc.idx = pcm.post_categories_idx
ORDER BY pr.order_num ASC`;

// 포스트 페이지 카운트
let sqlPostPageCount = 
`SELECT
    CASE WHEN COUNT(1)%9 > 0 THEN (count(1)/9) + 1
        ELSE COUNT(1)/9
        END AS pageCnt
FROM
    blog.posts AS p, blog.posts_post_categories_map AS pcm, blog.post_categories AS pc
WHERE
    p.idx = pcm.posts_idx
    AND pc.idx = pcm.post_categories_idx
    AND p.is_visible = true`;

// 포스트상세
let sqlPostView = 
`SELECT
    p.idx,
    pc.idx as category_idx, pc.name, pc.name_ko,
    p.title, p.contents, p.created_at, p.posting_date, p.is_audit, p.audit_num_year, p.audit_num_month, p.audit_num_index, 
    (p.audit_grant_start_date || '~' || p.audit_grant_end_date) as audit_date, 
    p.is_visible, p.cover_image_url, p.cover_image_urls, p.url_slug, p.cover_type, p.cover_video_url, p.meta_title, p.meta_desc, p.meta_keywords,` 
   + sqlInterval 
   + ` FROM
        blog.posts as p, blog.posts_post_categories_map as pcm, blog.post_categories as pc
    where p.url_slug = $1
        and p.idx = pcm.posts_idx
        AND pc.idx = pcm.post_categories_idx`;


let sqlDirectRecommend =
`
SELECT
    c.idx as company_idx, c.name as company_name, c.logo_url,
    pdc.idx as category_idx, pdc.name as category_name,
    pd.idx, pd.name, pd.description, pd.url, pd.is_visible, pd.created_at
FROM
    insurance.product_direct as pd, insurance.product_direct_category as pdc, insurance.company as c,
    insurance.product_direct_recommend as pdr
WHERE
    pd.product_direct_category_idx = pdc.idx
    AND
    pd.company_idx = c.idx
    AND
    pd.idx = pdr.product_direct_idx
`;

let sqlDirectAll = 
`
SELECT
c.idx as company_idx, c.name as company_name, c.logo_url,
pdc.idx as category_idx, pdc.name as category_name, pdc.group_name as category_group_name,
pd.idx, pd.name, pd.description, pd.url, pd.is_visible, pd.created_at
FROM
insurance.product_direct as pd, insurance.product_direct_category as pdc, insurance.company as c
WHERE
is_deleted = false
AND
pd.product_direct_category_idx = pdc.idx
AND
pd.company_idx = c.idx
`;

exports.sqlCategory = sqlCategory;
exports.sqlInterval = sqlInterval;
exports.sqlPostList = sqlPostList;
exports.sqlRecommandPost = sqlRecommandPost;
exports.sqlPostPageCount = sqlPostPageCount;
exports.sqlPostView = sqlPostView;
exports.sqlDirectRecommend = sqlDirectRecommend;
exports.sqlDirectAll = sqlDirectAll;