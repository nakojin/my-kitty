# my-kitty

애니메이션 피규어 추천 사이트 — 쿠팡 파트너스 제휴 수익 사이트.
Astro 정적 사이트로 임시 구축했으며, 글은 Markdown으로 관리합니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ 에 정적 파일 생성
```

## 글 쓰기

`src/content/posts/` 에 `.md` 파일을 추가합니다. 형식은 `sample-figure.md` 를 참고하세요.
`coupangUrl` 에 쿠팡 파트너스 링크를 넣으면 글 하단에 구매 버튼이 표시됩니다.

## 구조

- `src/layouts/Base.astro` — 공통 레이아웃, 쿠팡 파트너스 고지 문구
- `src/components/CoupangButton.astro` — 제휴 링크 버튼 (`rel="sponsored nofollow"`)
- `src/pages/index.astro` — 글 목록
- `src/pages/posts/[id].astro` — 글 상세
- `src/content.config.ts` — 글 메타데이터 스키마
