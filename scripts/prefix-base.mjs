// GitHub Pages serves this project site under /imt-test-screwfast/, but upstream writes some
// links as root paths (href="/products"). Prefix them in the built HTML so the live site works.
// Test-site change for the Insites Migration Tool; not part of upstream ScrewFast.
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = '/imt-test-screwfast';
const ATTR = /\b(href|src|action)="\/(?!\/|imt-test-screwfast\/|imt-test-screwfast")/g;

async function* walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

let files = 0;
for await (const f of walk('dist')) {
  const html = await fs.readFile(f, 'utf8');
  const out = html.replace(ATTR, `$1="${BASE}/`);
  if (out !== html) {
    await fs.writeFile(f, out);
    files++;
  }
}
console.log(`prefixed root links in ${files} files`);
