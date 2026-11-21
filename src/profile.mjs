// Builds the five South Beacon designs from one content source. Draft only; nothing here is in a repository.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'site');
const FAMILY = readFileSync(join(HERE, 'family.html'), 'utf8');
const FAMILY_CSS = readFileSync(join(HERE, 'family.css'), 'utf8');
const ORIGIN = 'https://south-beacon.talent.sovereignweb.site';
export const META = (path, title = 'South Beacon') => `<meta property="og:type" content="website">
<meta property="og:site_name" content="South Beacon">
<meta property="og:locale" content="en_GB">
<meta property="og:url" content="${ORIGIN}/${path}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="An anonymised profile of a senior technology and security leader. Introductions through the talent agent.">
<meta property="og:image" content="${ORIGIN}/assets/share/card-1200x630.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="South Beacon">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="An anonymised profile of a senior technology and security leader. Introductions through the talent agent.">
<meta name="twitter:image" content="${ORIGIN}/assets/share/card-1200x630.jpg">
<link rel="canonical" href="${ORIGIN}/${path}">`;

// Content: Dinis's verbatim text, with the softer products line until he chooses.
const C = {
  code: 'South Beacon',
  headline: 'Senior Technology &amp; Risk Leader',
  specialisms: ['Cyber resilience', 'Security engineering', 'Enterprise architecture', 'Product and platform leadership'],
  label: 'Anonymised executive profile',
  summary: "Senior technology and security leader with more than 20 years' experience across enterprise platforms, digital services, cloud and operational technology (OT). Built on an early career in critical-infrastructure consulting to lead security engineering, architecture and platform delivery in a large enterprise. Combines hands-on engineering experience with executive advice on technology risk, investment and incident response.",
  achTitle: 'Selected achievements across consulting and enterprise leadership',
  ach: [
    ['Security architecture and team leadership', 'Led client engagements in security architecture and operations, then expanded an enterprise security architecture team and established secure-development governance. Line-managed senior specialists and helped grow a security function.'],
    ['Security platforms and products', 'Led internal security tooling for incident response and risk management.'],
    ['Engineering and assurance', 'Directed security monitoring and vulnerability management in industrial environments, and introduced secure-development and cloud security controls across a substantial software estate.'],
    ['Cyber resilience and incident leadership', 'Advised industrial clients on control-system risk and operational resilience. Led technical analysis and response during security incidents.'],
    ['Investment and executive advice', 'Guided senior clients through IT and OT transformation decisions and advised enterprise security executives on material risks and investment priorities. Led the technical evaluation for a major security investment. Managed security supplier relationships, non-staff budgets and forecasts.'],
  ],
  looking: [['Role', 'A new role']],
  notice: "This profile is anonymised. Introductions are made through the talent agent, and only with the candidate's agreement.",
};

const DESIGNS = [
  ['', 'The Brief'], ['designs/beacon/', 'The Beacon'], ['designs/dossier/', 'The Dossier'],
  ['designs/scorecard/', 'The Scorecard'], ['designs/letter/', 'The Letter'],
];

// The Letter: the same facts as the profile, in the candidate's voice (Dinis, 21 November 2026: "you can write it
// what you think is his voice"). Nothing here that the profile text does not already say.
const LETTER = `<p>To the hiring board,</p>
<p>I am a senior technology and security leader with more than 20 years' experience across enterprise platforms, digital services, cloud and operational technology. I began in critical-infrastructure consulting, and went on to lead security engineering, architecture and platform delivery in a large enterprise. I bring hands-on engineering experience together with executive advice on technology risk, investment and incident response.</p>
<p>A few things I have done:</p>
<ul class="ach">
<li>I led client engagements in security architecture and operations, then expanded an enterprise security architecture team and established secure-development governance. I line-managed senior specialists and helped grow a security function.</li>
<li>I led internal security tooling for incident response and risk management.</li>
<li>I directed security monitoring and vulnerability management in industrial environments, and introduced secure-development and cloud security controls across a substantial software estate.</li>
<li>I advised industrial clients on control-system risk and operational resilience, and led technical analysis and response during security incidents.</li>
<li>I guided senior clients through IT and OT transformation decisions and advised enterprise security executives on material risks and investment priorities. I led the technical evaluation for a major security investment, and managed security supplier relationships, non-staff budgets and forecasts.</li>
</ul>
<p>I am looking for a new role. If you have one in mind, my agent can introduce us, with my agreement.</p>
<p>Yours,</p>
<p class="sign">South Beacon</p>`;

