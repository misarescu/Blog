import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import type { APIRoute } from "astro";
const parser = new MarkdownIt();

export const GET: APIRoute = async function ({ site }) {
  const posts = await getCollection("posts");
  return rss({
    title: "xMishu's blog",
    description: "A simple dev writing his own thoughts and processes online",
    site: site.toString(),
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      author: post.data.author,
      categories: post.data.tags,
      link: `/blog/${post.slug}`,
      content: sanitizeHtml(parser.render(post.body)),
    })),
    customData: `<language>en-uk</language>`,
  });
};
