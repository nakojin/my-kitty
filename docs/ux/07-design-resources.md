# 마이키티 — 프론트 디자인·UI/UX 보강용 GitHub 리소스

> 기준: ① 별(★)이 많거나 업계 표준으로 쓰이는 것 ② **상업 사이트에 쓸 수 있는 라이선스** ③ 지금 스택(Astro + 워드프레스 PHP + 바닐라 JS, 빌드 없는 CSS)에 바로 붙일 수 있는 것.
> 별 수는 2026년 기준 대략치(구간)다. 도입 전에 저장소에서 라이선스와 최신 버전을 다시 확인할 것.

## 0. 이 프로젝트에 먼저 넣을 6개 (추천)

| 순위 | 리소스 | 어디에 | 왜 |
|---|---|---|---|
| 1 | **[Pretendard](https://github.com/orioncactus/pretendard)** + Google Fonts **Black Han Sans** | 본문 + 디스플레이 타이포 | 지금은 시스템 폰트라 화면마다 인상이 다르다. 본문은 Pretendard, 기울임 제목은 Black Han Sans 로 바꾸는 것만으로 "디자이너가 만든 느낌"이 가장 크게 올라간다. 둘 다 OFL(상업 무료) |
| 2 | **[GSAP](https://github.com/greensock/GSAP)** | 뽑기 카드 뒤집기, 레벨업·뱃지 연출, 화면 전환 | 2025년부터 SplitText·MorphSVG 등 전 플러그인 상업 무료. CSS transition 으로 만든 지금 연출을 "게임 같은 타이밍"으로 끌어올린다 |
| 3 | **[Rough.js](https://github.com/rough-stuff/rough)** / **[rough-notation](https://github.com/rough-stuff/rough-notation)** | 붓칠·밑줄·동그라미 강조 | 지금 SVG 노이즈 필터로 흉내 낸 붓칠을 "손으로 그린 선"으로 교체. rough-notation 은 제목 강조에 애니메이션까지 |
| 4 | **[augmented-ui](https://github.com/propjockey/augmented-ui)** | 스큐 패널, 깎인 모서리 | 사이버·게임 HUD 모서리를 CSS 클래스만으로. 지금 `transform: skew` 패널을 더 게임 UI답게 |
| 5 | **[Lucide](https://github.com/lucide-icons/lucide)** | 탭바·버튼 아이콘 | 지금 ⌂ ▲ ▦ ◉ 문자 아이콘을 일관된 선 아이콘으로. ISC 라이선스, SVG 스프라이트로 빌드 없이 사용 |
| 6 | **[lottie-web](https://github.com/airbnb/lottie-web)** + [LottieFiles 무료 에셋](https://lottiefiles.com/free-animations) | 뱃지 획득·체크인 축하 | After Effects 애니메이션을 JSON 으로. 무료 에셋은 라이선스(Lottie Simple License) 확인 후 사용 |

## 1. 컴포넌트·UI 키트 (복사해 쓰는 것)

| 리소스 | ★ | 라이선스 | 메모 |
|---|---|---|---|
| [shadcn/ui](https://github.com/shadcn-ui/ui) | 10만+ | MIT | React + Tailwind. 직접 쓰진 않더라도 **간격·상태·접근성 설계의 교과서**. 버튼·시트·토스트 패턴 참고 |
| [daisyUI](https://github.com/saadeghi/daisyui) | 3만+ | MIT | Tailwind 플러그인. 테마 토큰 구조가 우리 월드 테마와 같은 발상 |
| [Flowbite](https://github.com/themesberg/flowbite) | 8천+ | MIT (Pro 별도) | 바닐라 JS 로 동작하는 Tailwind 컴포넌트. 워드프레스에 붙이기 쉬움 |
| [HyperUI](https://github.com/markmead/hyperui) | 1만+ | MIT | 복사-붙여넣기 HTML 블록. 랜딩·카드·필터 레이아웃 참고 |
| [uiverse-io/galaxy](https://github.com/uiverse-io/galaxy) | 1만+ | MIT | 커뮤니티 버튼·카드·로더 수천 개. **게임 같은 버튼·토글** 아이디어 창고 |
| [Preline UI](https://github.com/htmlstreamofficial/preline) | 5천+ | 자체 Fair Use (확인 필요) | 품질 높음. 라이선스가 MIT 가 아니니 상업 사용 조건 확인 |

## 2. 게임·레트로·손그림 스타일 (지금 컨셉과 가장 가까움)

| 리소스 | ★ | 라이선스 | 메모 |
|---|---|---|---|
| [NES.css](https://github.com/nostalgic-css/NES.css) | 2만+ | MIT | 8비트 게임 UI. 그대로 쓰기보다 **대화창·뱃지 프레임** 참고 |
| [augmented-ui](https://github.com/propjockey/augmented-ui) | 1천+ | MIT | 깎인 모서리·HUD 프레임 (위 추천) |
| [RPGUI](https://github.com/RonenNess/RPGUI) | 1천+ | zlib | 판타지 RPG 인터페이스. 프리렌 월드 분위기 참고 |
| [Rough.js](https://github.com/rough-stuff/rough) | 2만+ | MIT | 손그림 스타일 도형 (위 추천) |
| [wired-elements](https://github.com/rough-stuff/wired-elements) | 1만+ | MIT | Rough.js 기반 손그림 버튼·체크박스 웹 컴포넌트 |
| [Vivus](https://github.com/maxwellito/vivus) | 1.5만+ | MIT | SVG 선이 그려지는 애니메이션. 붓 획이 "쓱" 그어지는 연출 |
| [98.css](https://github.com/jdan/98.css) / [XP.css](https://github.com/botoxparty/XP.css) | 1만+ | MIT | 레트로 OS UI. 레전드 랭킹(80·90년대) 섹션 무드 참고 |

## 3. 애니메이션·인터랙션

| 리소스 | ★ | 라이선스 | 메모 |
|---|---|---|---|
| [GSAP](https://github.com/greensock/GSAP) | 2만+ | GSAP Standard (상업 무료) | 위 추천. 사용자에게 **이용료를 받는 제품**이면 별도 라이선스 필요 — 우리는 해당 없음 |
| [Motion](https://github.com/motiondivision/motion) | 2.5만+ | MIT | 구 Framer Motion. 바닐라 JS 버전(`motion`)이 가볍다. GSAP 대안 |
| [Anime.js](https://github.com/juliangarnier/anime) | 5만+ | MIT | v4 부터 타임라인·스크롤 연동 강화. 가볍고 문법 쉬움 |
| [AutoAnimate](https://github.com/formkit/auto-animate) | 1만+ | MIT | 한 줄로 리스트 추가·삭제 애니메이션. 도감 필터 전환에 딱 |
| [Lenis](https://github.com/darkroomengineering/lenis) | 1만+ | MIT | 부드러운 스크롤. 데스크톱 랭킹 페이지용 |
| [Splitting.js](https://github.com/shshaw/Splitting) | 1.5만+ | MIT | 글자 단위 분해 → 타이틀 등장 연출 |
| [Animate.css](https://github.com/animate-css/animate.css) | 8만+ | **Hippocratic 2.1** | 유명하지만 MIT 아님. 쓸 거면 라이선스 조건 확인 |
| [lottie-web](https://github.com/airbnb/lottie-web) | 3만+ | MIT | 위 추천 |

## 4. 레이아웃·캐러셀·오버레이

| 리소스 | ★ | 라이선스 | 메모 |
|---|---|---|---|
| [Embla Carousel](https://github.com/davidjerleke/embla-carousel) | 6천+ | MIT | 가볍고 터치 좋음. **피규어 상세 이미지 캐러셀**에 |
| [Swiper](https://github.com/nolimits4web/swiper) | 4만+ | MIT | 기능 많음. 공유 카드 배경 넘기기 등 |
| [Floating UI](https://github.com/floating-ui/floating-ui) | 3만+ | MIT | 툴팁·팝오버 위치 계산. 레어리티 설명 툴팁 |
| [Vaul](https://github.com/emilkowalski/vaul) | 7천+ | MIT | React 바텀시트. 직접 안 써도 **드래그로 닫는 시트 UX** 참고 |
| [Sonner](https://github.com/emilkowalski/sonner) | 1만+ | MIT | 토스트 UX 레퍼런스(쌓임·스와이프 닫기) |

## 5. 디자인 토큰·타이포·아이콘

| 리소스 | ★ | 라이선스 | 메모 |
|---|---|---|---|
| [Open Props](https://github.com/argyleink/open-props) | 5천+ | MIT | CSS 변수만으로 된 디자인 토큰(그림자·이징·간격). 우리 `tokens.css` 확장에 바로 |
| [Utopia](https://github.com/trys/utopia-core) | — | MIT | 화면 폭에 따라 글자·간격이 유동적으로. 모바일↔데스크톱 타이포 |
| [Pretendard](https://github.com/orioncactus/pretendard) | 1만+ | OFL | 한국어 웹 본문 표준급 폰트 |
| [Lucide](https://github.com/lucide-icons/lucide) | 1.5만+ | ISC | 위 추천 |
| [Tabler Icons](https://github.com/tabler/tabler-icons) | 1.8만+ | MIT | 5천 개 이상. Lucide 에 없는 것 보충 |
| [Phosphor Icons](https://github.com/phosphor-icons/core) | 5천+ | MIT | 굵기 6종(얇음~채움). 게임 UI 에 "Fill/Duotone" 이 잘 어울림 |

Google Fonts (모두 OFL, 상업 무료): **Black Han Sans**(굵은 디스플레이), **Do Hyeon**, **Jua**(둥근), **Nanum Brush Script**·**East Sea Dokdo**(붓글씨 — 강조 한두 단어에만).

## 6. 디자인 시스템·UX 체크리스트 (배우는 용)

| 리소스 | ★ | 메모 |
|---|---|---|
| [awesome-design-systems](https://github.com/alexpate/awesome-design-systems) | 1.8만+ | 기업 디자인 시스템 모음. 토큰·컴포넌트 문서화 방식 참고 |
| [awesome-design](https://github.com/gztchan/awesome-design) | 1.5만+ | 디자인 리소스 종합 목록 |
| [Front-End-Checklist](https://github.com/thedaviddias/Front-End-Checklist) | 7만+ | 출시 전 프론트 점검표(성능·SEO·접근성) |
| [a11yproject](https://github.com/a11yproject/a11yproject.com) | 3천+ | 접근성 체크리스트. 대비·포커스·스크린리더 |
| [Primer](https://github.com/primer/css) · [Carbon](https://github.com/carbon-design-system/carbon) | 1만+ | GitHub·IBM 디자인 시스템. 상태(hover/active/disabled) 정의가 꼼꼼 |

## 7. 워드프레스·Astro 쪽 뼈대

| 리소스 | ★ | 라이선스 | 메모 |
|---|---|---|---|
| [Sage (roots/sage)](https://github.com/roots/sage) | 1.2만+ | MIT | Vite + Tailwind + Blade 로 만드는 현대식 워드프레스 테마. 테마가 커지면 이 구조로 옮기는 걸 검토 |
| [AstroWind](https://github.com/onwidget/astrowind) | 5천+ | MIT | Astro + Tailwind 템플릿. 블로그 쪽 레이아웃·SEO 구성 참고 |
| [Underscores](https://github.com/Automattic/_s) | 1.1만+ | GPL | 워드프레스 공식 스타터. 템플릿 계층 참고용 |

## 쓰기 전에 지킬 것

1. **MIT·ISC·OFL·zlib 은 상업 사용 OK.** 저작권 고지(LICENSE 파일)만 유지.
2. **Animate.css(Hippocratic), Preline(자체 라이선스), GSAP(Standard)** 은 조건이 있으니 원문 확인.
3. 컴포넌트를 통째로 가져오기보다 **우리 토큰(`tokens.css`)으로 다시 칠하기.** 여러 키트를 섞으면 다시 "AI 티"가 난다.
4. 빌드 없는 워드프레스 테마에는 **CDN(jsDelivr) + ES 모듈** 로 붙이는 게 가장 간단. 커지면 Sage(Vite)로.

## 도입 순서 제안

1. **타이포 교체** (Pretendard + Black Han Sans) — 반나절, 효과 최대
2. **아이콘 교체** (Lucide) — 탭바·버튼
3. **뽑기·레벨업 연출을 GSAP 으로** — 게임성 체감 상승
4. **붓칠을 Rough.js / rough-notation 으로** — 손그림 품질
5. **피규어 상세 캐러셀(Embla) + 도감 필터 AutoAnimate**
6. augmented-ui 패널, Lottie 뱃지 — 마무리 장식

출처: [Webflow — GSAP 100% 무료 발표](https://webflow.com/blog/gsap-becomes-free), [GSAP Standard License](https://gsap.com/community/standard-license/)
