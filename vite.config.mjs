import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import remarkFrontmatter from "remark-frontmatter";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter],
      providerImportSource: "@mdx-js/react"
    }),
    react()
  ]
});
