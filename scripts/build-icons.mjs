// Lucide 아이콘 → SVG 스프라이트. 실행: npm run icons
// 쓰는 아이콘만 골라 <symbol id="i-이름"> 으로 묶고,
//  - public/proto/index.html 의 <!-- icons:start --> ~ <!-- icons:end --> 사이에 인라인으로 넣는다 (file:// 에서도 동작)
//  - wp-theme/mykitty/assets/icons.svg 로 저장한다 (footer 가 인라인 출력)
// 사용: <svg class="ic"><use href="#i-house"/></svg>
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules/lucide-static/icons');

export const ICONS = [
  'house', 'trophy', 'book-open', 'user',            // 탭바
  'chevron-left', 'chevron-right', 'arrow-up-right', 'x',
  'heart', 'check', 'plus', 'flame', 'sparkles', 'award',
  'share-2', 'link', 'download', 'search', 'shield-check', 'info', 'circle', 'circle-check', 'chevron-down',
];

const symbols = ICONS.map((name) => {
  const svg = readFileSync(join(src, name + '.svg'), 'utf8');
  const inner = svg.replace(/<!--[\s\S]*?-->/g, '').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
    .split('\n').map((l) => l.trim()).filter(Boolean).join('');
  return `<symbol id="i-${name}" viewBox="0 0 24 24">${inner}</symbol>`;
}).join('');

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true"><!-- Lucide (ISC) https://lucide.dev -->${symbols}</svg>`;

// 프로토타입: index.html 에 인라인
const html = join(root, 'public/proto/index.html');
const page = readFileSync(html, 'utf8');
if (!page.includes('<!-- icons:start -->')) throw new Error('index.html 에 <!-- icons:start --> 마커가 없습니다');
writeFileSync(html, page.replace(/<!-- icons:start -->[\s\S]*?<!-- icons:end -->/, `<!-- icons:start -->${sprite}<!-- icons:end -->`));

// 워드프레스 테마
writeFileSync(join(root, 'wp-theme/mykitty/assets/icons.svg'), sprite + '\n');

// 라이선스 고지
for (const dest of ['public/proto/LICENSE-lucide.txt', 'wp-theme/mykitty/assets/LICENSE-lucide.txt']) {
  copyFileSync(join(root, 'node_modules/lucide-static/LICENSE'), join(root, dest));
}
console.log(`icons: ${ICONS.length} → proto/index.html, wp-theme/mykitty/assets/icons.svg`);
