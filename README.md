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

`src/content/posts/` 에 `.md` 파일을 추가합니다. 글 하나에 상품 여러 개를 넣는 모음 글 구조입니다.

```yaml
---
title: "글 제목"
description: "목록과 검색 결과에 보이는 한 줄 요약"
date: 2026-10-06
products:
  - name: "상품명"
    price: "2~3만 원대"          # 선택
    note: "추천 이유 한두 문장"    # 선택
    coupangUrl: "https://link.coupang.com/a/..."  # 선택. 비우면 '쿠팡 링크 준비 중' 표시
---
본문(Markdown). 상품 카드는 본문 아래에 순서대로 붙습니다.
```

## 구조

- `src/layouts/Base.astro` — 공통 레이아웃, 쿠팡 파트너스 고지 문구
- `src/components/CoupangButton.astro` — 제휴 링크 버튼 (`rel="sponsored nofollow"`)
- `src/components/ProductCard.astro` — 상품 카드 (이름·가격·설명·버튼)
- `src/pages/index.astro` — 글 목록
- `src/pages/posts/[id].astro` — 글 상세
- `src/content.config.ts` — 글 메타데이터 스키마
