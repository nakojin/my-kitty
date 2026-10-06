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

console.log(`worlds ${MK_WORLDS.length} · figures ${MK_FIGURES.length} · rankings ${rank.length}`);
