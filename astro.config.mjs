import { defineConfig, passthroughImageService } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  image: {
    service: passthroughImageService(),
  },
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      wrap: true,
      // theme: "css-variables",
      experimentalThemes: {
        light: "material-theme-lighter",
        dark: "material-theme-palenight",
      },
    },
  },
  integrations: [
    tailwind({
      applyBaseStyles: true,
      nestings: true,
    }),
  ],
});
