# 마이키티 — 화면별 Mobbin 레퍼런스 (v0.1)

> `01-screens-and-flows.md`의 화면 번호(S1~S8)를 따른다.
> 각 레퍼런스는 "무엇을 가져올지 / 무엇을 바꿀지"를 함께 적었다. 링크는 Mobbin 화면 페이지.

## S1 온보딩 — 작품 3개 고르기

| 레퍼런스 | 가져올 것 | 바꿀 것 |
|---|---|---|
| [Spotify — Choose 3 or more artists](https://mobbin.com/flows/e961c187-377c-4021-9b6d-0f34ba1fc266) | 큰 제목 + 검색창 + **원형 타일 3열 그리드**. "3개 이상" 조건을 제목에 명시. 선택 후 "Great picks!" 짧은 확인 화면 | 원형 → **작품 키 비주얼이 들어간 둥근 사각 타일**(애니 포스터 비율). 다크 배경 유지 |
| [YouTube Music — Pick 5 artists](https://mobbin.com/flows/eae66b2b-4173-494d-bbeb-02a3a079f31d) | 하단 고정 "Done" 버튼. 부제에 "고를수록 추천이 좋아져요" | 3개 채우기 전엔 버튼 비활성 + "n/3" 카운터 |
| [Hulu — Add 5 shows](https://mobbin.com/flows/aa85a255-b871-4ebf-b167-bf9fb079c4a9) | 하단 바에 **"2 of 5" 진행 카운터**와 Finish 버튼을 한 줄에 | 리스트형 대신 타일형 유지 |

**결정 메모**: 3개 고정보다 **"3개 이상, 최대 5개"**가 레퍼런스 관행과 맞다(열린 질문 1 답 제안).

## S2 홈 — 데일리 체크인 + 오늘의 뽑기

| 레퍼런스 | 가져올 것 | 바꿀 것 |
|---|---|---|
| [Life Reset — day streak](https://mobbin.com/screens/a1246bfd-b416-405c-8c10-a776edda1f36) | 상단 **풀블리드 컬러 헤더**에 스트릭 숫자, 아래 7일 캘린더 + 뱃지 그리드. 게임 톤의 금속 뱃지 | 주황 → 작품 테마 색. 뱃지 그리드는 마이(S7)로 보내고 홈은 간결하게 |
| [Headway — profile achievements + streak](https://mobbin.com/screens/8f462a32-3421-423a-aaa8-cf94d3051eec) | 캐릭터 일러스트가 들어간 **원형 업적 뱃지 가로 스크롤**. 밝고 친근한 톤 | 캐릭터 → 작품 마스코트/실루엣 |
| [Sweatcoin — daily goal](https://mobbin.com/screens/db4d9dcc-9774-4109-b333-e4532a314a15) | 카드 3장 세로 스택(목표 / 스트릭 / 보상)으로 홈을 구성하는 방식. 하단 고정 CTA | 카드 1 = 오늘의 뽑기, 카드 2 = 체크인, 카드 3 = 내 월드 바로가기 |
| [Nibble — streak intro sheet](https://mobbin.com/screens/ffe922cc-afd7-4803-b2ca-5fef3263e09f) | 첫 방문 시 스트릭 개념을 **바텀시트 1장**으로 설명 | 그대로. 2문장 이내 |

### S2-b 뽑기 연출 (홈 안의 모달)

| 레퍼런스 | 가져올 것 | 바꿀 것 |
|---|---|---|
| [Alan — Discover your collector icon](https://mobbin.com/screens/16e0bd29-9b43-43b9-9c84-86eb24d1d72a) | 중앙 **홀로그램 "?" 카드** + 빛 파티클 + "탭해서 공개" 한 줄. 가장 우리 콘셉트에 가까움 | 공개 후 카드가 뒤집히며 **실제 피규어 카드**(쿠팡 이미지)로 전환 → 하단에 "상세 보기 / 위시 담기" |
| [Life Reset — Harmony Awaits](https://mobbin.com/screens/2436d96a-56d8-4f73-9b8d-156cdf145174) | 다크 배경 + 중앙 "?" 카드 + 아래 흐릿한 **다른 카드들의 그리드**(도감 암시) | 하단 그리드를 "내 도감 빈칸"으로 연결 |
| [Forest — Reveal your tree](https://mobbin.com/screens/9c79865b-4525-45ad-a89c-f4de4128fa27) | 1-2-3 스텝 인디케이터 + "Reveal" 버튼. 연출 전 기대감 | 스텝 대신 "오늘의 뽑기 1/1" 표시 |
| [Sweatcoin — Unwrap your reward](https://mobbin.com/screens/667b61df-7cfd-42ee-b3a1-d9e3a9c07f74) | 스크래치/언랩 인터랙션 | **쓰지 않는다** — 보상·당첨 뉘앙스가 강해 "과금 뽑기" 오해 소지. 우리는 "추천 공개" 톤 유지 |

## S3 작품 월드

| 레퍼런스 | 가져올 것 | 바꿀 것 |
|---|---|---|
| [HBO Max — Characters](https://mobbin.com/screens/7c01d385-b520-4616-8fbb-37b7256e2abd) | 다크 배경 + 패턴 텍스처 위 **캐릭터 원형 타일 3열**. 상단 탭(Home/Series/Movies/Characters) | 탭 → "큐레이션 / 캐릭터 / 전체". 원형 → 캐릭터 일러스트 둥근 타일 |
| [PlayStation — Collections](https://mobbin.com/screens/a228b341-52be-4675-828e-1ac3717f0661) | **키 비주얼 위 큰 텍스트 라벨** 2열 타일. 게임 스토어 특유의 묵직한 톤 | 월드 선택 화면(홈 → 월드 진입)의 타일로 사용 |
| [Glow — Critters Cult grid](https://mobbin.com/screens/91d0f10b-e0f9-4fe8-872c-d71cc71d0106) | 상단 **속성 필터 칩 가로 스크롤**(Background/Creature/Eyes…) + 3열 정사각 그리드 + 아이템 수 | 칩 → "레어리티 / 가격대 / 라인 / 캐릭터". NFT 톤은 제거 |
| [ElevenReader — Travel 컬렉션](https://mobbin.com/screens/3cf556cb-bee4-477d-8ec5-7547b796df65) | **테마 컬러 풀블리드 헤더**(제목·설명·아이템 수) → 아래 2열 카드 | 헤더 색 = 작품 테마 색. 아이템 수 옆에 **도감 완성도 %** |

## S4 피규어 상세

| 레퍼런스 | 가져올 것 | 바꿀 것 |
|---|---|---|
| [Uber Eats — item sheet](https://mobbin.com/screens/e6fbef06-57cd-4d0d-9c05-87f3b2adb3f7) | **바텀시트형 상세**(어느 탭에서든 위로 열림), 이미지 캐러셀, 속성 칩, 하단 "Similar items" 가로 스크롤, **검은 풀폭 고정 CTA** | CTA = 쿠팡 빨강 "쿠팡에서 보기". Similar → "같은 라인 다른 캐릭터"(크기 통일 유도) |
| [Hers — product detail](https://mobbin.com/screens/6d22d739-1765-4267-a2ee-02fb12824f7d) | 큰 이미지 → 카테고리 소제목 → 제목 → 가격 → 설명 순서. 하단 **CTA 2개 나란히** | CTA 2개 = "쿠팡에서 보기"(주) + "도감 담기"(부) |
| [Vivino — Buy now + bookmark](https://mobbin.com/screens/40a06f0b-46e5-48c9-b9fe-c19d69baf581) | 속성을 **칩으로 나열**(Region/Grapes/ABV). 하단 CTA 옆 **북마크 아이콘 버튼** | 칩 = 제조사 / 라인 / 스케일 / 레어리티. 북마크 = 위시 |
| [Careem — price + CTA](https://mobbin.com/screens/c18aade7-cd04-46b0-8e17-057b8cf68c36) | 하단 바에 **정가·할인가 + CTA**를 한 줄로 | 가격은 "대략 2~3만 원대"로 표기(규정) |

**추가 블록(레퍼런스 없음, 우리 고유)**: "정품 체크포인트" 접이식 섹션 — 저작권 표기·홀로그램 씰·시세 경고 3항목.

## S5 도감

| 레퍼런스 | 가져올 것 | 바꿀 것 |
|---|---|---|
| [Letterboxd — List Progress](https://mobbin.com/screens/3f9fd195-ecbb-4f60-96a3-aa5b5916c1c6) | **원형 진행 게이지 2열**("25% · 64 of 250"). 다크 배경에 포인트 색 하나 | 작품별 완성도 카드로 그대로 사용. 게이지 색 = 작품 테마 색 |
| [bless. — want / got / didn't get](https://mobbin.com/screens/c5166729-1cb4-463b-a18a-318e71da0c9c) | 상단 **상태 탭(want/got/…)** + 원형 썸네일 2열 + 각 아이템 위 상태 배지 | 탭 = 보유 / 위시 / 미보유. "Rethink"·"n days left" 배지 → 레어리티 배지 |
| [Apple Games — Locked achievements](https://mobbin.com/screens/c2089331-e1c4-4387-85aa-3a44db91c4ea) | **잠긴 항목을 반투명 + 희귀도 %**로 보여 주는 방식. 게임 톤 그라데이션 배경 | 미보유 피규어 = 실루엣/반투명. "n%의 유저가 보유" 표시는 2차 |
| [Runna — Trophies](https://mobbin.com/screens/93b58dd0-6e47-425c-b6e6-afda4c52ffe4) | 단계별 뱃지(First/10/50/100…)에서 **획득한 것만 컬러, 나머지 회색** | 작품 완주 뱃지(1/5/10/전체)에 적용 |

## S7 마이 — 레벨·뱃지

| 레퍼런스 | 가져올 것 | 바꿀 것 |
|---|---|---|
| [Duolingo — profile](https://mobbin.com/screens/7dc56e7a-5099-44aa-88c1-5a8cb629eab6) | 섹션 순서: 스트릭 → 뱃지 가로 스크롤 → 업적(숫자 박힌 방패형 뱃지). **"NEW" 리본** | 친구 섹션 제거(MVP). 뱃지 일러스트 톤은 애니풍으로 |
| [Opal — gemstones](https://mobbin.com/screens/a4301fe8-32d4-4b09-8054-bf68100ced03) | 다크 배경 + **보석형 뱃지 가로 스크롤**, 각 뱃지 아래 "Owned by 23%". 상단 3지표(시간/스트릭/상위 %) | 보석 → 레어리티 결정(일반/레어/에픽/전설) 메타포로 재사용. 상위 % 표시는 2차 |
| [Mimo — stats + share](https://mobbin.com/screens/2cb93321-7a3b-4673-9791-64b9708996e5) | 아바타 아래 **3칸 통계 카드**(스트릭/XP/리그) + 바로 아래 **"Share my progress"** 버튼 | 리그 → 레벨. Share → S8 공유 카드 진입점 |
| [Numo — Level](https://mobbin.com/screens/3fd97013-d8b4-4ec4-8c42-703a1c9d5b27) | 레벨 숫자 + **"다음 레벨까지 n"** 진행 바 + 레벨업 보상 미리보기(아이콘·테마 해금) | 레벨업 보상 = 월드 테마 색/프로필 프레임 해금(무료, 비과금) |

## S8 공유 카드

| 레퍼런스 | 가져올 것 | 바꿀 것 |
|---|---|---|
| [Spotify Wrapped — summary card](https://mobbin.com/screens/6b681412-559a-4fbf-af3e-1e97b4207e84) | **세로 카드 1장**에 이미지 + Top 5 리스트 2열 + 핵심 수치 2개 + 하단 서비스 URL. 카드 가로 스와이프로 여러 버전 | 이미지 = 대표 피규어(쿠팡 이미지), Top 5 = 보유 피규어, 수치 = 완성도 % / 레벨 |
| [Spotify Wrapped — share sheet](https://mobbin.com/screens/4f94083f-de23-4ff6-86ba-9e45e1a09676) | 카드 프리뷰 아래 **배경색 선택 칩 3개** + 공유 대상 아이콘 행(링크 복사/메시지/…) | 배경색 = 작품 테마 색 3종 |
| [Spotify Wrapped — top genres](https://mobbin.com/screens/492d9e8d-415a-46fe-b026-4c250bd6b18a) | 큰 타이포 + 블록 배경 + 도형 장식. **텍스트만으로도 공유 욕구가 생기는 레이아웃** | "내 월드 TOP 5 작품" 버전 카드로 사용 |

## 종합 — 디자인 시스템 방향

레퍼런스를 모아 보니 공통점이 뚜렷하다.

1. **다크 기본**이 맞다. 게임·수집 톤의 레퍼런스(Life Reset, HBO Max, Opal, Apple Games, Letterboxd)가 전부 다크 배경에 포인트 색 하나. 쿠팡 빨강은 CTA에만 쓰고, 작품 테마 색을 포인트로 돌린다. → 열린 질문 3 답 제안: **다크 기본, 라이트 옵션**.
2. **원형 게이지 + 3열 그리드**가 도감의 표준 문법. 새로 발명하지 않는다.
3. **"?" 카드 + 탭해서 공개**(Alan, Life Reset)가 뽑기 연출의 정답. 스크래치·선물상자(Sweatcoin, Zomato)는 사행성 뉘앙스가 있어 피한다.
4. **상세는 바텀시트 + 하단 고정 CTA**(Uber Eats). 어느 탭에서든 열리고, 쿠팡 버튼은 항상 같은 자리.
5. **공유 카드는 세로 1장 + 테마색 3종 선택**(Spotify). 카드 하단에 서비스 URL 고정.

## 다음 단계

- [ ] 열린 질문 1·3에 대한 결정 (온보딩 3~5개 / 다크 기본)
- [ ] 위 레퍼런스로 S2(홈)·S4(상세)·S5(도감) **로우파이 와이어프레임** 3장 먼저
- [ ] 작품 테마 색 팔레트 초안 (귀멸=검정+녹색·주황, 주술회전=남색+보라, 체인소맨=주황+검정, 원피스=빨강+노랑, 프리렌=흰색+연보라, 스파이=빨강+녹색)
