// 라우터 + 이벤트. 해시 기반: #home, #world:kny:all:탄지로:rare, #ranking:newera:jp, #collection:kny:own, #detail:kny-01 (시트)
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const screen = $('#screen'), tabbar = $('#tabbar'), sheetWrap = $('#sheet'), sheetBody = $('#sheet-inner');
  const stack = [];          // 화면 이력 (시트는 쌓지 않음)
  let viaBack = false;       // go('back') 로 인한 해시 변경인지

  const TABS = [['home', '홈', '⌂'], ['ranking', '랭킹', '▲'], ['collection', '도감', '▦'], ['my', '마이', '◉']];
  const dec = (s) => { try { return decodeURIComponent(s || ''); } catch { return ''; } };

  function route() {
    const hash = (location.hash || '#home').slice(1);
    const [name, ...args] = hash.split(':');
    if (!MK.state.onboarded && name !== 'onboarding') { location.replace('#onboarding'); return; }

    if (name === 'detail') {
      // 새로고침 등으로 시트 해시에 바로 들어오면 뒤 화면(홈)을 먼저 그린다.
      if (!screen.innerHTML) { renderScreen('home', []); }
      openSheet(args[0]);
      return;
    }
    closeSheet(true);
    renderScreen(name, args);

    // 이력: 같은 화면 안의 탭/필터 변경은 교체, 다른 화면이면 push. 뒤로가기로 온 변경은 pop.
    if (viaBack) { viaBack = false; }
    else {
      const last = stack[stack.length - 1];
      if (last !== hash) { if (last && last.split(':')[0] === name) stack[stack.length - 1] = hash; else stack.push(hash); }
    }
  }

  function renderScreen(name, args) {
    let html = '';
    switch (name) {
      case 'onboarding': html = V.onboarding(); break;
      case 'world': html = V.world(args[0], args[1] || 'cur', dec(args[2]), args[3] || ''); break;
      case 'collection': html = V.collection(args[0], args[1] || 'all'); break;
      case 'ranking': html = V.ranking(args[0] || 'newera', args[1] || (args[0] === 'legend' ? 'all' : 'kr')); break;
      case 'my': html = V.my(); break;
      case 'share': html = V.share(Number(args[0] || 0)); break;
      default: name = 'home'; html = V.home();
    }
    screen.innerHTML = html;
    screen.scrollTop = 0;
    applyThemes(screen);
    tabbar.style.display = name === 'onboarding' || name === 'share' ? 'none' : '';
    tabbar.innerHTML = TABS.map(([k, l, i]) => `<button class="${name === k || (name === 'world' && k === 'home') ? 'on' : ''}" data-go="${k}"><span class="ico">${i}</span>${l}</button>`).join('');
    bind(name);
  }

  function applyThemes(root) {
    root.querySelectorAll('[data-theme-world]').forEach(el => MK.applyTheme(el, el.dataset.themeWorld));
    const main = MK.world(MK.state.worlds[0]); if (main) MK.applyTheme(document.body, main);
  }

  function go(target) {
    if (target === 'back') { stack.pop(); viaBack = true; location.hash = '#' + (stack[stack.length - 1] || 'home'); return; }
    location.hash = '#' + target;
  }

  /* 바텀시트 */
  function openSheet(id) {
    if (!MK.figure(id)) { closeSheet(false); return; }
    sheetBody.innerHTML = V.detail(id);
    applyThemes(sheetBody);
    sheetWrap.classList.add('open');
    const btn = $('#coll-btn', sheetBody);
    btn && btn.addEventListener('click', () => {
      const cur = MK.state.coll[id];
      const next = !cur ? 'wish' : cur === 'wish' ? 'own' : null;
      MK.setColl(id, next);
      toast(next === 'wish' ? '♡ 위시에 담았어요' + (MK.state.xpColl[id] ? ' +20 XP' : '') : next === 'own' ? '✓ 보유로 등록!' : '도감에서 뺐어요');
      btn.querySelector('span').textContent = next === 'own' ? '✓ 보유 중' : next === 'wish' ? '♡ 위시' : '♡ 도감 담기';
      announceBadges();
    });
  }
  // 시트를 닫을 때 뒤 화면을 다시 그리지 않도록 해시만 조용히 교체한다.
  function closeSheet(silent) {
    if (!sheetWrap.classList.contains('open')) return;
    sheetWrap.classList.remove('open');
    if (!silent || location.hash.startsWith('#detail')) {
      window.history.replaceState(null, '', '#' + (stack[stack.length - 1] || 'home'));
      if (!screen.innerHTML) renderScreen('home', []);
      else { refreshCards(); }
    }
  }
  // 시트에서 바뀐 보유/위시 상태를 뒤 화면 카드에만 반영 (전체 재렌더 없이)
  function refreshCards() {
    screen.querySelectorAll('.poster[data-go^="detail:"]').forEach(el => {
      const id = el.dataset.go.slice(7); const s = MK.state.coll[id];
      el.classList.remove('on', 'wish', 'none'); el.classList.add(s === 'own' ? 'on' : s === 'wish' ? 'wish' : 'none');
      const tag = el.querySelector('.tag'); if (tag) tag.style.display = s ? 'none' : '';
    });
  }
  $('#sheet .dim').addEventListener('click', () => closeSheet(false));

  /* 토스트 */
  let toastTimer, toastRemove;
  function toast(msg) {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; $('#device').appendChild(t); }
    clearTimeout(toastTimer); clearTimeout(toastRemove);
    t.className = 'toast'; t.innerHTML = `<span>${msg}</span>`;
    toastTimer = setTimeout(() => { t.classList.add('gone'); toastRemove = setTimeout(() => t.remove(), 350); }, 1800);
  }
  const announceBadges = () => MK.takeBadges().forEach((b, i) => setTimeout(() => toast(`🏅 뱃지 획득 — ${b.name}`), 900 + i * 700));

  /* 화면별 바인딩 */
  function bind(name) {
    if (name === 'onboarding') {
      screen.querySelectorAll('[data-ob]').forEach(b => b.addEventListener('click', () => {
        const id = b.dataset.ob; const ws = MK.state.worlds;
        if (ws.includes(id)) ws.splice(ws.indexOf(id), 1); else if (ws.length < 5) ws.push(id); else { toast('최대 5개까지 고를 수 있어요'); return; }
        MK.save(); screen.innerHTML = V.onboarding(); applyThemes(screen); bind(name);
      }));
      const next = $('#ob-next');
      next && next.addEventListener('click', () => {
        if (!MK.state.onboarded) { MK.state.onboarded = true; MK.state.nick = '컬렉터'; MK.save(); MK.checkin(); toast('🔥 첫 체크인! +10 XP'); }
        stack.length = 0; go('home');
      });
    }
    if (name === 'home') {
      const ci = $('#checkin'); ci && ci.addEventListener('click', () => { if (MK.checkin()) { toast('🔥 체크인 완료 +10 XP'); route(); announceBadges(); } });
      const g = $('#gacha'), gb = $('#gacha-go');
      const doGacha = () => {
        if (!MK.canGacha()) return;
        const pick = MK.gacha(); if (!pick) { toast('뽑을 피규어가 없어요'); return; }
        g.classList.remove('idle');
        g.querySelector('.back').innerHTML = `<div class="img-slot product" data-slot="COUPANG-${pick.id}">${pick.img ? `<img src="${pick.img}" alt="">` : ''}</div><div class="cap" style="font-size:10px">${pick.char}</div>`;
        g.classList.add('flipped');
        setTimeout(() => {
          toast(`✨ ${pick.name}`); announceBadges();
          setTimeout(() => { if ((location.hash || '#home') === '#home') go('detail:' + pick.id); }, 700);
        }, 950);
      };
      g && g.addEventListener('click', doGacha); gb && gb.addEventListener('click', doGacha);
    }
    if (name === 'my') { const r = $('#reset'); r && r.addEventListener('click', () => { if (confirm('프로토타입 데이터를 초기화할까요?')) { MK.reset(); stack.length = 0; location.hash = '#onboarding'; } }); }
    if (name === 'share') {
      $('#share-save')?.addEventListener('click', () => toast('실제 서비스에서는 PNG로 저장돼요'));
      $('#share-copy')?.addEventListener('click', () => { navigator.clipboard?.writeText(location.href.split('#')[0]); toast('링크를 복사했어요'); });
      $('#share-go')?.addEventListener('click', () => toast('공유 시트가 열려요 (프로토타입)'));
    }
  }

  /* 전역 클릭: data-go */
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-go]'); if (!el) return;
    if (el.tagName === 'A') return;
    e.preventDefault(); go(el.dataset.go);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(false); });

  window.addEventListener('hashchange', route);
  route();
})();
