---
title: "My First Blog Post"
description: "This is a test post to check how a post looks like"
author: "xMischu"
image:
  {
    url: "https://static01.nyt.com/images/2022/04/04/multimedia/15ai-nocode/15ai-nocode-videoSixteenByNineJumbo1600.jpg",
    alt: "the image was eaten by the internet void",
  }
tags: ["general"]
pubDate: 2024-04-13
---

## Important notes

---

### Content storage

This page is stored inside first-post.md in the content/posts directory. It has a definded collection using zod typescript schema and all posts must follow it. Because of astro the whole thing is really easy as the name of the markdown file is the same as the url path to the post, this make handling post collections really easy as I just need to write the posts in the content/posts directory and it automagically is online!

```typescript
const postsCollection = defineCollection({
  type: "content",
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
```

### Blog layout