const BEACON_SVG = (cls = '') => `<svg class="beacon ${cls}" viewBox="0 0 120 160" aria-hidden="true" focusable="false">
<g class="sweep"><path d="M60 40 L0 10 L0 70 Z" /><path d="M60 40 L120 10 L120 70 Z" /></g>
<rect x="48" y="30" width="24" height="20" rx="3" class="lamp"/><path d="M44 52 h32 l-6 96 h-20 Z" class="tower"/><rect x="36" y="146" width="48" height="8" class="tower"/></svg>`;

let UP = './';
const CTA = (txt = 'Request an introduction') => `<a class="cta" href="${UP}introduction/">${txt}</a>`;
const specs = () => `<ul class="specs">${C.specialisms.map((s) => `<li>${s}</li>`).join('')}</ul>`;
const looking = () => `<section class="looking" aria-labelledby="lk"><h2 id="lk">What the candidate is looking for</h2><table><tbody>${C.looking.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody></table></section>`;
const intro = () => `<section id="introduction" class="intro" aria-labelledby="in"><h2 id="in">Request an introduction</h2><p>${C.notice}</p><p><a class="cta" href="${UP}introduction/">Open the sealed request form</a></p></section>`;

function page(path, name, body, cls) {
  const depth = path.split('/').filter(Boolean).length;
  const up = depth ? '../'.repeat(depth) : './';
  const chooser = DESIGNS.map(([p, n]) => `<li><a href="${up}${p}"${p === path ? ' aria-current="page"' : ''}>${n}</a></li>`).join('');
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>South Beacon</title>
<meta name="description" content="An anonymised profile of a senior technology and security leader. Introductions through the talent agent.">
${META(path)}
<link rel="stylesheet" href="${up}assets/site.css">
</head>
<body class="${cls}">
<a class="skip" href="#main">Skip to the profile</a>
${FAMILY}
<details class="chooser"><summary>Choose a design <span class="now">(${name})</span></summary><nav aria-label="Designs"><ul>${chooser}</ul></nav></details>
<main id="main">
${body}
</main>
<footer><nav class="site-links" aria-label="About this site"><a href="/start/">Start here</a><span aria-hidden="true"> · </span><a href="/agents/">Use with your AI</a><span aria-hidden="true"> · </span><a href="/admin/">How this site was made</a><span aria-hidden="true"> · </span><a href="${up}designs/">All designs</a></nav></footer>
</body>
</html>
`;
}

const achList = (ol = true) => `<${ol ? 'ol' : 'ul'} class="ach">${C.ach.map(([t, d]) => `<li><strong>${t}.</strong> ${d}</li>`).join('')}</${ol ? 'ol' : 'ul'}>`;

const bodies = {
  'The Brief': () => `<div class="brief">
<aside class="brief-left"><p class="boxed">Confidential candidate profile</p><p class="wordmark">${C.code}</p><h1>${C.headline}</h1>${specs()}<p class="label">${C.label}</p>${CTA()}</aside>
<div class="brief-right"><p class="summary">${C.summary}</p><h2>${C.achTitle}</h2>${achList(true)}${looking()}${intro()}</div></div>`,

  'The Beacon': () => `<header class="hero">${BEACON_SVG()}<p class="wordmark">${C.code}</p><h1>${C.headline}</h1>${specs()}<p class="label">${C.label}</p>${CTA()}</header>
<p class="summary">${C.summary}</p><h2>${C.achTitle}</h2>
<ul class="signals">${C.ach.map(([t, d], i) => `<li><span class="sig" aria-hidden="true">${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ul>
${looking()}${intro()}${CTA()}`,

  'The Dossier': () => `<header class="cover"><p class="stencil">${C.code}</p><p class="label">${C.label}</p><a class="open" href="#cards">Open the file</a><br>${CTA()}</header>
<div id="cards" class="cards">
<section class="card"><h1>${C.headline}</h1>
<dl class="withheld">${['Name', 'Employers', 'Clients', 'Dates', 'Location'].map((k) => `<div><dt>${k}</dt><dd><span class="bar" aria-hidden="true"></span> <span class="w">(withheld)</span></dd></div>`).join('')}</dl>
${specs()}<p>${C.summary}</p>${CTA()}</section>
<section class="card"><h2>${C.achTitle}</h2>${achList(true)}</section>
<section class="card">${looking()}</section>
<section class="card">${intro()}</section></div>`,

  'The Scorecard': () => `<header class="sc-head"><p class="wordmark">${C.code}</p><h1>${C.headline}</h1><p class="label">${C.label}</p>${CTA()}</header>
<section aria-labelledby="cap"><h2 id="cap">Capabilities</h2>${specs()}</section>
<p class="summary">${C.summary}</p>
<section aria-labelledby="ac"><h2 id="ac">${C.achTitle}</h2><ul class="tiles">${C.ach.map(([t, d]) => `<li><h3>${t}</h3><p>${d}</p></li>`).join('')}</ul></section>
<section class="looking" aria-labelledby="fit"><h2 id="fit">Fit checklist</h2><p class="hint">Tick what matches your role. Nothing is sent; this stays in your browser.</p><ul class="fit">${C.looking.map(([k, v], i) => `<li><input type="checkbox" id="f${i}"><label for="f${i}"><strong>${k}:</strong> ${v}</label></li>`).join('')}</ul></section>
${intro()}`,

  // Framed from Dinis's verbatim text only, no added claims. Needs Dinis's approval before it goes live.
  'The Letter': () => `<article class="letter"><p class="wordmark">${C.code}</p><h1>${C.headline}</h1><p class="label">${C.label}</p>${CTA()}
${LETTER}</article>${intro()}`,
};

const CSS = `:root{--ink:#0E1A24;--paper:#F5F3EE;--amber:#E0A040;--amber-text:#865710;--line:#d8d3c8;--bg:var(--paper);--fg:var(--ink);--accent:var(--amber-text)}
@media (prefers-color-scheme:dark){:root{--bg:var(--ink);--fg:var(--paper);--accent:var(--amber);--line:#2c3a46}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--fg);font:1rem/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:0 16px}
main{max-width:64rem;margin:0 auto;padding:1.5rem 0}
h1,h2,h3,.wordmark,.stencil{font-family:Georgia,"Times New Roman",serif;line-height:1.2}
.wordmark{font-size:2.2rem;letter-spacing:.04em;margin:.2rem 0;color:var(--accent)}
.label{font-style:italic;opacity:.85}
.specs{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:.4rem}.specs li{border:1px solid var(--line);border-radius:99px;padding:.1rem .7rem;font-size:.9rem}
.cta{display:inline-block;background:var(--amber);color:var(--ink);font-weight:600;padding:.7rem 1.2rem;border-radius:6px;text-decoration:none;margin:.5rem 0}
.cta:focus-visible,a:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
a{color:var(--accent)}
table{border-collapse:collapse;width:100%}th,td{text-align:left;padding:.4rem;border-bottom:1px solid var(--line);vertical-align:top}
.form-slot{border:1px dashed var(--line);padding:1rem;border-radius:6px}
.skip{position:absolute;left:-999px}.skip:focus{left:16px;top:8px;background:var(--bg);padding:.4rem}
.chooser{font-size:.85rem;padding:.5rem 0;border-bottom:1px solid var(--line);margin-right:9rem}
.chooser summary{cursor:pointer;min-height:24px;color:var(--accent);font-weight:600}.chooser .now{font-weight:400;color:var(--fg)}
.chooser ul{list-style:none;display:flex;flex-wrap:wrap;gap:.4rem .9rem;padding:.5rem 0 0;margin:0}.chooser [aria-current]{font-weight:700}
.site-links{display:flex;flex-wrap:wrap;gap:.2rem .3rem}
.designs-list{list-style:none;padding:0;display:grid;gap:1rem}.designs-list li{border:1px solid var(--line);border-radius:6px;padding:1rem}
footer{max-width:64rem;margin:2rem auto;font-size:.85rem;border-top:1px solid var(--line);padding-top:1rem}.draft{font-weight:600}
/* The Brief */
.boxed{display:inline-block;border:1px solid currentColor;padding:.1rem .5rem;font-size:.75rem;letter-spacing:.12em;text-transform:uppercase}
@media (min-width:52rem){.brief{display:grid;grid-template-columns:40% 1fr;gap:2.5rem}.brief-left{position:sticky;top:1rem;align-self:start}}
@media print{.chooser,.cta,.form-slot,footer .draft{display:none}body{font-size:10pt}}
/* The Beacon */
.d-beacon{--bg:var(--ink);--fg:var(--paper);--accent:var(--amber);--line:#2c3a46;--family-fg:#c9c9c9;--family-fg-strong:#fff;--family-bg:#1c2731}
.beacon{width:12rem;max-width:100%;height:auto}.beacon .tower{fill:currentColor;opacity:.8}.beacon .lamp{fill:var(--amber)}
.beacon .sweep path{fill:var(--amber);opacity:.35;transform-origin:60px 40px;animation:sweep 6s ease-in-out infinite alternate}
@keyframes sweep{from{transform:scaleX(.3)}to{transform:scaleX(1)}}
@media (prefers-reduced-motion:reduce){.beacon .sweep path{animation:none}}
.hero{text-align:center;padding:2rem 0}.hero .specs{justify-content:center}
.signals{list-style:none;padding:0;display:grid;gap:1rem}@media (min-width:52rem){.signals{grid-template-columns:repeat(2,1fr)}}
.signals li{border-left:3px solid var(--amber);padding-left:1rem}.sig{font-family:Georgia,serif;color:var(--amber)}
/* The Dossier */
.d-dossier .cover{background:#d9c49a;color:var(--ink);padding:3rem 1rem;text-align:center;border-radius:4px}
.d-dossier .cover a{color:var(--ink)}
.withheld{display:grid;gap:.3rem;margin:1rem 0;font-size:.95rem}.withheld div{display:flex;gap:.8rem;align-items:center;flex-wrap:wrap}
.withheld dt{min-width:6.5rem;font-weight:600}.withheld dd{margin:0;display:flex;gap:.5rem;align-items:center}
.bar{display:inline-block;width:8rem;height:.95em;background:var(--fg);border-radius:1px}.w{font-size:.85rem;font-style:italic}
.stencil{font-size:2.4rem;letter-spacing:.2em;text-transform:uppercase;margin:0}
.cards{display:grid;gap:1.2rem;margin-top:1.5rem}.card{background:var(--bg);border:1px solid var(--line);border-top:6px solid var(--amber);padding:1rem 1.2rem;border-radius:4px}
/* The Scorecard */
.tiles{list-style:none;padding:0;display:grid;gap:1rem}@media (min-width:44rem){.tiles{grid-template-columns:repeat(2,1fr)}}
.tiles li{border:1px solid var(--line);border-radius:6px;padding:1rem}.fit{list-style:none;padding:0}.fit li{padding:.3rem 0;display:flex;gap:.6rem;align-items:flex-start}.fit input{width:24px;height:24px;flex:none;margin:0}.hint{font-size:.9rem}
/* The Letter */
.letter{max-width:40rem;margin:0 auto;font-family:Georgia,"Times New Roman",serif;font-size:1.08rem}
.sign{font-style:italic;font-size:1.4rem;color:var(--accent)}
.d-letter .intro{max-width:40rem;margin:2rem auto 0}
`;

for (const [p, n] of DESIGNS) {
  const dir = join(OUT, p);
  mkdirSync(dir, { recursive: true });
  UP = p ? '../'.repeat(p.split('/').filter(Boolean).length) : './';
  const cls = 'd-' + n.split(' ')[1].toLowerCase();
  writeFileSync(join(dir, 'index.html'), page(p, n, bodies[n](), cls));
}
{
  const blurbs = { 'The Brief': 'A confidential one-page brief. Prints to one page.', 'The Beacon': 'Dark, with the beacon at the centre.', 'The Dossier': 'A plain folder of index cards, with what is withheld blacked out.', 'The Scorecard': 'Capabilities, outcomes and a fit checklist.', 'The Letter': 'The same profile, as a letter in the candidate\'s voice.' };
  const list = DESIGNS.map(([p, n]) => `<li><h2><a href="../${p}">${n}</a></h2><p>${blurbs[n]}</p></li>`).join('');
  writeFileSync(join(OUT, 'designs/index.html'), page('designs/', 'All designs', `<p class="wordmark">${C.code}</p><h1>The five designs</h1><p>The same profile, in five designs. Every design carries the same words.</p><ul class="designs-list">${list}</ul>`, 'd-index'));
}
mkdirSync(join(OUT, 'assets'), { recursive: true });
writeFileSync(join(OUT, 'assets/site.css'), CSS + FAMILY_CSS);
console.log('built', DESIGNS.length, 'designs into', OUT);
