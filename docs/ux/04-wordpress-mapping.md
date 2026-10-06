# 마이키티 — 프로토타입 → 워드프레스 이식 매핑

> 프로토타입: `public/proto/` (배포: https://nakojin.github.io/my-kitty/proto/)
> 원칙: **데이터 / 컴포넌트 / 화면**을 프로토타입에서 이미 분리해 두었다. 워드프레스에서는 각각 **CPT·택소노미 / 템플릿 파트 / 페이지 템플릿**이 된다.

## 1. 콘텐츠 모델

| 프로토타입 데이터 | 워드프레스 | 필드(ACF 또는 메타) |
|---|---|---|
| `data/worlds.js` — 작품(월드) | **taxonomy `world`** (계층 없음) | `theme`, `theme2`, `on_theme`, `gradient_strength`, `world_no`, `hero_image`(IMG-W0x-HERO), `characters`(반복), `curation_post`(글 연결) |
| `data/figures.js` — 피규어 | **CPT `figure`** | `maker`, `line`, `size`, `price_range`, `rarity`(select: common/rare/epic/legendary), `why`(textarea), `coupang_url`, `product_image`(쿠팡 제공 URL), `character`(text), taxonomy `world` |
| `data/rankings.js` — 랭킹 | **CPT `ranking_entry`** + **taxonomy `ranking_board`** | board term: `newera-kr`, `newera-jp`, `newera-cn`, `newera-asia`, `legend`. 필드: `rank`, `title`, `year`, `kind`, `decade`(legend만), `note`, `figure_market`(1~3), `world`(taxonomy 연결, 선택) |
| `MK_RARITY` | 옵션 페이지 또는 `rarity` select 라벨 | 라벨·힌트·색 |
| 기존 블로그 글(`src/content/posts`) | **기본 `post`** + taxonomy `world` | 지금 Markdown frontmatter의 `products[]`는 ACF 반복 필드로 |

**도감·XP·스트릭 상태**: 비로그인은 그대로 `localStorage`(프로토타입 `js/store.js` 로직 그대로 사용). 로그인 사용자는 `user_meta`에 동일 JSON 구조로 저장하고 REST 엔드포인트 하나(`/mk/v1/state`)로 동기화. 구조를 바꾸지 않는 것이 핵심.

## 2. 템플릿 매핑

| 프로토타입 (`js/views.js`) | 워드프레스 템플릿 | 비고 |
|---|---|---|
| `V.onboarding` | `page-onboarding.php` | 첫 방문 시 리다이렉트는 JS로(쿠키 `mk_onboarded`) |
| `V.home` | `front-page.php` | 상단 히어로는 사용자의 대표 월드 term 색을 인라인 CSS 변수로 주입 |
| `V.world` | `taxonomy-world.php` | 탭(큐레이션/캐릭터/전체)은 쿼리스트링 `?tab=` |
| `V.detail` (바텀시트) | `single-figure.php` **+** 시트 로더 | 직접 URL 접근 시 전체 페이지, 앱 내 탭 시 fetch로 시트에 삽입(동일 템플릿 파트) |
| `V.collection` | `page-collection.php` | 상태는 클라이언트. 서버는 피규어 목록만 |
| `V.ranking` | `taxonomy-ranking_board.php` | 신시대/레전드 전환 + 지역/연대 칩 |
| `V.my` | `page-my.php` | 로그인 시 user_meta, 아니면 localStorage |
| `V.share` | `page-share.php` + `/mk/v1/share-card.png` | 서버에서 PNG 렌더(예: `wp_remote_post`로 이미지 서비스 또는 GD) |
| `rankRow`, `posterFig`, `chip`, `slot` | `template-parts/rank-row.php`, `figure-card.php`, `chip.php`, `img-slot.php` | 함수 하나 = 파트 하나 |

## 3. 디자인 토큰 → `theme.json`

`css/tokens.css`의 변수를 그대로 옮긴다.

```json
{
  "settings": { "color": { "palette": [
    { "slug": "bg", "color": "#0d0d0f" }, { "slug": "panel", "color": "#17171a" },
    { "slug": "line", "color": "#333333" }, { "slug": "fg", "color": "#f2f0ea" },
    { "slug": "muted", "color": "#8e8b84" }, { "slug": "cta", "color": "#e5322d" }
  ]}, "custom": { "skew": "-6deg", "skewChip": "-8deg", "skewBrush": "-10deg" } }
}
```

작품 테마색은 팔레트에 넣지 않고 **term meta → 인라인 `style="--theme:…"`** 로 주입한다. 월드가 늘어나도 theme.json을 건드리지 않기 위해서다.

`components.css`는 그대로 테마 스타일시트로. 붓칠/잉크 필터(`#rough` SVG)는 `header.php`에 한 번 삽입.

## 4. 플러그인 최소 구성

| 역할 | 선택 | 메모 |
|---|---|---|
| 커스텀 필드 | ACF (무료) | 반복 필드가 필요한 `characters`, `products`는 ACF Pro 또는 Meta Box |
| CPT/택소노미 등록 | 테마 `functions.php` 또는 CPT UI | 코드 등록 권장(이식성) |
| REST 상태 동기화 | 테마 내 `inc/rest-state.php` | 엔드포인트 1개 |
| 쿠팡 링크 | 커스텀 필드 그대로 | 플러그인 불필요. `rel="sponsored nofollow noopener"` 유지 |
| 캐싱 | WP Super Cache 등 | 도감 상태는 클라이언트라 페이지 캐시와 충돌 없음 |

## 5. 이식 순서

1. 테마 뼈대: `tokens.css` + `components.css` + `#rough` 필터 → 빈 테마에서 칩·패널·CTA가 프로토타입과 같게 보이는지 확인
2. 택소노미 `world` 6개 term + 메타 → `taxonomy-world.php` (S3)
3. CPT `figure` 36건 입력(프로토타입 `figures.js`에서 CSV 변환) → `single-figure.php` (S4)
4. `front-page.php` (S2) — 뽑기·체크인은 `store.js` 그대로
5. `page-collection.php` (S5), `page-my.php` (S7)
6. CPT `ranking_entry` 110건 → `taxonomy-ranking_board.php` (S6)
7. 온보딩·공유 카드 (S1, S8)
8. 기존 블로그 글 6편 → `post`로 가져오기(Markdown → Gutenberg)

## 6. 지켜야 할 것

- 쿠팡 CTA 색·위치·`rel` 속성은 모든 템플릿에서 동일. 파트너스 고지 문구는 `footer.php`에 고정.
- 상품 이미지는 쿠팡 제공 URL만. `img-slot.product`에 AI 생성 이미지 금지.
- 뽑기는 실제 과금·확률 없음. 결과는 항상 실제 `figure` 포스트.
- 랭킹은 "편집부 선정"을 명시하고 출처(`06-ranking-sources.md`)를 페이지에 링크.
