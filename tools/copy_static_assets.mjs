import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

if (!existsSync(dist)) {
  mkdirSync(dist, { recursive: true });
}

const extensionsToCopy = new Set([".pdf", ".mdx"]);

for (const fileName of readdirSync(root)) {
  if (extensionsToCopy.has(extname(fileName).toLowerCase())) {
    copyFileSync(join(root, fileName), join(dist, fileName));
  }
}

writeFileSync(join(dist, ".nojekyll"), "", "utf-8");

console.log("Copied PDF/MDX assets to dist and added .nojekyll");
