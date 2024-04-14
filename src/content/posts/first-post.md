---
title: "My First Blog Post"
description: "This is a test post to check how a post looks like"
author: "xMischu"
image:
  {
    url: "/images/first-post/CodePicture.jpeg",
    alt: "the image was eaten by the internet void",
  }
tags: ["general", "tech", "astro", "javascript", "typescript"]
pubDate: 2024-04-13
---

## Goal of the blog

This website/blog is meant to be a public journal where I'll put my thoughts into written form in case it needs to be referenced and shared later.
This is also useful to build a personal brand and have past work be easily presentable in a quick fashion. Having something cool to write for the blog could be also a good motivator to keep thinkering with new projects/concepts.

Ok now that we got the boring intro stuff out of the way we can get right into the meat and potatoes of how this blog is put together.

## Overal Architecture

For this adventure I decided to play it risky and build this on a technology I had no idea how it works, which is [Astro](https://astro.build). I just had an overall idea that it is this new cool kid on the block when it comes to Javascript frameworks. I knew it has collections that can generate pages from markdown, which is handy for a project like this where most of the time the content is just thext that needs to be rendered in a nice format, but you don't want to write html tags all over the place or implement a custom data format. So markdown it is.

As far as architecting goes this bad boy is hosted on [Vercel](https://vercel.com), the content you see is stored in the code repo(i know, this is not ideal, but for a first draft with a few posts it'll do just fine) and that's kinda it. I guess for this post I'll talk about what I found interesting about Astro, how it integrates with [Tailwind](http://tailwindcss.com) and [Markdown](https://en.wikipedia.org/wiki/Markdown), how collections work and maybe discuss about the documentation of all of this.

### Astro and Javascript

This is one of many fullstack JS frameworks that enables you to build your app from frontend to backend. Now this is a bold statement as Astro, at the time I started writing this site, was more focused on shipping 0 JS to the client and having as much stuff statically generated as possible. That was kinda the main reason I gave it a chance in the first place, as having a very heavy SPA delivered to you or have a very sophisticated mechanism to do SSR, SSG and ISR just to read some text and see some images would be overkill.
Nowadays you can overkill an Astro app too if you want!

Now that sounds awesome, but the templating and the server side logic is done in Javascript. For that astro developed the .astro files that seem inspired from .vue. Let's talk about it with an example

```astro
---
// Your component script here!
import Banner from '../components/Banner.astro';
import ReactPokemonComponent from '../components/ReactPokemonComponent.jsx';
const myFavoritePokemon = [/* ... */];
const { title } = Astro.props;
---
<!-- HTML comments supported! -->
{/* JS comment syntax is also valid! */}

<Banner />
<h1>Hello, world!</h1>

<!-- Use props and other variables from the component script: -->
<p>{title}</p>

<!-- Include other UI framework components with a `client:` directive to hydrate: -->
<ReactPokemonComponent client:visible />

<!-- Mix HTML with JavaScript expressions, similar to JSX: -->
<ul>
  {myFavoritePokemon.map((data) => <li>{data.name}</li>)}
</ul>

<!-- Use a template directive to build class names from multiple strings or even objects! -->
<p class:list={["add", "dynamic", {classNames: true}]} />
```

Here we see some elements that are very clever. The code is structured in 2 regions, very clean and easy to read. We have in the upper part, indicated by containing the code with ---, the javascript part where we do imports, variables, functions and other jaavscript stuff. The bottom part is the html template that has a lot going on. The very first tag is a Component from another .astro file. We see some mustache templating by wrapping js parts in html with {}, and most interestingly we see a React component used!
Now this is one of the coolest features of the framework, the ability to integrate components from other frameworks with what they call [Islands Architecture.](https://docs.astro.build/en/concepts/islands/)

Here are some links if you're interested in the supported integrations Astro has:

- [UI frameworks](https://docs.astro.build/en/guides/framework-components/)
- [SSR Adapters](https://docs.astro.build/en/guides/server-side-rendering/)
- [List of all intergrations](https://astro.build/integrations/)

### Project structure

<!-- ![Project structure](/images/first-post/ProjectStructure.png) -->

```md
.
├── public
│  
├── src
│   ├── components
│   ├── content
│   ├── layouts
│   ├── pages
│   ├── utils
│   ├── base.css
│   └── env.d.ts
├── README.md
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.mjs
└── tsconfig.json
```

Astro follows a pretty standard structure. From this we see there is support for file based routing indicated by the pages directory and also layouts. This makes it easy to jump into it as it has similar concepts to [NextJS](https://nextjs.org), which is very influential. In my case I added a content directory where the markdown of the blog posts lives.

### Content storage

All posts are in src/content/posts where they are defined as a [collection](https://docs.astro.build/en/guides/content-collections/). Markdown collections can have [Zod](https://zod.dev) schemas defined and all content with that definition has to follow the same structure. As an example this is the schema for this blog post

```typescript
// config.ts
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

One important note is that we're not limited to one schema. There can be multiple collections and schema definitions. In the future I may create new collections for the projects and topics pages.

### Markdown and html generation

Now that the content and schema are defined let's talk about how it gets rendered into this page you're reading right now.
There are a few steps until we unwrap that though, we have some steps to go through.

#### First step: Frontmatter

Astro comes with frontmatter out of the box. One could say they were inspired heavily by frontmatter syntax 😂. With this the posts can comply with the schema defined by zod and it is useful to have aditional data and metadata for working with the posts in JS

#### Second step: Slugs

Because of the file based routing, we have support for path slugs. This allows to have dynamic routes based on the name of the markdown file in src/content/posts. Those with keen eyes probably spotted the route of this page is /blog/first-post, which matches the name of first-post.md previously mentioned. I'll let you read heare more about [File based routing](https://docs.astro.build/en/guides/routing/) and how it works in Astro.

#### Third step: Giving users some links

For this we need a basic page where we show posts to the user in a cards on a grid format and then we link them to the corresponding slugs. That is where we use the collections api in an interesting way becasue we fetch all the posts and display them in a fashion that resembles mapping through a list of REST resources, but we don't have any requests done to achieve this, everything is on the server before it goes to the client. The code is very short but achieves the desired effect easily

```astro
---
import PostCard from "@components/PostCard.astro";
import GlobalLayout from "@layouts/GlobalLayout.astro";
import GridLayout from "@layouts/GridLayout.astro";
import { getCollection } from "astro:content";

const posts = await getCollection("posts");
---

<GlobalLayout>
  <section id="title" class="text-center">
    <h1>Blog posts</h1>
  </section>
  <br />
  <GridLayout>
    {
      posts.map((post) => (
        <PostCard
          postLink={"/blog/" + post.slug}
          imgSrc={post.data.image.url}
          imgAlt={post.data.image.alt}
          title={post.data.title}
          preview={post.data.description.substring(0, 250)}
        />
      ))
    }
  </GridLayout>
</GlobalLayout>
```

#### Fourth step: PostLayout

Here we have a boring and an interesting part. The boring one is setting up some layout to show the title, description, author date from the frontmatter. This is trivial as they are props to our page and we don't have much issues.

The interesting part comes in generating the html from the markdown and showing it correctly! Why is that? Because if you look closely to the project structure image, I use tailwind for my css. Tailwind is a a blessign most of the time, but here it gave me some troubles! The reas is that by default it strips the page from all styling! And I mean **ALL** styling, all h1-h6 and p tags look the same. There is this interesgin read [here](https://tailwindcss.com/docs/preflight#) about this subject. Usually this is not that big of a deal because I do something like this

```html
<h1 class="text-2xl">Heading1</h1>
<h2 class="text-xl">Heading2</h2>
<h3 class="text-lg">Heading3</h3>
<!-- and so on -->
```

Here the problem arrives by having the html generated, so I cannot do this! I have two solutions that I can think of:

1. Configure the frontmatter api to generate custom html components that are wrappers to the primitives
2. Use a tailwind plugin to style the html in a cohesive way really fast

Naturally I went with solution 2 and installed the [Typography](https://tailwindcss.com/docs/plugins#typography) plugin, some prose classes later and now I have a working blog post with good styling!
All good until I did a code example. The themeing was not there, there was a static theme for bogh light and dark mode which did not fit either. This was not Tailwind's fault, it was from Astro. Turns out it comes with a code formatter named [Shiki.](https://shiki.style)This is very cool and it has nice themes, light and dark variants and supports dual themeing, exactly what my use case needs. The problem here is the slight mismatch of the documentations, in the Shiki docs we have this example

```javascript
import { codeToHtml } from "shiki";

const code = await codeToHtml('console.log("hello")', {
  lang: "javascript",
  themes: {
    light: "min-light",
    dark: "nord",
  },
});
```

however, in order to make it work in the astro config without installing other plugins, the themes field needs to have a different name

```javascript
export default defineConfig({
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      wrap: true,
      experimentalThemes: {
        light: "material-theme-lighter",
        dark: "material-theme-palenight",
      },
    },
  },
});
```

After 1 hour of trying to figure out why the themes don't switch, finally the page is complete 🥳

## Closing thoughts

After all that journey from just hearing about a new framework to deploying a functional website with it I learned that even if the puzzle pieces fit together nicely, sometimes one or two are missing and you have to get creative when solving it. I hope you found this information useful and learned something new. If you didn't, well then I hope you had fun reading about my struggles with CSS 😅

---

---

---
