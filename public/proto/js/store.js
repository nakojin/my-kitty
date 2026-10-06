// 상태 저장. MVP는 로그인 없이 기기 저장(localStorage).
// 워드프레스 이식 시: 로그인 사용자는 user_meta, 비로그인은 그대로 localStorage.
(function () {
  const KEY = 'mk.proto.v1';
  const today = () => new Date().toISOString().slice(0, 10);

  const defaults = () => ({
    onboarded: false,
    nick: '',
    worlds: [],                 // 선택한 월드 id
    coll: {},                   // figureId -> 'own' | 'wish'
    xp: 0,
    streak: 0,
    lastCheckin: '',
    lastGacha: '',
    gachaResult: '',
    badges: [],
    quests: {},                 // questId -> date
  });

  let state;
  try { state = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || '{}')); }
  catch { state = defaults(); }

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };

  const XP_PER_LEVEL = 200;
  const level = () => Math.floor(state.xp / XP_PER_LEVEL) + 1;
  const xpInLevel = () => state.xp % XP_PER_LEVEL;

  const BADGES = [
    { id: 'first-coll', name: '첫 도감', test: s => Object.keys(s.coll).length >= 1 },
    { id: 'streak-7', name: '7일', test: s => s.streak >= 7 },
    { id: 'starter', name: '입문자', test: s => Object.values(s.coll).filter(v => v === 'own').length >= 3 },
    { id: 'kny-10', name: '귀멸 10', test: s => Object.keys(s.coll).filter(id => id.startsWith('kny') && s.coll[id] === 'own').length >= 10 },
    { id: 'half', name: '완주 50%', test: s => window.MK_WORLDS.some(w => MK.completion(w.id) >= 50) },
    { id: 'gacha-3', name: '뽑기 3일', test: s => s.badgesMeta?.gacha >= 3 },
  ];

  const MK = {
    get state() { return state; },
    save,
    reset() { state = defaults(); save(); },
    level, xpInLevel, XP_PER_LEVEL,

    addXp(n, why) {
      const before = level();
      state.xp += n; save();
      MK.checkBadges();
      return { leveled: level() > before, why };
    },
    checkin() {
      if (state.lastCheckin === today()) return false;
      const y = new Date(); y.setDate(y.getDate() - 1);
      state.streak = state.lastCheckin === y.toISOString().slice(0, 10) ? state.streak + 1 : 1;
      state.lastCheckin = today();
      state.quests.checkin = today(); save();
      MK.addXp(10, '체크인');
      return true;
    },
    canGacha() { return state.lastGacha !== today(); },
    gacha() {
      // 선택한 월드 안에서, 아직 도감에 없는 피규어 중 입문 가격대(common) 우선
      const pool = window.MK_FIGURES.filter(f => state.worlds.includes(f.world) && !state.coll[f.id]);
      const common = pool.filter(f => f.rarity === 'common');
      const pick = (common.length ? common : pool.length ? pool : window.MK_FIGURES)[Math.floor(Math.random() * (common.length || pool.length || window.MK_FIGURES.length))];
      state.lastGacha = today(); state.gachaResult = pick.id; state.quests.gacha = today();
      state.badgesMeta = state.badgesMeta || {}; state.badgesMeta.gacha = (state.badgesMeta.gacha || 0) + 1;
      save(); MK.addXp(10, '뽑기');
      return pick;
    },
    setColl(id, v) {
      const had = !!state.coll[id];
      if (v) state.coll[id] = v; else delete state.coll[id];
      save();
      if (!had && v) { state.quests.coll = today(); save(); MK.addXp(20, '도감'); }
      MK.checkBadges();
    },
    completion(worldId) {
      const all = window.MK_FIGURES.filter(f => f.world === worldId);
      if (!all.length) return 0;
      const own = all.filter(f => state.coll[f.id] === 'own').length;
      return Math.round(own / all.length * 100);
    },
    counts(worldId) {
      const all = window.MK_FIGURES.filter(f => !worldId || f.world === worldId);
      const c = { own: 0, wish: 0, none: 0, byR: { common: 0, rare: 0, epic: 0, legendary: 0 } };
      all.forEach(f => { const s = state.coll[f.id]; if (s === 'own') { c.own++; c.byR[f.rarity]++; } else if (s === 'wish') c.wish++; else c.none++; });
      return c;
    },
    checkBadges() {
      let newly = [];
      BADGES.forEach(b => { if (!state.badges.includes(b.id) && b.test(state)) { state.badges.push(b.id); newly.push(b); } });
      if (newly.length) save();
      return newly;
    },
    BADGES,
    world(id) { return window.MK_WORLDS.find(w => w.id === id); },
    figure(id) { return window.MK_FIGURES.find(f => f.id === id); },
    rarity(k) { return window.MK_RARITY[k]; },
    applyTheme(el, world) {
      const w = typeof world === 'string' ? MK.world(world) : world;
      if (!w) return;
      el.style.setProperty('--theme', w.theme); el.style.setProperty('--theme2', w.theme2);
      el.style.setProperty('--on-theme', w.on); el.style.setProperty('--g', w.g + '%');
    },
  };
  window.MK = MK;
})();
