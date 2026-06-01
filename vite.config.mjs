import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkGfm],
      providerImportSource: "@mdx-js/react"
    }),
    react()
  ]
});
