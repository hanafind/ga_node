// 카테고리 정보
let sqlCategory = 
`select pc.idx, pc.name. pc.name_ko from blog.post_categories pc`;

// 시간
let sqlInterval = 
`(select
    case when now() - p.posting_date < '10 minute' then '방금전'
        when now() - p.posting_date < '1 hour' then EXTRACT(MINUTE from now() - p.posting_date) || '분전'
        when now() - p.posting_date < '1 day' then EXTRACT(HOUR from now() - p.posting_date) || '시간전'
        when now() - p.posting_date < '31 day' then EXTRACT(DAY from now() - p.posting_date) || '일전'
        else EXTRACT(MONTH from now() - p.posting_date +'1 month') || '달전'
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
    p.title, p.contents, p.created_at, p.posting_date, p.is_audit, p.audit_num_index, 
    (p.audit_grant_start_date || '~' || p.audit_grant_end_date) as audit_date, 
    p.is_visible, p.cover_image_url, p.url_slug, p.cover_type, p.cover_video_url, p.meta_title, p.meta_desc, p.meta_keywords,` 
   + sqlInterval 
   + ` FROM
        blog.posts as p, blog.posts_post_categories_map as pcm, blog.post_categories as pc
    where p.url_slug = $1
        and p.idx = pcm.posts_idx
        AND pc.idx = pcm.post_categories_idx`;


exports.sqlCategory = sqlCategory;
exports.sqlInterval = sqlInterval;
exports.sqlPostList = sqlPostList;
exports.sqlRecommandPost = sqlRecommandPost;
exports.sqlPostPageCount = sqlPostPageCount;
exports.sqlPostView = sqlPostView;