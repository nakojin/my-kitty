// 라우터 + 이벤트. 해시 기반: #home, #world:kny, #ranking:newera:jp, #collection:kny:own, #detail:kny-01 (시트)
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const screen = $('#screen'), tabbar = $('#tabbar'), sheetWrap = $('#sheet'), sheetBody = $('#sheet-inner');
  const history = [];

  const TABS = [['home', '홈', '⌂'], ['ranking', '랭킹', '▲'], ['collection', '도감', '▦'], ['my', '마이', '◉']];

  function route() {
    const hash = (location.hash || '#home').slice(1);
    const [name, ...args] = hash.split(':');
    if (!MK.state.onboarded && name !== 'onboarding') { location.hash = '#onboarding'; return; }
    if (name === 'detail') { openSheet(args[0]); return; }
    closeSheet(true);

    let html = '';
    switch (name) {
      case 'onboarding': html = V.onboarding(); break;
      case 'world': html = V.world(args[0], args[1] || 'cur'); break;
      case 'collection': html = V.collection(args[0], args[1] || 'all'); break;
      case 'ranking': html = V.ranking(args[0] || 'newera', args[1] || (args[0] === 'legend' ? 'all' : 'kr')); break;
      case 'my': html = V.my(); break;
      case 'share': html = V.share(Number(args[0] || 0)); break;
      default: html = V.home();
    }
    screen.innerHTML = html;
    screen.scrollTop = 0;
    applyThemes(screen);
    tabbar.style.display = name === 'onboarding' || name === 'share' ? 'none' : '';
    tabbar.innerHTML = TABS.map(([k, l, i]) => `<button class="${name === k || (name === 'world' && k === 'home') ? 'on' : ''}" data-go="${k}"><span class="ico">${i}</span>${l}</button>`).join('');
    if (history[history.length - 1] !== hash) history.push(hash);
    bind(name);
  }

  function applyThemes(root) {
    root.querySelectorAll('[data-theme-world]').forEach(el => MK.applyTheme(el, el.dataset.themeWorld));
    // 탭바 테마색 = 대표 월드
    const main = MK.world(MK.state.worlds[0]); if (main) MK.applyTheme(document.body, main);
  }

  function go(target) {
    if (target === 'back') { history.pop(); location.hash = '#' + (history.pop() || 'home'); return; }
    location.hash = '#' + target;
  }

  /* 바텀시트 */
  function openSheet(id) {
    sheetBody.innerHTML = V.detail(id);
    applyThemes(sheetBody);
    sheetWrap.classList.add('open');
    const btn = $('#coll-btn', sheetBody);
    btn && btn.addEventListener('click', () => {
      const cur = MK.state.coll[id];
      const next = !cur ? 'wish' : cur === 'wish' ? 'own' : null;
      MK.setColl(id, next);
      toast(next === 'wish' ? '♡ 위시에 담았어요' : next === 'own' ? '✓ 보유로 등록! +20 XP' : '도감에서 뺐어요');
      openSheet(id);
      MK.checkBadges().forEach(b => setTimeout(() => toast(`🏅 뱃지 획득 — ${b.name}`), 900));
    });
  }
  // 시트는 history에 쌓지 않는다. 닫으면 마지막 화면 해시로 돌아간다.
  function closeSheet(silent) {
    if (!sheetWrap.classList.contains('open')) return;
    sheetWrap.classList.remove('open');
    if (!silent || location.hash.startsWith('#detail')) location.hash = '#' + (history[history.length - 1] || 'home');
  }
  $('#sheet .dim').addEventListener('click', () => closeSheet(false));

  /* 토스트 */
  let toastTimer;
  function toast(msg) {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; $('#device').appendChild(t); }
    t.className = 'toast'; t.innerHTML = `<span>${msg}</span>`;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.classList.add('gone'); setTimeout(() => t.remove(), 350); }, 1800);
  }

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
        go('home');
      });
    }
    if (name === 'home') {
      const ci = $('#checkin'); ci && ci.addEventListener('click', () => { if (MK.checkin()) { toast('🔥 체크인 완료 +10 XP'); route(); } });
      const g = $('#gacha'), gb = $('#gacha-go');
      const doGacha = () => {
        if (!MK.canGacha()) return;
        const pick = MK.gacha();
        g.classList.remove('idle');
        g.querySelector('.back').innerHTML = `<div class="img-slot product" data-slot="COUPANG-${pick.id}"></div><div class="cap" style="font-size:10px">${pick.char}</div>`;
        g.classList.add('flipped');
        setTimeout(() => { toast(`✨ ${pick.name}`); setTimeout(() => go('detail:' + pick.id), 700); }, 950);
      };
      g && g.addEventListener('click', doGacha); gb && gb.addEventListener('click', doGacha);
    }
    if (name === 'my') { const r = $('#reset'); r && r.addEventListener('click', () => { if (confirm('프로토타입 데이터를 초기화할까요?')) { MK.reset(); location.hash = '#onboarding'; } }); }
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
