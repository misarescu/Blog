import { z, defineCollection } from "astro:content";

const postsCollection = defineCollection({
  type: "content",

  // for rss the schema already contains the title, pub date and description with correct typess
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  posts: postsCollection,
};
