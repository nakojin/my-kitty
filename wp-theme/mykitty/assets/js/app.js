// 워드프레스용 클라이언트. 서버가 HTML 을 렌더하고, 이 스크립트는 사용자 상태(store.js)를 화면에 칠한다.
// 화면별 바인딩은 body 안 [data-screen] 값으로 고른다: home · collection · my · onboarding · share · ranking · (월드/상세는 공통만)
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ENV = window.MK_ENV || {};
  const sheetWrap = $('#sheet'), sheetInner = $('#sheet-inner');
  if (!window.MK) return;
  const today = () => MK.today();
  const h = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ── 공통: 상태 칠하기 ── */
  function paint(root = document) {
    $$('[data-figure]', root).forEach(el => {
      const s = MK.state.coll[el.dataset.figure];
      el.classList.remove('on', 'wish', 'none');
      el.classList.add(s === 'own' ? 'on' : s === 'wish' ? 'wish' : 'none');
      const tag = el.querySelector('.tag'); if (tag) tag.style.display = s ? 'none' : '';
    });
    $$('[data-completion]', root).forEach(el => { el.textContent = MK.completion(el.dataset.completion) + '%'; });
    $$('[data-ring]', root).forEach(el => { el.style.setProperty('--p', MK.completion(el.dataset.ring)); });
    $$('[data-char-ring]', root).forEach(el => {
      const own = el.dataset.charRing.split(',').filter(id => MK.state.coll[id] === 'own').length;
      const ring = el.querySelector('.charring'); if (ring) { ring.classList.toggle('off', !own); ring.classList.toggle(el.dataset.alt || 't', !!own); }
      const n = el.querySelector('[data-own-count]'); if (n) n.textContent = own;
    });
    $$('[data-coll]', root).forEach(btn => {
      const s = MK.state.coll[btn.dataset.coll];
      btn.querySelector('span').textContent = s === 'own' ? '✓ 보유 중' : s === 'wish' ? '♡ 위시' : '♡ 도감 담기';
    });
    $$('[data-level]', root).forEach(el => el.textContent = MK.level());
    $$('[data-streak]', root).forEach(el => el.textContent = MK.effectiveStreak());
  }

  /* ── 토스트 ── */
  let toastTimer, toastRemove;
  function toast(msg) {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; ($('#device') || document.body).appendChild(t); }
    clearTimeout(toastTimer); clearTimeout(toastRemove);
    t.className = 'toast'; t.innerHTML = `<span>${msg}</span>`;
    toastTimer = setTimeout(() => { t.classList.add('gone'); toastRemove = setTimeout(() => t.remove(), 350); }, 1800);
  }
  const announceBadges = () => MK.takeBadges().forEach((b, i) => setTimeout(() => toast(`🏅 뱃지 획득 — ${b.name}`), 900 + i * 600));

  /* ── 바텀시트 ── */
  async function openSheet(url) {
    if (!sheetWrap) { location.href = url; return; }
    sheetInner.innerHTML = '<div class="body muted small" style="text-align:center;padding:40px">불러오는 중…</div>';
    sheetWrap.classList.add('open');
    try {
      const u = new URL(url, location.href); u.searchParams.set('partial', '1');
      const res = await fetch(u, { credentials: 'same-origin' }); if (!res.ok) throw new Error(res.status);
      sheetInner.innerHTML = await res.text();
      paint(sheetInner);
      sheetWrap.dataset.returnUrl = location.href;
      history.pushState({ sheet: url }, '', url);
    } catch { location.href = url; }
  }
  function closeSheet(fromPop) {
    if (!sheetWrap || !sheetWrap.classList.contains('open')) return;
    sheetWrap.classList.remove('open');
    if (!fromPop && history.state && history.state.sheet) history.back();
  }
  window.addEventListener('popstate', () => closeSheet(true));

  /* ── 로그인 동기화 (REST) ── */
  let syncTimer;
  function syncUp() {
    if (!ENV.logged) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => fetch(ENV.rest + 'state', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': ENV.nonce }, body: JSON.stringify(MK.state) }).catch(() => {}), 800);
  }
  async function syncDown() {
    if (!ENV.logged) return;
    try {
      const remote = await (await fetch(ENV.rest + 'state', { credentials: 'same-origin', headers: { 'X-WP-Nonce': ENV.nonce } })).json();
      if (remote && typeof remote === 'object' && Object.keys(remote).length) {
        // 서버 상태를 기준으로 하되, 이 기기에만 있는 도감 항목은 합친다.
        const local = MK.state;
        Object.assign(local, remote, { coll: Object.assign({}, local.coll, remote.coll || {}) });
        MK.save(); paint(); renderScreen();
      } else { syncUp(); }
    } catch {}
  }
  // store.js 는 저장할 때마다 mk:save 를 쏜다 (내부 save() 호출 포함). 그걸 듣고 서버에 올린다.
  document.addEventListener('mk:save', syncUp);

  /* ── 화면: 홈 ── */
  function renderHome() {
    const root = $('[data-screen="home"]'); if (!root) return;
    const s = MK.state;
    if (!s.onboarded) { location.replace(ENV.onboarding); return; }
    const main = MK.world(s.worlds[0]) || window.MK_WORLDS[0];
    if (main) { MK.applyTheme($('[data-main-world]'), main); const hs = $('[data-hero-slot]'); if (hs) { hs.dataset.slot = main.img; hs.innerHTML = `<img src="${ENV.imgBase}${main.img}.webp" alt="" onerror="this.remove()">`; } }

    const checked = MK.checkedToday(); const idx = (new Date().getDay() + 6) % 7; const st = MK.effectiveStreak();
    $$('[data-day]').forEach(el => { const back = checked ? idx - +el.dataset.day : idx - 1 - +el.dataset.day; el.classList.toggle('on', back >= 0 && back < st); });
    $$('[data-streak]').forEach(el => el.textContent = st);
    const ci = $('[data-checkin]'); if (ci) { ci.disabled = checked; ci.classList.toggle('on', !checked); ci.querySelector('span').textContent = checked ? '오늘 완료 ✓' : '체크인 +10XP'; }

    const can = MK.canGacha(); const g = $('[data-gacha]'); const txt = $('[data-gacha-text]'); const result = s.gachaResult ? MK.figure(s.gachaResult) : null;
    if (g) {
      g.classList.toggle('idle', can); g.classList.toggle('flipped', !can && !!result);
      if (!can && result) $('[data-gacha-back]').innerHTML = `<div class="img-slot product" data-slot="COUPANG-${result.id}">${result.img ? `<img src="${h(result.img)}" alt="">` : ''}</div><div class="cap" style="font-size:10px">${h(result.char)}</div>`;
    }
    if (txt && !can && result) txt.innerHTML = `<div class="label">오늘의 뽑기 · 0/1</div><div class="t" style="font-size:14px;margin:2px 0 4px">${h(result.name)}</div><div class="muted small">${MK.rarity(result.rarity).label} · ${h(result.price)}</div><a class="cta sub" href="${h(result.url || '#')}" data-sheet style="width:auto;padding:7px 14px;font-size:12px;margin-top:8px;display:inline-block"><span>상세 보기</span></a>`;

    const mw = $('[data-my-worlds]');
    if (mw) mw.innerHTML = s.worlds.map(id => { const w = MK.world(id); if (!w) return ''; return `<a class="poster wide" href="${h(w.url)}" style="--theme:${w.theme};--on-theme:${w.on}"><div class="img-slot" data-slot="${w.img}"><img src="${ENV.imgBase}${w.img}.webp" alt="" onerror="this.remove()"> </div><span class="cap">${h(w.title)}<br><span style="color:var(--theme)">${MK.completion(id)}%</span></span></a>`; }).join('')
      + (s.worlds.length < 5 ? `<a class="poster wide none" href="${ENV.onboarding}"><span class="cap" style="text-align:center;left:0;right:0;bottom:40%">+ 월드 추가</span></a>` : '');
  }
  function bindHome() {
    const root = $('[data-screen="home"]'); if (!root) return;
    $('[data-checkin]')?.addEventListener('click', () => { if (MK.checkin()) { toast('🔥 체크인 완료 +10 XP'); renderHome(); paint(); announceBadges(); } });
    const doGacha = () => {
      if (!MK.canGacha()) return;
      const pick = MK.gacha(); if (!pick) { toast('뽑을 피규어가 없어요'); return; }
      const g = $('[data-gacha]');
      g.classList.remove('idle');
      $('[data-gacha-back]').innerHTML = `<div class="img-slot product" data-slot="COUPANG-${pick.id}">${pick.img ? `<img src="${h(pick.img)}" alt="">` : ''}</div><div class="cap" style="font-size:10px">${h(pick.char)}</div>`;
      g.classList.add('flipped');
      setTimeout(() => { toast(`✨ ${h(pick.name)}`); renderHome(); setTimeout(() => pick.url && openSheet(pick.url), 700); }, 950);
    };
    $('[data-gacha]')?.addEventListener('click', doGacha); $('[data-gacha-go]')?.addEventListener('click', doGacha);
  }

  /* ── 화면: 도감 ── */
  function renderCollection() {
    const root = $('[data-screen="collection"]'); if (!root) return;
    const s = MK.state;
    // 내가 고른 월드 칩만. (아직 온보딩 전이면 전부)
    $$('[data-my-world]').forEach(el => el.style.display = (!s.worlds.length || s.worlds.includes(el.dataset.myWorld)) ? '' : 'none');
    const grid = $('[data-figure-grid]'); if (!grid) return;
    const wid = grid.dataset.world; const c = MK.counts(wid);
    const set = (k, v) => { const el = $(`[data-count="${k}"]`); if (el) el.textContent = v; };
    set('own', c.own); set('wish', c.wish); set('none', c.none); Object.entries(c.byR).forEach(([k, v]) => set(k, v));
    applyFilter(grid.dataset.filter || 'all');
  }
  function applyFilter(f) {
    const grid = $('[data-figure-grid]'); if (!grid) return; grid.dataset.filter = f;
    $$('[data-filter]').forEach(b => b.classList.toggle('on', b.dataset.filter === f));
    let shown = 0;
    $$('[data-figure]', grid).forEach(el => {
      const s = MK.state.coll[el.dataset.figure];
      const ok = f === 'all' || (f === 'own' && s === 'own') || (f === 'wish' && s === 'wish') || (f === 'none' && !s);
      el.style.display = ok ? '' : 'none'; if (ok) shown++;
    });
    const empty = $('[data-empty]'); if (empty) empty.style.display = shown ? 'none' : '';
  }
  function bindCollection() { $$('[data-filter]').forEach(b => b.addEventListener('click', () => applyFilter(b.dataset.filter))); }

  /* ── 화면: 마이 ── */
  function renderMy() {
    const root = $('[data-screen="my"]'); if (!root) return;
    const s = MK.state; const c = MK.counts();
    if (s.nick && !ENV.logged) { const n = $('[data-nick]'); if (n) n.textContent = s.nick; }
    $('[data-xp-left]').textContent = MK.XP_PER_LEVEL - MK.xpInLevel();
    $('[data-xp-bar]').style.setProperty('--w', (MK.xpInLevel() / MK.XP_PER_LEVEL * 100) + '%');
    $('[data-own-total]').textContent = c.own; $('[data-world-total]').textContent = s.worlds.length;
    $$('[data-badge]').forEach(el => el.classList.toggle('on', s.badges.includes(el.dataset.badge)));
    $('[data-badge-count]').textContent = `${s.badges.length}/${MK.BADGES.length}`;
    $$('[data-quest]').forEach(el => { const q = el.dataset.quest; const done = q === 'half' ? s.badges.includes('half') : s.quests[q] === today(); el.querySelector('[data-quest-mark]').textContent = done ? '✅' : '☐'; });
  }
  function bindMy() { $('[data-reset]')?.addEventListener('click', () => { if (confirm('이 기기의 도감·레벨 데이터를 초기화할까요?')) { MK.reset(); location.href = ENV.onboarding; } }); }

  /* ── 화면: 온보딩 ── */
  function renderOnboarding() {
    const root = $('[data-screen="onboarding"]'); if (!root) return;
    const sel = MK.state.worlds;
    $$('[data-ob]').forEach(b => b.classList.toggle('on', sel.includes(b.dataset.ob)));
    $('[data-ob-count]').textContent = sel.length;
    $('[data-ob-next]').disabled = sel.length < 3;
  }
  function bindOnboarding() {
    const root = $('[data-screen="onboarding"]'); if (!root) return;
    $$('[data-ob]').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.ob; const ws = MK.state.worlds;
      if (ws.includes(id)) ws.splice(ws.indexOf(id), 1); else if (ws.length < 5) ws.push(id); else { toast('최대 5개까지 고를 수 있어요'); return; }
      MK.save(); renderOnboarding();
    }));
    $('[data-ob-next]').addEventListener('click', () => {
      if (!MK.state.onboarded) { MK.state.onboarded = true; MK.state.nick = MK.state.nick || '컬렉터'; MK.save(); MK.checkin(); }
      location.href = ENV.home;
    });
  }

  /* ── 화면: 공유 카드 ── */
  function shareModel() {
    const s = MK.state; const wid = s.worlds[0] || (window.MK_WORLDS[0] || {}).id; const w = MK.world(wid) || {};
    const own = window.MK_FIGURES.filter(f => f.world === wid && s.coll[f.id] === 'own').slice(0, 5);
    const bgs = [
      { n: '테마', css: `linear-gradient(180deg, color-mix(in srgb, ${w.theme} 45%, #000), #0d0d0f)`, c0: w.theme, dark: true },
      { n: '보조', css: `linear-gradient(180deg, color-mix(in srgb, ${w.theme2} 45%, #000), #0d0d0f)`, c0: w.theme2, dark: true },
      { n: '종이', css: '#f2f0ea', c0: '#f2f0ea', dark: false },
      { n: '먹', css: '#141416', c0: '#141416', dark: true },
    ];
    return { s, w, wid, own, bgs, pct: MK.completion(wid), level: MK.level() };
  }
  let shareBg = 0;
  function renderShare() {
    const card = $('[data-share-card]'); if (!card) return;
    const m = shareModel(); const bg = m.bgs[shareBg];
    MK.applyTheme(card.parentElement, m.w);
    card.style.background = bg.css; card.style.color = bg.dark ? '#f2f0ea' : '#111';
    card.innerHTML = `
      <div class="splat" style="width:120px;height:120px;right:-60px;bottom:-30px;opacity:.5"></div>
      <div class="label" style="color:inherit;opacity:.6">${h(ENV.siteName || 'MY-KITTY')} · WORLD ${String(m.w.no || 0).padStart(2, '0')}</div>
      <div class="display" style="font-size:22px;margin-top:4px">${h(m.w.title)}<br><span class="brush" style="font-size:18px">도감 ${m.pct}%</span></div>
      <div class="img-slot product" style="height:100px;margin:12px 0 10px;transform:skew(-4deg)" data-slot="COUPANG-${m.own[0]?.id || 'none'}">${m.own[0]?.img ? `<img src="${h(m.own[0].img)}" alt="">` : '대표 피규어'}</div>
      <div class="label" style="color:inherit;opacity:.6">보유 TOP ${m.own.length}</div>
      <div style="font-size:10px;line-height:1.5">${m.own.map((f, i) => `<b>${i + 1}</b> ${h(f.name)}`).join('<br>') || '<span style="opacity:.6">아직 보유한 피규어가 없어요</span>'}</div>
      <div style="flex:1"></div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end"><div><div class="label" style="color:inherit;opacity:.6">LEVEL</div><div class="display" style="font-size:18px">${m.level}</div></div><div style="font-size:9px;opacity:.6">${h(ENV.shareHost || '')}</div></div>`;
    $('[data-share-bgs]').innerHTML = m.bgs.map((b, i) => `<button type="button" data-share-bg="${i}" title="${b.n}" style="width:30px;height:30px;background:${b.css};transform:skew(-8deg);outline:${i === shareBg ? '2px solid #fff' : '1px solid #444'};outline-offset:2px"></button>`).join('');
  }
  // 캔버스 PNG — 이미지 없이 텍스트·도형만. (상품 이미지는 CORS 때문에 넣지 않는다)
  function drawShareCanvas() {
    const cv = $('[data-share-canvas]'); if (!cv) return null;
    const m = shareModel(); const bg = m.bgs[shareBg]; const ctx = cv.getContext('2d'); const W = cv.width, H = cv.height;
    const fg = bg.dark ? '#f2f0ea' : '#111';
    if (bg.css.startsWith('linear')) { const gr = ctx.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, bg.c0); gr.addColorStop(1, '#0d0d0f'); ctx.fillStyle = gr; } else ctx.fillStyle = bg.css;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = m.w.theme2 || '#ff7a1a'; ctx.globalAlpha = .5; ctx.beginPath(); ctx.arc(W + 60, H - 240, 300, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = fg; ctx.font = '600 34px system-ui, sans-serif'; ctx.globalAlpha = .6; ctx.fillText(`${ENV.siteName || 'MY-KITTY'} · WORLD ${String(m.w.no || 0).padStart(2, '0')}`, 80, 160); ctx.globalAlpha = 1;
    ctx.font = '900 120px system-ui, sans-serif'; ctx.save(); ctx.transform(1, 0, -0.1, 1, 0, 0); ctx.fillText(m.w.title || '', 100, 300);
    ctx.fillStyle = m.w.theme || '#2fd36f'; ctx.fillRect(70, 340, 560, 120); ctx.fillStyle = m.w.on || '#000'; ctx.font = '900 84px system-ui, sans-serif'; ctx.fillText(`도감 ${m.pct}%`, 100, 432); ctx.restore();
    ctx.fillStyle = fg; ctx.globalAlpha = .6; ctx.font = '600 34px system-ui, sans-serif'; ctx.fillText(`보유 TOP ${m.own.length}`, 80, 620); ctx.globalAlpha = 1;
    ctx.font = '500 44px system-ui, sans-serif'; m.own.forEach((f, i) => ctx.fillText(`${i + 1}  ${f.name}`, 80, 700 + i * 70));
    if (!m.own.length) { ctx.globalAlpha = .6; ctx.fillText('아직 보유한 피규어가 없어요', 80, 700); ctx.globalAlpha = 1; }
    ctx.globalAlpha = .6; ctx.font = '600 34px system-ui, sans-serif'; ctx.fillText('LEVEL', 80, H - 200); ctx.fillText(ENV.shareHost || '', W - 80 - ctx.measureText(ENV.shareHost || '').width, H - 120); ctx.globalAlpha = 1;
    ctx.font = '900 96px system-ui, sans-serif'; ctx.fillText(String(m.level), 80, H - 110);
    return cv;
  }
  function bindShare() {
    const root = $('[data-screen="share"]'); if (!root) return;
    root.addEventListener('click', (e) => { const b = e.target.closest('[data-share-bg]'); if (b) { shareBg = +b.dataset.shareBg; renderShare(); } });
    $('[data-share-copy]').addEventListener('click', () => { navigator.clipboard?.writeText(ENV.home); toast('링크를 복사했어요'); });
    $('[data-share-save]').addEventListener('click', () => {
      const cv = drawShareCanvas(); if (!cv) return;
      const a = document.createElement('a'); a.download = `mykitty-${shareModel().wid}-${today()}.png`; a.href = cv.toDataURL('image/png'); a.click(); toast('이미지를 저장했어요');
    });
    $('[data-share-go]').addEventListener('click', async () => {
      const cv = drawShareCanvas(); const m = shareModel();
      if (navigator.share && cv) {
        try { const blob = await new Promise(r => cv.toBlob(r, 'image/png')); const file = new File([blob], 'mykitty.png', { type: 'image/png' });
          await navigator.share({ title: `${m.w.title} 도감 ${m.pct}%`, text: `${ENV.siteName || '마이키티'}에서 피규어 도감을 모으고 있어요`, url: ENV.home, ...(navigator.canShare?.({ files: [file] }) ? { files: [file] } : {}) }); return; } catch {}
      }
      navigator.clipboard?.writeText(ENV.home); toast('공유를 지원하지 않는 브라우저라 링크를 복사했어요');
    });
  }

  /* ── 공통 이벤트 ── */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-sheet]');
    if (link && !e.metaKey && !e.ctrlKey && link.getAttribute('href') && link.getAttribute('href') !== '#') { e.preventDefault(); openSheet(link.href); return; }
    const coll = e.target.closest('[data-coll]');
    if (coll) {
      const id = coll.dataset.coll; const cur = MK.state.coll[id]; const next = !cur ? 'wish' : cur === 'wish' ? 'own' : null;
      const first = !MK.state.xpColl[id]; MK.setColl(id, next); toast(next === 'wish' ? '♡ 위시에 담았어요' + (first ? ' +20 XP' : '') : next === 'own' ? '✓ 보유로 등록!' : '도감에서 뺐어요');
      paint(); renderScreen(); announceBadges(); return;
    }
    if (e.target.closest('#sheet .dim')) closeSheet(false);
    const share = e.target.closest('[data-share-url]');
    if (share) { e.preventDefault(); navigator.clipboard?.writeText(share.dataset.shareUrl); toast('링크를 복사했어요'); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(false); });

  function renderScreen() { renderHome(); renderCollection(); renderMy(); renderOnboarding(); renderShare(); }

  // 탭바 테마색 = 대표 월드
  const main = MK.world(MK.state.worlds[0]) || (window.MK_WORLDS || [])[0];
  if (main) MK.applyTheme(document.body, main);

  paint(); renderScreen();
  bindHome(); bindCollection(); bindMy(); bindOnboarding(); bindShare();
  syncDown();
  window.MKApp = { paint, toast, openSheet, closeSheet, renderScreen };
})();
