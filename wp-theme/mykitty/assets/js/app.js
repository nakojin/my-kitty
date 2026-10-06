// 워드프레스용 클라이언트. 프로토타입 js/app.js 의 시트·토스트·도감 상태 칠하기 부분만 가져왔다.
// 서버가 HTML 을 렌더하고, 이 스크립트는 (1) 피규어 카드에 보유/위시 상태를 칠하고
// (2) [data-sheet] 링크를 바텀시트로 열고 (3) 도감 담기 버튼과 완성도 숫자를 다룬다.
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const sheetWrap = $('#sheet'), sheetInner = $('#sheet-inner');
  if (!window.MK) return;

  /* 상태 칠하기 */
  function paint(root = document) {
    root.querySelectorAll('[data-figure]').forEach(el => {
      const s = MK.state.coll[el.dataset.figure];
      el.classList.remove('on', 'wish', 'none');
      el.classList.add(s === 'own' ? 'on' : s === 'wish' ? 'wish' : 'none');
      const tag = el.querySelector('.tag'); if (tag) tag.style.display = s ? 'none' : '';
    });
    root.querySelectorAll('[data-completion]').forEach(el => { el.textContent = MK.completion(el.dataset.completion) + '%'; });
    root.querySelectorAll('[data-char-ring]').forEach(el => {
      const ids = el.dataset.charRing.split(',').filter(Boolean);
      const own = ids.filter(id => MK.state.coll[id] === 'own').length;
      const ring = el.querySelector('.charring'); if (ring) { ring.classList.toggle('off', !own); ring.classList.toggle(el.dataset.alt || 't', !!own); }
      const n = el.querySelector('[data-own-count]'); if (n) n.textContent = own;
    });
    root.querySelectorAll('[data-coll]').forEach(btn => {
      const s = MK.state.coll[btn.dataset.coll];
      btn.querySelector('span').textContent = s === 'own' ? '✓ 보유 중' : s === 'wish' ? '♡ 위시' : '♡ 도감 담기';
    });
  }

  /* 토스트 */
  let toastTimer;
  function toast(msg) {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; $('#device').appendChild(t); }
    t.className = 'toast'; t.innerHTML = `<span>${msg}</span>`;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.classList.add('gone'); setTimeout(() => t.remove(), 350); }, 1800);
  }

  /* 바텀시트: 피규어 링크를 가로채서 ?partial=1 로 본문만 받아 끼운다 */
  async function openSheet(url) {
    if (!sheetWrap) { location.href = url; return; }
    sheetInner.innerHTML = '<div class="body muted small" style="text-align:center;padding:40px">불러오는 중…</div>';
    sheetWrap.classList.add('open');
    try {
      const u = new URL(url, location.href); u.searchParams.set('partial', '1');
      const html = await (await fetch(u, { credentials: 'same-origin' })).text();
      sheetInner.innerHTML = html;
      paint(sheetInner);
      history.replaceState(null, '', url);
    } catch { location.href = url; }
  }
  function closeSheet() {
    if (!sheetWrap || !sheetWrap.classList.contains('open')) return;
    sheetWrap.classList.remove('open');
    history.replaceState(null, '', location.pathname.replace(/figure\/[^/]+\/?$/, '') || '/');
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-sheet]');
    if (link && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openSheet(link.href); return; }

    const coll = e.target.closest('[data-coll]');
    if (coll) {
      const id = coll.dataset.coll; const cur = MK.state.coll[id];
      const next = !cur ? 'wish' : cur === 'wish' ? 'own' : null;
      MK.setColl(id, next);
      toast(next === 'wish' ? '♡ 위시에 담았어요' : next === 'own' ? '✓ 보유로 등록! +20 XP' : '도감에서 뺐어요');
      paint();
      MK.checkBadges().forEach(b => setTimeout(() => toast(`🏅 뱃지 획득 — ${b.name}`), 900));
      return;
    }

    if (e.target.closest('#sheet .dim')) closeSheet();

    const share = e.target.closest('[data-share-url]');
    if (share) { e.preventDefault(); navigator.clipboard?.writeText(share.dataset.shareUrl); toast('링크를 복사했어요'); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

  // 탭바 테마색 = 사용자의 대표 월드 (온보딩 전엔 첫 월드)
  const main = MK.world(MK.state.worlds[0]) || (window.MK_WORLDS || [])[0];
  if (main) MK.applyTheme(document.body, main);

  paint();
  window.MKApp = { paint, toast, openSheet, closeSheet };
})();
