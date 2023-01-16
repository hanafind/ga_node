const RSS = require('rss');

const generateFullContentFeed = async(data)=>{
    const newFeed = new RSS({
      title: '하나금융파인드 하나공감',
      description: '하나금융파인드 공식 블로그, 하나공감',
      feed_url: 'https://insure.hanafind.com/rss.xml',
      site_url: 'https://insure.hanafind.com',
      pubDate: new Date(),
    });
    for(const item of data) {
        newFeed.item({
            title: item.title,
            description: item.contents,
            url: 'https://insure.hanafind.com/blog/article/'+item.url_slug,
            guid: 'https://insure.hanafind.com/blog/article/'+item.url_slug,
            categories: [item.name],
            author: '하나금융파인드',
            date: item.posting_date,
            })
    }
  return newFeed;
  };

module.exports = {
    generateFullContentFeed: generateFullContentFeed
}