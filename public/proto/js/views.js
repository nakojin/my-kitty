// 화면 렌더러. 각 함수는 HTML 문자열을 돌려준다.
// 워드프레스 이식: 함수 하나 = 템플릿 파트 하나 (template-parts/*.php).
(function () {
  const h = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // 이미지 슬롯. img/<슬롯ID>.webp 가 있으면 보여 주고, 없으면 자리표시자(슬롯 ID)를 그대로 둔다.
  // COUPANG-* 슬롯은 쿠팡 제공 이미지 URL(figure.img)만 사용한다.
  const slot = (id, cls = '', inner = '') => {
    const base = window.MK_IMG_BASE || 'img/';
    const src = id.startsWith('COUPANG-') ? (MK.figure(id.slice(8))?.img || '') : `${base}${id}.webp`;
    const img = src ? `<img src="${src}" alt="" loading="lazy" onerror="this.remove()">` : '';
    return `<div class="img-slot ${cls}" data-slot="${id}">${img}${inner || id}</div>`;
  };
  // Lucide 아이콘 (index.html 의 스프라이트). 장식용이라 aria-hidden.
  const ic = (name, cls = '') => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const collLabel = (s) => s === 'own' ? `${ic('check')}보유 중` : s === 'wish' ? `${ic('heart', 'fill')}위시` : `${ic('heart')}도감 담기`;
  const chip = (label, on, attrs = '') => `<button class="chip ${on ? 'on' : ''}" ${attrs}><span>${h(label)}</span></button>`;
  const rchip = (r) => `<span class="chip r-${r}"><span>${MK.rarity(r).label}</span></span>`;
  const disclosure = `<div class="disclosure">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div>`;

  const posterFig = (f) => {
    const s = MK.state.coll[f.id];
    const cls = s === 'own' ? 'on' : s === 'wish' ? 'wish' : 'none';
    return `<button class="poster ${cls}" data-go="detail:${f.id}">
      ${slot('COUPANG-' + f.id, 'product', '')}
      ${s ? '' : `<span class="tag">${MK.rarity(f.rarity).label}</span>`}
      <span class="cap">${h(f.name)}</span></button>`;
  };

  const V = {};

  /* S1 온보딩 */
  V.onboarding = () => {
    const sel = MK.state.worlds;
    return `<div class="view pad" style="position:relative;min-height:100%;display:flex;flex-direction:column;gap:12px">
      <div class="splat" style="width:110px;height:110px;right:-40px;top:-30px"></div>
      <div class="splat ink" style="width:12px;height:12px;right:80px;top:70px"></div>
      <div style="margin-top:10px"><div class="label">STEP 1 / 2</div>
        <div class="display" style="font-size:30px;margin-top:6px">좋아하는 작품을<br><span class="brush">3개 이상</span> 골라줘</div>
        <p class="muted small" style="margin:10px 0 0">고를수록 추천이 정확해져요. 최대 5개.</p></div>
      <div class="grid3" id="ob-grid">
        ${MK_WORLDS.map(w => `<button class="poster ${sel.includes(w.id) ? 'on' : ''}" data-ob="${w.id}" style="--theme:${w.theme};--on-theme:${w.on}">
          ${slot(w.img, '', '')}<span class="cap">${h(w.title)}</span></button>`).join('')}
      </div>
      <div style="flex:1"></div>
      <div style="display:flex;align-items:center;gap:12px">
        <div class="display" style="font-size:22px">${sel.length}<span class="muted" style="font-size:12px">/3+</span></div>
        <button class="cta theme" id="ob-next" ${sel.length < 3 ? 'disabled' : ''} style="flex:1"><span>다음 →</span></button>
      </div>
    </div>`;
  };

  /* S2 홈 */
  V.home = () => {
    const s = MK.state;
    const main = MK.world(s.worlds[0]) || MK_WORLDS[0];
    const canGacha = MK.canGacha();
    const result = s.gachaResult ? MK.figure(s.gachaResult) : null;
    const checked = MK.checkedToday();
    const streak = MK.effectiveStreak();
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    const todayIdx = (new Date().getDay() + 6) % 7;
    // 요일 칩: 실제 연속 체크인한 날만 켠다 (오늘 체크인했으면 오늘 포함)
    const lit = (i) => { const back = checked ? todayIdx - i : todayIdx - 1 - i; return back >= 0 && back < streak; };
    const feed = MK_FIGURES.filter(f => f.rarity === 'rare').slice(0, 3);
    return `<div class="view" data-theme-world="${main.id}">
      <div class="hero">
        ${slot(main.img, '', '')}
        <div class="splat" style="width:120px;height:120px;right:-40px;top:-40px"></div>
        <div class="splat ink" style="width:8px;height:8px;right:84px;top:30px"></div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end">
          <div><div class="label" style="color:var(--fg);opacity:.7">${ic('flame')}연속 체크인</div><div class="display" style="font-size:34px">${streak}일째</div></div>
          <div style="text-align:right"><div class="label" style="color:var(--fg);opacity:.7">LEVEL</div><div class="display" style="font-size:26px;color:var(--theme)">${MK.level()}</div></div>
        </div>
        <div class="chips" style="margin-top:10px">${days.map((d, i) => chip(d, lit(i))).join('')}
          <button class="chip ${checked ? '' : 'on'}" id="checkin" ${checked ? 'disabled' : ''}><span>${checked ? `오늘 완료 ${ic('check')}` : '체크인 +10XP'}</span></button></div>
      </div>
      <div class="pad" style="display:flex;flex-direction:column;gap:14px">
        <div class="panel" style="display:flex;gap:14px;align-items:center;padding:14px">
          <div class="gacha ${canGacha ? 'idle' : 'flipped'}" id="gacha" style="width:92px;height:122px;flex:none">
            <div class="card"><div class="face front">?</div>
              <div class="face back">${result ? slot('COUPANG-' + result.id, 'product', '') : ''}${result ? `<div class="cap" style="font-size:10px">${h(result.char)}</div>` : ''}</div></div>
          </div>
          <div style="flex:1;min-width:0">
            <div class="label">오늘의 뽑기 · ${canGacha ? '1/1' : '0/1'}</div>
            ${canGacha
              ? `<div class="t" style="font-size:15px;margin:2px 0 8px">오늘의 추천 피규어가<br>기다리고 있어</div><button class="cta theme" id="gacha-go" style="width:auto;padding:8px 16px;font-size:12px"><span>탭해서 공개</span></button>`
              : `<div class="t" style="font-size:14px;margin:2px 0 4px">${h(result?.name || '')}</div><div class="muted small">${result ? MK.rarity(result.rarity).label + ' · ' + h(result.price) : ''}</div>${result ? `<button class="cta sub" data-go="detail:${result.id}" style="width:auto;padding:7px 14px;font-size:12px;margin-top:8px"><span>상세 보기</span></button>` : ''}`}
          </div>
        </div>

        <div><div class="label" style="margin-bottom:6px">내 월드</div>
          <div class="grid3">${s.worlds.map(id => { const w = MK.world(id); return `<button class="poster wide" data-go="world:${id}" style="--theme:${w.theme};--on-theme:${w.on}">${slot(w.img, '', '')}<span class="cap">${h(w.title)}<br><span style="color:var(--theme)">${MK.completion(id)}%</span></span></button>`; }).join('')}
          ${s.worlds.length < 5 ? `<button class="poster wide none" data-go="onboarding"><span class="cap" style="text-align:center;left:0;right:0;bottom:40%">${ic('plus')} 월드 추가</span></button>` : ''}</div></div>

        <div><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px"><div class="label">신시대 랭킹</div><button class="small" style="color:var(--theme)" data-go="ranking">전체 ${ic('chevron-right')}</button></div>
          ${MK_NEWERA.kr.slice(0, 3).map(e => rankRow(e, true)).join('')}</div>

        <div><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px"><div class="label">재입고 · 신상</div></div>
          ${feed.map((f, i) => `<button class="row" data-go="detail:${f.id}" style="width:100%;text-align:left">
            ${slot('COUPANG-' + f.id, 'product thumb', '')}
            <div class="body"><div class="t">${h(f.name)}</div><div class="muted small">${MK.rarity(f.rarity).label} · ${h(f.price)}</div></div>
            ${i === 0 ? `<span class="brush" style="font-size:10px;padding:1px 8px;--theme:var(--theme2)">재입고</span>` : `<span class="chip"><span>신상</span></span>`}</button>`).join('')}</div>
      </div></div>`;
  };

  /* S3 월드 */
  V.world = (id, tab = 'cur', ch = '', rar = '') => {
    const w = MK.world(id); if (!w) return V.home();
    const allFigs = MK_FIGURES.filter(f => f.world === id);
    const figs = allFigs.filter(f => (!ch || f.char === ch) && (!rar || f.rarity === rar));
    const c = MK.counts(id);
    const byChar = w.chars.map(ch => ({ ch, n: figs.filter(f => f.char === ch).length, own: figs.filter(f => f.char === ch && MK.state.coll[f.id] === 'own').length }));
    return `<div class="view" data-theme-world="${id}">
      <div class="hero">${slot(w.img, '', '')}
        <div class="splat" style="width:130px;height:130px;right:-50px;top:-50px"></div>
        <div class="splat ink" style="width:9px;height:9px;right:96px;top:28px"></div>
        <button data-go="back" class="small" style="color:var(--fg);opacity:.8">${ic('chevron-left')}홈</button>
        <div class="label" style="color:var(--fg);opacity:.7;margin-top:8px">WORLD ${String(w.no).padStart(2, '0')}</div>
        <div class="display" style="font-size:36px">${h(w.title)}</div>
        <div class="stroke" style="width:150px;margin-top:8px"></div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:10px"><span class="muted small">피규어 ${figs.length}종 · 캐릭터 ${w.chars.length}명</span><span class="display" style="font-size:20px">도감 <span style="color:var(--theme)">${MK.completion(id)}%</span></span></div>
      </div>
      <div class="pad" style="display:flex;flex-direction:column;gap:14px">
        <div class="segtabs">${[['cur', '큐레이션'], ['chars', '캐릭터'], ['all', '전체 ' + figs.length]].map(([k, l]) => `<button class="${tab === k ? 'on' : ''}" data-go="world:${id}:${k}">${l}</button>`).join('')}</div>
        ${tab === 'cur' ? `
          ${w.post ? `<a class="panel" href="../posts/${w.post}/" target="_blank" style="display:flex;gap:12px;align-items:center">
            ${slot('IMG-POST-' + w.id, '', 'TOP 5<br>표지').replace('class="img-slot', 'style="width:64px;height:84px;flex:none" class="img-slot')}
            <div style="flex:1"><div class="label">큐레이션 · 블로그</div><div class="t">${h(w.title)} 피규어 추천 TOP 5</div><div class="muted small">입문용부터 소장용까지 · 5종</div></div><span class="muted">${ic('arrow-up-right')}</span></a>` : `<div class="panel flat muted small">큐레이션 글 준비 중</div>`}
          <div><div class="label" style="margin-bottom:6px">입문 추천 · 일반</div><div class="grid3">${figs.filter(f => f.rarity === 'common').slice(0, 3).map(posterFig).join('')}</div></div>
          <div><div class="label" style="margin-bottom:6px">소장용 · 레어 이상</div><div class="grid3">${figs.filter(f => f.rarity !== 'common').slice(0, 3).map(posterFig).join('')}</div></div>`
        : tab === 'chars' ? `<div class="grid3" style="gap:14px 8px">${byChar.map((x, i) => `<button data-go="world:${id}:all:${encodeURIComponent(x.ch)}" style="text-align:center"><div class="charring ${x.own ? (i === 1 ? 't2' : 't') : 'off'}">${h(x.ch)}</div><div class="muted" style="font-size:10px;margin-top:4px">${x.n}종 · ${x.own} 보유</div></button>`).join('')}</div>`
        : `<div class="chips">${chip('전체', !ch && !rar, `data-go="world:${id}:all"`)}${['common', 'rare', 'epic', 'legendary'].map(r => `<button class="chip r-${r} ${rar === r ? 'on' : ''}" data-go="world:${id}:all::${r}"><span>${MK.rarity(r).label}</span></button>`).join('')}${ch ? chip(ch + ' ✕', true, `data-go="world:${id}:all"`) : ''}</div>
           <div class="grid3">${figs.map(posterFig).join('') || '<div class="muted small" style="grid-column:1/-1;padding:20px;text-align:center">해당하는 피규어가 없어요</div>'}</div>`}
      </div></div>`;
  };

  /* S4 상세 (바텀시트 내부) */
  V.detail = (id) => {
    const f = MK.figure(id); if (!f) return '';
    const w = MK.world(f.world); const s = MK.state.coll[id]; const r = MK.rarity(f.rarity);
    const same = MK_FIGURES.filter(x => x.world === f.world && x.line === f.line && x.id !== id).slice(0, 3);
    return `<div class="body" data-theme-world="${w.id}">
      ${slot('COUPANG-' + f.id, 'product', '상품 이미지 캐러셀<br>(쿠팡 제공)').replace('class="img-slot', 'style="height:200px;transform:skew(-3deg)" class="img-slot')}
      <div style="margin-top:12px"><div class="muted small">${h(f.maker)} · ${h(f.line)}</div>
        <div class="display" style="font-size:22px;margin-top:2px">${h(f.name)}</div>
        <div class="chips" style="margin-top:8px">${rchip(f.rarity)}<span class="chip"><span>${h(f.size)}</span></span><span class="chip"><span>${h(f.price)}</span></span><span class="chip"><span>${h(w.title)}</span></span></div></div>
      <div class="panel" style="margin-top:12px"><div class="label">추천 이유</div><div class="small" style="margin-top:4px">${h(f.why)}</div></div>
      <details class="panel flat" style="margin-top:10px;padding:10px 12px"><summary class="label" style="cursor:pointer;list-style:none;display:flex;justify-content:space-between">정품 체크포인트 3 ${ic('chevron-down')}</summary>
        <ol class="small muted" style="margin:8px 0 0;padding-left:18px"><li>상자에 저작권 표기(ⓒ 원작자／출판사·제작위원회)와 제조사 로고</li><li>굿스마일·메가하우스는 홀로그램 정품 씰</li><li>시세보다 절반 이하로 싸면 의심</li></ol></details>
      <div style="margin-top:14px"><div class="label" style="margin-bottom:6px">${r.label} · ${h(r.hint)}</div></div>
      ${same.length ? `<div style="margin-top:6px"><div class="label" style="margin-bottom:6px">같은 라인 · 크기 맞추기</div><div class="grid3">${same.map(posterFig).join('')}</div></div>` : ''}
      <p class="muted" style="font-size:10px;margin-top:14px">가격대는 작성 시점의 대략적 시세입니다. 실제 가격은 쿠팡에서 확인하세요.</p>
    </div>
    <div class="foot" data-theme-world="${w.id}">
      <button class="cta sub" id="coll-btn" data-id="${f.id}" style="flex:0 0 118px"><span>${collLabel(s)}</span></button>
      ${f.coupangUrl ? `<a class="cta" href="${h(f.coupangUrl)}" target="_blank" rel="sponsored nofollow noopener" style="flex:1"><span>쿠팡에서 보기</span></a>` : `<span class="cta pending" style="flex:1"><span>쿠팡 링크 준비 중</span></span>`}
    </div>`;
  };

  /* S5 도감 */
  V.collection = (worldId, filter = 'all') => {
    const s = MK.state;
    const w = MK.world(worldId) || MK.world(s.worlds[0]) || MK_WORLDS[0]; const wid = w.id;
    const figs = MK_FIGURES.filter(f => f.world === wid).filter(f => filter === 'all' ? true : filter === 'own' ? s.coll[f.id] === 'own' : filter === 'wish' ? s.coll[f.id] === 'wish' : !s.coll[f.id]);
    const c = MK.counts(wid);
    return `<div class="view pad" data-theme-world="${wid}" style="display:flex;flex-direction:column;gap:12px;position:relative">
      <div class="splat ink" style="width:60px;height:60px;left:-26px;top:120px;opacity:.1"></div>
      <div style="display:flex;justify-content:space-between;align-items:center"><div class="display" style="font-size:26px">도감</div><button class="chip" data-go="share"><span>공유 카드 ${ic('arrow-up-right')}</span></button></div>
      <div class="chips">${s.worlds.map(id => chip(MK.world(id).title, id === wid, `data-go="collection:${id}"`)).join('')}</div>
      <div class="panel" style="display:flex;gap:14px;align-items:center">
        <div class="ring" style="--p:${MK.completion(wid)}"><span>${MK.completion(wid)}%</span></div>
        <div><div class="t">${h(w.title)}</div><div class="muted small">보유 ${c.own} · 위시 ${c.wish} · 미보유 ${c.none}</div><div class="muted" style="font-size:11px">일반 ${c.byR.common} · 레어 ${c.byR.rare} · 에픽 ${c.byR.epic} · 전설 ${c.byR.legendary}</div></div>
      </div>
      <div class="chips">${[['all', '전체'], ['own', '보유'], ['wish', '위시'], ['none', '미보유']].map(([k, l]) => chip(l, filter === k, `data-go="collection:${wid}:${k}"`)).join('')}</div>
      <div class="grid3">${figs.map(posterFig).join('') || '<div class="muted small" style="grid-column:1/-1;padding:20px;text-align:center">해당하는 피규어가 없어요</div>'}</div>
      <p class="muted" style="font-size:11px;text-align:center">탭하면 상세 · 상세에서 보유/위시 변경</p>
    </div>`;
  };

  /* 랭킹 공통 행 */
  function rankRow(e, compact) {
    const go = e.world ? `data-go="world:${e.world}"` : '';
    return `<button class="rank ${e.r <= 3 ? 'top3' : ''}" ${go} style="width:100%;text-align:left">
      <div class="no">${e.r}</div>
      <div class="body"><div class="t">${h(e.t)}</div><div class="meta"><span>${e.y}</span><span>${h(e.k)}</span>${!compact && e.note ? `<span>· ${h(e.note)}</span>` : ''}</div></div>
      <div class="fig" title="피규어 시장">${[1, 2, 3].map(i => `<i class="${i <= e.fig ? 'on' : ''}"></i>`).join('')}</div>
      ${e.world ? `<span class="go">월드 ${ic('chevron-right')}</span>` : ''}</button>`;
  }

  /* S6 랭킹 (신시대 + 레전드) */
  V.ranking = (section = 'newera', sub = 'kr') => {
    const isNew = section === 'newera';
    if (isNew && !MK_NEWERA[sub]) sub = 'kr';
    if (!isNew && !['all', ...MK_LEGEND.decades].includes(sub)) sub = 'all';
    const list = isNew ? MK_NEWERA[sub] : (sub === 'all' ? MK_LEGEND.list : MK_LEGEND.list.filter(e => e.d === sub));
    const region = isNew ? MK_NEWERA.regions.find(r => r.id === sub) : null;
    return `<div class="view" style="--theme:${isNew ? '#2fd36f' : '#ffcc33'};--theme2:${isNew ? '#ff7a1a' : '#f2f0ea'};--on-theme:#000;--g:${isNew ? '35%' : '30%'}">
      <div class="hero" style="padding-bottom:0">${slot(isNew ? 'IMG-RANK-NEWERA' : 'IMG-RANK-LEGEND', '', '')}
        <div class="splat" style="width:120px;height:120px;right:-44px;top:-44px"></div>
        <div class="segtabs" style="margin:0;padding:0;border:0">
          <button class="${isNew ? 'on' : ''}" data-go="ranking:newera:kr" style="font-size:15px">신시대</button>
          <button class="${!isNew ? 'on' : ''}" data-go="ranking:legend:all" style="font-size:15px">레전드</button></div>
        <div class="display" style="font-size:34px;margin-top:12px">${isNew ? '신시대' : '레전드'} <span class="brush" style="font-size:18px">TOP ${isNew ? 20 : 30}</span></div>
        <div class="muted small" style="margin:8px 0 12px">${isNew ? MK_NEWERA.meta.sub : MK_LEGEND.meta.sub}</div>
      </div>
      <div class="pad" style="display:flex;flex-direction:column;gap:10px">
        <div class="chips">${isNew
          ? MK_NEWERA.regions.map(r => chip(r.label, r.id === sub, `data-go="ranking:newera:${r.id}"`)).join('')
          : [['all', '전체'], ['80s', '1980s'], ['90s', '1990s'], ['00s', '2000s'], ['10s', '2010s']].map(([k, l]) => chip(l, sub === k, `data-go="ranking:legend:${k}"`)).join('')}</div>
        ${region ? `<div class="muted" style="font-size:11px">근거: ${h(region.src)} · 편집부 선정</div>` : `<div class="muted" style="font-size:11px">1980년대부터 지금까지 꾸준히 사랑받는 작품 · 편집부 선정</div>`}
        <div>${list.map(e => rankRow(e, false)).join('')}</div>
        <div class="panel flat muted" style="font-size:11px">막대 3칸 = 피규어 시장 규모(많음·보통·적음). "월드" 링크가 있는 작품은 피규어 도감이 열려 있어요.</div>
      </div></div>`;
  };

  /* S7 마이 */
  V.my = () => {
    const s = MK.state; const c = MK.counts();
    const quests = [
      { id: 'checkin', l: '데일리 체크인', xp: '+10 XP' }, { id: 'gacha', l: '오늘의 뽑기 열기', xp: '+10 XP' },
      { id: 'coll', l: '도감에 1개 담기', xp: '+20 XP' }, { id: 'half', l: '월드 하나 50% 달성', xp: '뱃지' },
    ];
    const today = MK.today();
    const done = (q) => q.id === 'half' ? s.badges.includes('half') : s.quests[q.id] === today;
    return `<div class="view pad" style="display:flex;flex-direction:column;gap:14px;position:relative">
      <div class="splat ink" style="width:70px;height:70px;left:-30px;top:60px;opacity:.12"></div>
      <div style="display:flex;gap:12px;align-items:center">
        <div class="charring" style="width:64px;height:64px;margin:0">${slot('IMG-AVATAR', '', '').replace('class="img-slot', 'style="width:100%;height:100%;border-radius:50%;border:0" class="img-slot')}</div>
        <div style="flex:1"><div class="t" style="font-size:16px">${h(s.nick || '컬렉터')}</div>
          <div style="display:flex;align-items:baseline;gap:8px"><span class="display" style="font-size:30px;color:var(--theme)">Lv ${MK.level()}</span><span class="muted small">다음 레벨까지 ${MK.XP_PER_LEVEL - MK.xpInLevel()} XP</span></div>
          <div class="xp" style="margin-top:4px"><i style="--w:${MK.xpInLevel() / MK.XP_PER_LEVEL * 100}%"></i></div></div></div>
      <div class="grid3">
        <div class="panel" style="text-align:center"><div class="display" style="font-size:22px">${MK.effectiveStreak()}</div><div class="label">연속 체크인</div></div>
        <div class="panel" style="text-align:center"><div class="display" style="font-size:22px">${c.own}</div><div class="label">보유 피규어</div></div>
        <div class="panel" style="text-align:center"><div class="display" style="font-size:22px">${s.worlds.length}</div><div class="label">월드</div></div></div>
      <div><div style="display:flex;justify-content:space-between"><div class="label">뱃지 <span class="muted">${s.badges.length}/${MK.BADGES.length}</span></div></div>
        <div style="display:flex;gap:10px;margin-top:8px;overflow-x:auto">${MK.BADGES.map(b => `<div class="gem ${s.badges.includes(b.id) ? 'on' : ''}">${h(b.name)}</div>`).join('')}</div></div>
      <div class="panel flat"><div class="label">오늘의 퀘스트</div>
        ${quests.map(q => `<div class="row"><span style="flex:1">${done(q) ? ic('circle-check', 'done') : ic('circle', 'todo')} ${q.l}</span><span class="muted small">${q.xp}</span></div>`).join('')}</div>
      <div class="muted small" style="display:flex;gap:14px;flex-wrap:wrap"><button data-go="onboarding">월드 다시 고르기</button><a href="../about/" target="_blank">소개·제휴 고지</a><button id="reset" style="color:#a55">데이터 초기화</button></div>
    </div>`;
  };

  /* S8 공유 카드 */
  V.share = (bg = 0) => {
    const s = MK.state; const w = MK.world(s.worlds[0]) || MK_WORLDS[0]; const wid = w.id;
    bg = [0, 1, 2, 3].includes(bg) ? bg : 0;
    const own = MK_FIGURES.filter(f => f.world === wid && s.coll[f.id] === 'own').slice(0, 5);
    const bgs = [{ n: '테마', v: `linear-gradient(180deg, color-mix(in srgb, ${w.theme} 45%, #000), #0d0d0f)` }, { n: '보조', v: `linear-gradient(180deg, color-mix(in srgb, ${w.theme2} 45%, #000), #0d0d0f)` }, { n: '종이', v: '#f2f0ea' }, { n: '먹', v: '#141416' }];
    const paper = bg === 2;
    return `<div class="view pad" data-theme-world="${wid}" style="display:flex;flex-direction:column;gap:12px;min-height:100%">
      <div style="display:flex;justify-content:space-between;align-items:center"><div class="t">공유 카드</div><button data-go="back" class="muted" aria-label="닫기">${ic('x')}</button></div>
      <div id="share-card" style="width:230px;aspect-ratio:9/16;margin:0 auto;position:relative;overflow:hidden;padding:14px;display:flex;flex-direction:column;background:${bgs[bg].v};color:${paper ? '#111' : 'var(--fg)'};border:1px solid var(--line)">
        <div class="splat" style="width:120px;height:120px;right:-60px;bottom:-30px;opacity:.5"></div>
        <div class="label" style="color:inherit;opacity:.6">MY-KITTY · WORLD ${String(w.no).padStart(2, '0')}</div>
        <div class="display" style="font-size:22px;margin-top:4px">${h(w.title)}<br><span class="brush" style="font-size:18px">도감 ${MK.completion(wid)}%</span></div>
        ${slot('COUPANG-' + (own[0]?.id || 'none'), 'product', '대표 피규어').replace('class="img-slot', 'style="height:100px;margin:12px 0 10px;transform:skew(-4deg)" class="img-slot')}
        <div class="label" style="color:inherit;opacity:.6">보유 TOP ${own.length}</div>
        <div style="font-size:10px;line-height:1.5">${own.map((f, i) => `<b>${i + 1}</b> ${h(f.name)}`).join('<br>') || '<span style="opacity:.6">아직 보유한 피규어가 없어요</span>'}</div>
        <div style="flex:1"></div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end"><div><div class="label" style="color:inherit;opacity:.6">LEVEL</div><div class="display" style="font-size:18px">${MK.level()}</div></div><div style="font-size:9px;opacity:.6">nakojin.github.io/my-kitty</div></div>
      </div>
      <div><div class="label" style="margin-bottom:6px">배경</div><div style="display:flex;gap:8px">${bgs.map((b, i) => `<button data-go="share:${i}" style="width:30px;height:30px;background:${b.v};transform:skew(-8deg);outline:${i === bg ? '2px solid #fff' : '1px solid #444'};outline-offset:2px" title="${b.n}"></button>`).join('')}</div></div>
      <div style="flex:1"></div>
      <div style="display:flex;gap:8px"><button class="cta sub" style="flex:1" id="share-save"><span>${ic('download')}이미지 저장</span></button><button class="cta sub" style="flex:1" id="share-copy"><span>${ic('link')}링크 복사</span></button><button class="cta theme" style="flex:1" id="share-go"><span>${ic('share-2')}공유</span></button></div>
    </div>`;
  };

  V.disclosure = disclosure;
  V.ic = ic;
  V.collLabel = collLabel;
  window.V = V;
})();
