# My Kitty 워드프레스 테마 — 이식 1단계

프로토타입(`public/proto`)과 **같은 토큰·컴포넌트·데이터 구조**를 쓰는 워드프레스 테마. 매핑 설계는 `docs/ux/04-wordpress-mapping.md`.

## 1단계에 들어 있는 것

| 항목 | 파일 |
|---|---|
| 디자인 토큰 | `mykitty/assets/css/tokens.css` (프로토타입과 동일), `theme.json` |
| 컴포넌트 CSS | `mykitty/assets/css/components.css` (동일) + `theme.css` (WP 보정) |
| 콘텐츠 모델 | `inc/post-types.php` — taxonomy `world`, CPT `figure`, CPT `ranking_entry`, taxonomy `ranking_board` + 메타 등록 |
| 템플릿 파트 | `template-parts/{img-slot,chip,figure-card,rank-row}.php` ← `js/views.js` 헬퍼 1:1 |
| 템플릿 태그 | `inc/template-tags.php` — `mykitty_world_style()`, `mykitty_coupang_cta()`, JS 전역 직렬화 |
| 뼈대 | `header.php`(폰 프레임 + `#rough` 필터), `footer.php`(고지 문구 + 탭바 + 시트 컨테이너) |
| 스타일 체크 | `front-page.php` — 월드 타일·칩·피규어 카드·랭킹 행·CTA가 프로토타입과 같게 보이는지 |
| 데이터 가져오기 | `import/worlds.csv`, `import/figures.csv`, `import/rankings.csv` |
| 상태 로직 | `assets/js/store.js` (프로토타입 그대로) |

## 설치

1. `wp-theme/mykitty` 폴더를 zip 으로 묶어 **외모 → 테마 → 새로 추가 → 테마 업로드**, 또는 서버 `wp-content/themes/mykitty` 에 복사.
2. 테마 활성화 → 월드 9개 term 과 랭킹 보드 5개 term 이 자동 생성된다.
3. **설정 → 고유주소**를 "글 이름"으로 저장(한 번 저장해야 `figure`, `world`, `ranking` 주소가 열린다).
4. 데이터 가져오기 (아래).
5. 홈(`/`)을 열어 스타일 체크 페이지가 프로토타입과 같은 톤으로 보이는지 확인.

## 데이터 가져오기

CSV 3개는 프로토타입 `public/proto/data/*.js` 에서 생성한 것이라 **내용이 항상 같다**. 데이터를 바꿀 때는 프로토타입 JS를 고치고 `node wp-theme/import/build.mjs` 로 다시 만든다.

### WP-CLI 가 있으면

```bash
wp eval-file wp-theme/import/import.php
```

### 플러그인으로

**WP All Import**(무료)로 `figures.csv` → 포스트 타입 `figure`, 컬럼을 같은 이름의 커스텀 필드에 매핑하고 `world` 컬럼은 taxonomy `world` 에. `rankings.csv` 도 같은 방식(`ranking_entry`, `board` → taxonomy `ranking_board`).

## 이식 5단계

| 단계 | 내용 | 상태 |
|---|---|---|
| 1 | 뼈대 — 토큰·컴포넌트·콘텐츠 모델·CSV 가져오기 | ✅ |
| 2 | **월드 + 피규어 상세** — `taxonomy-world.php`(탭·필터), `single-figure.php`, `template-parts/figure-detail.php`, `assets/js/app.js`(바텀시트 로더·도감 상태 칠하기) | ✅ |
| 3 | **홈 + 도감 + 마이** — `front-page.php` 실제 홈(체크인·뽑기·내 월드·피드), `page-collection.php`, `page-my.php`, `inc/rest-state.php`(로그인 동기화) | ✅ |
| 4 | **랭킹 + 온보딩 + 공유 카드** — `taxonomy-ranking_board.php`, `page-onboarding.php`, `page-share.php`(캔버스 PNG·Web Share) | ✅ |
| 5 | **콘텐츠·배포·검증** — 블로그 글 6편 `import/posts.json`, `single.php`/`page.php`, `inc/seo.php`(OG·canonical·noindex), `inc/pages.php`(페이지 자동 생성), `QA.md` | ✅ 코드 / ⏳ 실제 설치 QA |

### 3~5단계 동작 방식

- 페이지 템플릿 4개(도감·마이·온보딩·공유)는 **활성화 시 자동 생성**된다(`inc/pages.php`). 소개·랭킹 근거 페이지와 홈/글 목록 설정도 함께.
- 홈·도감·마이·온보딩·공유는 서버가 틀을 그리고 `app.js` 가 상태를 채운다. 첫 방문(온보딩 전)에 홈을 열면 `/onboarding/` 으로 보낸다.
- 로그인 사용자는 상태가 `user_meta mk_state` 에 저장되고 `/wp-json/mk/v1/state` 로 동기화된다. 비로그인은 localStorage.
- 랭킹 보드 5개는 taxonomy term. `/ranking/newera-kr/` 처럼 열고, 레전드는 `?decade=90s`.
- 공유 카드 "이미지 저장"은 `<canvas>` 로 1080×1920 PNG 를 만든다(상품 이미지는 CORS 로 제외). "공유"는 Web Share API, 미지원 시 링크 복사.
- 블로그 글은 `node wp-theme/import/build.mjs` 가 Markdown → HTML(`posts.json`)로 바꾸고 `import.php` 가 `post` 로 넣으며, 월드의 `curation_post` 를 연결한다.
- SEO: `inc/seo.php` 가 OG·canonical·`<title>` 을 넣는다. Yoast/Rank Math 를 쓰면 `functions.php` 에서 `require 'inc/seo.php'` 한 줄만 지우면 된다.

## 설치 후 확인

`QA.md` 체크리스트를 따라 확인한다. 이 저장소 환경에는 워드프레스가 없어 실제 활성화 테스트는 하지 못했고, PHP 문법 검사와 `app.js` 정적 하네스 테스트(도감 필터·마이 집계·공유 카드 렌더·PNG 생성)만 통과한 상태다.

### 2단계 동작 방식

- `/world/kny/` → 월드 페이지. `?tab=cur|chars|all`, `?rarity=rare`, `?char=탄지로` 로 필터.
- 피규어 카드(`a.poster[data-sheet]`) 클릭 → `app.js` 가 `/figure/{slug}/?partial=1` 을 fetch 해 바텀시트에 끼움. 새 탭·직접 접근은 전체 페이지(`single-figure.php`).
- 도감 상태(보유/위시), 완성도 %, 캐릭터 링 색은 **클라이언트(`store.js`)** 가 칠한다. 서버 HTML 은 로그인 여부와 무관하게 캐시 가능.
- 쿠팡 CTA 는 `mykitty_coupang_cta()` 하나로만 출력.

## 지켜야 할 것

- 쿠팡 링크는 `mykitty_coupang_cta()` 로만 출력. 본문 안의 쿠팡 링크는 필터가 `rel="sponsored nofollow noopener"` 를 강제한다.
- 상품 이미지는 `product_image` 메타(쿠팡 제공 URL). AI 이미지 금지.
- 월드 색은 term meta → 인라인 CSS 변수. `theme.json` 팔레트에는 넣지 않는다.
