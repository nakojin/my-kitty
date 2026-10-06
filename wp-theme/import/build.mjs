// 프로토타입 데이터(public/proto/data/*.js) → 워드프레스 가져오기용 CSV.
// 실행: node wp-theme/import/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
globalThis.window = {};
for (const f of ['worlds', 'figures', 'rankings']) {
  new Function(readFileSync(join(root, 'public/proto/data', f + '.js'), 'utf8'))();
}
const { MK_WORLDS, MK_FIGURES, MK_NEWERA, MK_LEGEND } = window;

const csv = (rows, cols) => [cols.join(','), ...rows.map(r => cols.map(c => {
  const v = r[c] ?? ''; const s = Array.isArray(v) ? v.join('|') : String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}).join(','))].join('\n') + '\n';

writeFileSync(join(here, 'worlds.csv'), csv(MK_WORLDS.map(w => ({
  slug: w.id, name: w.title, world_no: w.no, theme: w.theme, theme2: w.theme2, on_theme: w.on, g: w.g,
  hero_slot: w.img, characters: w.chars.join(','), curation_post: w.post || '',
})), ['slug', 'name', 'world_no', 'theme', 'theme2', 'on_theme', 'g', 'hero_slot', 'characters', 'curation_post']));

writeFileSync(join(here, 'figures.csv'), csv(MK_FIGURES.map(f => ({
  post_name: f.id, post_title: f.name, world: f.world, character: f.char, maker: f.maker, line: f.line,
  size: f.size, price: f.price, rarity: f.rarity, why: f.why, coupang_url: f.coupangUrl, product_image: f.img,
})), ['post_name', 'post_title', 'world', 'character', 'maker', 'line', 'size', 'price', 'rarity', 'why', 'coupang_url', 'product_image']));

const rank = [];
for (const r of MK_NEWERA.regions) for (const e of MK_NEWERA[r.id]) rank.push({ board: 'newera-' + r.id, ...e });
for (const e of MK_LEGEND.list) rank.push({ board: 'legend', ...e });
writeFileSync(join(here, 'rankings.csv'), csv(rank.map(e => ({
  board: e.board, rank: e.r, post_title: e.t, year: e.y, kind: e.k, decade: e.d || '', note: e.note || '', fig: e.fig, world: e.world || '',
})), ['board', 'rank', 'post_title', 'year', 'kind', 'decade', 'note', 'fig', 'world']));

/* ── 블로그 글 (src/content/posts/*.md) → posts.json (HTML 본문) ── */
import { readdirSync } from 'node:fs';
const postsDir = join(root, 'src/content/posts');
const POST_WORLD = { 'demon-slayer': 'kny', 'jujutsu-kaisen': 'jjk', 'chainsaw-man': 'csm', 'one-piece': 'op', 'frieren': 'frn', 'spy-family': 'sxf' };

function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/); if (!m) return { data: {}, body: src };
  const data = {}; const lines = m[1].split('\n'); let i = 0;
  const unq = (v) => v.trim().replace(/^"(.*)"$/, '$1');
  while (i < lines.length) {
    const line = lines[i];
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv && kv[1] === 'products') {
      const arr = []; i++;
      while (i < lines.length && /^\s+(-|\w+:)/.test(lines[i])) {
        if (/^\s+-\s+\w+:/.test(lines[i])) arr.push({});
        const f = lines[i].match(/^\s+-?\s*(\w+):\s*(.*)$/); if (f) arr[arr.length - 1][f[1]] = unq(f[2]);
        i++;
      }
      data.products = arr; continue;
    }
    if (kv) data[kv[1]] = unq(kv[2]);
    i++;
  }
  return { data, body: m[2] };
}
const esc = (s) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/`(.+?)`/g, '<code>$1</code>');
function md(src) {
  const out = []; const lines = src.split('\n'); let list = null, para = [];
  const flushP = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  const flushL = () => { if (list) { out.push(`</${list}>`); list = null; } };
  for (const raw of lines) {
    const l = raw.trimEnd();
    if (!l.trim()) { flushP(); flushL(); continue; }
    const hm = l.match(/^(#{1,6})\s+(.*)$/); if (hm) { flushP(); flushL(); out.push(`<h${hm[1].length}>${inline(hm[2])}</h${hm[1].length}>`); continue; }
    // 한 줄 전체가 굵은 글씨면 소제목처럼 단독 문단으로
    if (/^\*\*[^*]+\*\*$/.test(l.trim())) { flushP(); flushL(); out.push(`<p class="lead">${inline(l.trim())}</p>`); continue; }
    const ul = l.match(/^[-*]\s+(.*)$/); const ol = l.match(/^\d+\.\s+(.*)$/);
    if (ul || ol) { flushP(); const t = ul ? 'ul' : 'ol'; if (list !== t) { flushL(); out.push(`<${t}>`); list = t; } out.push(`<li>${inline((ul || ol)[1])}</li>`); continue; }
    flushL(); para.push(l.trim());
  }
  flushP(); flushL(); return out.join('\n');
}
function productsHtml(products = []) {
  return products.map((p, i) => `
<section class="product panel flat">
  <h3>${i + 1}. ${esc(p.name || '')}</h3>
  ${p.price ? `<p class="price">${esc(p.price)}</p>` : ''}
  ${p.note ? `<p>${esc(p.note)}</p>` : ''}
  ${p.coupangUrl ? `<a class="cta" href="${esc(p.coupangUrl)}" target="_blank" rel="sponsored nofollow noopener"><span>쿠팡에서 최저가 확인하기</span></a>` : `<span class="cta pending"><span>쿠팡 링크 준비 중</span></span>`}
</section>`).join('\n');
}
const posts = readdirSync(postsDir).filter(f => f.endsWith('.md')).map(file => {
  const { data, body } = parseFrontmatter(readFileSync(join(postsDir, file), 'utf8'));
  const slug = file.replace(/\.md$/, '');
  const world = Object.entries(POST_WORLD).find(([k]) => slug.startsWith(k))?.[1] || '';
  return { slug, title: data.title || slug, excerpt: data.description || '', date: data.date || '', world, html: md(body) + '\n<h2>추천 피규어</h2>\n' + productsHtml(data.products) };
});
writeFileSync(join(here, 'posts.json'), JSON.stringify(posts, null, 1));

console.log(`worlds ${MK_WORLDS.length} · figures ${MK_FIGURES.length} · rankings ${rank.length} · posts ${posts.length}`);
