// 작품(월드) 마스터. 워드프레스에서는 taxonomy `world` + term meta로 옮긴다.
// theme/theme2 는 docs/ux/03-theme-palettes.md 와 동일.
window.MK_WORLDS = [
  { id: 'kny', no: 1, title: '귀멸의 칼날', en: 'Demon Slayer', theme: '#2fd36f', theme2: '#ff7a1a', on: '#000', g: 40, img: 'IMG-W01-HERO',
    chars: ['탄지로', '네즈코', '렌고쿠', '젠이츠', '이노스케', '기유'], post: 'demon-slayer-figure-top5' },
  { id: 'jjk', no: 2, title: '주술회전', en: 'Jujutsu Kaisen', theme: '#4f6df5', theme2: '#b06cff', on: '#fff', g: 40, img: 'IMG-W02-HERO',
    chars: ['고죠', '이타도리', '스쿠나', '메구미', '노바라', '토지'], post: 'jujutsu-kaisen-figure-top5' },
  { id: 'csm', no: 3, title: '체인소맨', en: 'Chainsaw Man', theme: '#ff6a00', theme2: '#f2f0ea', on: '#000', g: 45, img: 'IMG-W03-HERO',
    chars: ['덴지', '파워', '마키마', '레제', '아키', '포치타'], post: 'chainsaw-man-figure-top5' },
  { id: 'op',  no: 4, title: '원피스', en: 'One Piece', theme: '#ffcc33', theme2: '#2eb3ff', on: '#000', g: 35, img: 'IMG-W04-HERO',
    chars: ['루피', '조로', '샹크스', '에이스', '나미', '로빈'], post: 'one-piece-figure-top5' },
  { id: 'frn', no: 5, title: '장송의 프리렌', en: 'Frieren', theme: '#c9b6ff', theme2: '#f2f0ea', on: '#000', g: 30, img: 'IMG-W05-HERO',
    chars: ['프리렌', '페른', '슈타르크', '힘멜', '하이터', '아이젠'], post: 'frieren-figure-top5' },
  { id: 'sxf', no: 6, title: '스파이 패밀리', en: 'Spy x Family', theme: '#1fb27a', theme2: '#ff8fb1', on: '#000', g: 40, img: 'IMG-W06-HERO',
    chars: ['아냐', '요르', '로이드', '본드', '다미안', '베키'], post: 'spy-family-figure-top5' },
  { id: 'blc', no: 7, title: '블리치', en: 'Bleach', theme: '#ff3d6e', theme2: '#9be7ff', on: '#000', g: 40, img: 'IMG-W07-HERO',
    chars: ['이치고', '루키아', '뱌쿠야', '아이젠', '우라하라', '켄파치'] },
  { id: 'onk', no: 8, title: '최애의 아이', en: 'Oshi no Ko', theme: '#ff8ad8', theme2: '#7cf0ff', on: '#000', g: 35, img: 'IMG-W08-HERO',
    chars: ['아이', '루비', '아쿠아', '카나', '아카네', '멤쵸'] },
  { id: 'gdm', no: 9, title: '건담', en: 'Gundam', theme: '#5aa9ff', theme2: '#ffd34d', on: '#000', g: 40, img: 'IMG-W09-HERO',
    chars: ['RX-78-2', '스트라이크 프리덤', '유니콘', '뉴 건담', '바르바토스', '에어리얼'] },
];

// 레어리티 — 가격대를 게임 언어로. 도감·상세·마이에서 공통 사용.
window.MK_RARITY = {
  common:    { label: '일반', hint: '프라이즈 · 2~4만', color: '#9aa0a6' },
  rare:      { label: '레어', hint: 'POP UP PARADE · 넨도 · 5~9만', color: '#4fc3f7' },
  epic:      { label: '에픽', hint: '스케일 1/8~1/7 · 10~25만', color: '#b06cff' },
  legendary: { label: '전설', hint: '한정판 · 재판 없음', color: '#ffcc33' },
};
