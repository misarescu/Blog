import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("posts");
  return rss({
    title: "xMishu's blog",
    description: "A simple dev writing his own thoughts and processes online",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      author: post.data.author,
      categories: post.data.tags,
      link: `/blog/${post.slug}`,
    })),
    customData: `<language>en-uk</language>`,
  });
}
