// Extract every inline <script> block from index.html and syntax-check it.
// No code is executed; vm.Script only parses.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let m;
let count = 0;
let failed = 0;
while ((m = re.exec(html)) !== null) {
  const attrs = m[1] || '';
  if (/\bsrc\s*=/.test(attrs)) continue; // external script, nothing inline
  const typeMatch = attrs.match(/type\s*=\s*"([^"]*)"/i);
  if (typeMatch && !/^(text\/javascript|module)$/i.test(typeMatch[1])) continue; // e.g. JSON blocks
  const code = m[2];
  if (!code.trim()) continue;
  count++;
  try {
    new vm.Script(code, { filename: `inline-${count}.js` });
  } catch (scriptErr) {
    try {
      // Fall back to module parsing (import/export syntax).
      new vm.SourceTextModule(code, { identifier: `inline-${count}.mjs` });
    } catch {
      failed++;
      console.error(`inline script #${count}: ${scriptErr.message}`);
    }
  }
}
console.log(`checked ${count} inline script(s), ${failed} failed`);
if (count === 0 || failed > 0) process.exit(1);
