// 카테고리 정보
let sqlCategory = 
`select pc.idx, pc.name. pc.name_ko from post_categories pc`;

// 시간
let sqlInterval = 
`(select
    case when now() - p.created_at < '10 minute' then '방금전'
        when now() - p.created_at < '1 hour' then EXTRACT(MINUTE from now() - p.created_at +'0 day') || '분전'
        when now() - p.created_at < '1 day' then EXTRACT(HOUR from now() - p.created_at +'0 day') || '시간전'
        when now() - p.created_at < '1 month' then EXTRACT(DAY from now() - p.created_at +'0 day') || '일전'
        else EXTRACT(MONTH from now() - p.created_at +'0 day') || '달전'
        end 
  ) as dt_interval `;

// 포스트 목록
let sqlPostList = 
`select p.idx,
        pc.idx as category_idx, pc.name, pc.name_ko,
        p.title, regexp_replace(p.contents, E'<[^>]+>', '', 'gi') as contents, p.created_at, p.posting_date, p.audit_grant_start_date, p.audit_grant_end_date, p.is_visible,
        p.cover_image_url,`
+ sqlInterval
+ ` from public.posts as p, public.posts_post_categories_map as pcm, public.post_categories as pc
    where p.idx = pcm.posts_idx
    AND pc.idx = pcm.post_categories_idx
    AND p.is_visible = true `;

// 추천 포스트
let sqlRecommandPost = 
`SELECT
p.idx,
pc.idx as category_idx, pc.name, pc.name_ko,
p.title, regexp_replace(p.contents, E'<[^>]+>', '', 'gi') as contents, p.cover_image_url, p.created_at, p.posting_date, p.audit_grant_start_date, p.audit_grant_end_date, p.is_visible,`
+ sqlInterval
+` FROM
    public.posts as p, public.posts_post_categories_map as pcm, public.post_categories as pc, public.post_recommends as pr
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
    public.posts AS p, public.posts_post_categories_map AS pcm, public.post_categories AS pc
WHERE
    p.idx = pcm.posts_idx
    AND pc.idx = pcm.post_categories_idx
    AND p.is_visible = true`;

// 포스트상세
let sqlPostView = 
`SELECT
    p.idx,
    pc.idx as category_idx, pc.name, pc.name_ko,
    p.title, p.contents, p.created_at, p.posting_date, p.audit_grant_start_date, p.audit_grant_end_date, p.is_visible,
    p.cover_image_url,` 
   + sqlInterval 
   + ` FROM
        public.posts as p, public.posts_post_categories_map as pcm, public.post_categories as pc
    where p.idx = $1
        and p.idx = pcm.posts_idx
        AND pc.idx = pcm.post_categories_idx`;


exports.sqlCategory = sqlCategory;
exports.sqlInterval = sqlInterval;
exports.sqlPostList = sqlPostList;
exports.sqlRecommandPost = sqlRecommandPost;
exports.sqlPostPageCount = sqlPostPageCount;
exports.sqlPostView = sqlPostView;