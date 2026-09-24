/**
 * Checks every link and asset reference in the site.
 *
 * - Local files referenced by href/src must exist on disk.
 * - In-page anchors (#id) must match an element id on the page.
 * - External links must use https.
 *
 * Exits with code 1 and prints every problem it found.
 * Run with: node scripts/check-links.mjs
 */

import { readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pages = ["index.html", "404.html"];
const problems = [];

/** Collects href="..." and src="..." values, keeping their order in the file. */
function references(html) {
  return [...html.matchAll(/(?:href|src)\s*=\s*"([^"]+)"/g)].map((m) => m[1]);
}

/** Collects id="..." values so in-page anchors can be verified. */
function ids(html) {
  return new Set([...html.matchAll(/\bid\s*=\s*"([^"]+)"/g)].map((m) => m[1]));
}

/** Resolves a site-relative or page-relative reference to a path on disk. */
function toDiskPath(page, ref) {
  const withoutQuery = ref.split(/[?#]/)[0];
  if (withoutQuery === "") return null;
  return ref.startsWith("/")
    ? join(root, withoutQuery.slice(1))
    : join(root, dirname(page), withoutQuery);
}

for (const page of pages) {
  const file = join(root, page);
  if (!existsSync(file)) {
    problems.push(`${page}: page is missing`);
    continue;
  }

  const html = readFileSync(file, "utf8");
  const pageIds = ids(html);

  for (const ref of references(html)) {
    if (/^(mailto:|tel:|data:)/.test(ref)) continue;

    if (/^https?:\/\//.test(ref)) {
      if (ref.startsWith("http://")) problems.push(`${page}: ${ref} uses http, expected https`);
      continue;
    }

    if (ref.startsWith("#")) {
      const anchor = ref.slice(1);
      if (anchor && !pageIds.has(anchor)) problems.push(`${page}: anchor ${ref} has no matching id`);
      continue;
    }

    const target = toDiskPath(page, ref);
    if (!target) continue;
    if (!existsSync(target)) {
      problems.push(`${page}: ${ref} does not exist`);
    } else if (statSync(target).size === 0) {
      problems.push(`${page}: ${ref} is an empty file`);
    }
  }
}

for (const required of ["robots.txt", "sitemap.xml", ".nojekyll", "assets/img/og-image.png"]) {
  if (!existsSync(join(root, required))) problems.push(`${required} is missing`);
}

if (problems.length > 0) {
  console.error(`Found ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`All links and assets in ${pages.join(", ")} resolve correctly.`);
