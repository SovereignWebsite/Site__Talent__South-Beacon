import { readFileSync, writeFileSync } from 'node:fs';
import { META } from './profile.mjs';
const f = new URL('../site/introduction/index.html', import.meta.url);
let s = readFileSync(f, 'utf8');
if (!s.includes('og:url')) s = s.replace('<title>Request an introduction</title>\n', `<title>Request an introduction</title>\n<meta name="description" content="Request an introduction to South Beacon, through the talent agent.">\n<meta name="robots" content="noindex">\n${META('introduction/', 'Request an introduction: South Beacon')}\n`);
writeFileSync(f, s);
