// ═══════════════════════════════════════════════════
//  कर्तृत्ववान शेतकरी  —  script.js  v6
//  • Thumbnail + PDF per newspaper card
//  • Auto-logout on tab close / page leave
//  • Empty newspapers removed
//  • Supabase Realtime
// ═══════════════════════════════════════════════════

const OWNER_EMAIL     = 'harilokhande2011988@gmail.com';
const NEWS_GRID_LIMIT = 9;

// ── Auth ──
const getUser  = () => localStorage.getItem('ks_user_email') || '';
const getUName = () => localStorage.getItem('ks_user_name')  || '';
const clearUser= () => { localStorage.removeItem('ks_user_email'); localStorage.removeItem('ks_user_name'); };
const isOwner  = () => getUser().toLowerCase() === OWNER_EMAIL.toLowerCase();

function updateAuthUI() {
  const btn  = document.getElementById('auth-btn');
  const lsec = document.getElementById('logout-section');
  const user = getUser();
  if (!btn) return;
  if (user) {
    const nm = (getUName() || user.split('@')[0]).slice(0, 13);
    btn.className = 'auth-btn logged-in';
    btn.innerHTML = `<span class="auth-dot"></span><span>${nm}</span><span class="auth-logout-hint">↩</span>`;
    btn.onclick = doLogout;
    if (lsec) lsec.classList.add('show');
    if (isOwner()) { showOwnerPanel(); document.body.classList.add('owner-mode'); }
    else           { hideOwnerPanel(); document.body.classList.remove('owner-mode'); }
  } else {
    btn.className = 'auth-btn';
    btn.innerHTML = `<span class="auth-icon">👤</span><span class="auth-label">Login करा</span>`;
    btn.onclick = () => window.location.href = 'login.html';
    if (lsec) lsec.classList.remove('show');
    hideOwnerPanel(); document.body.classList.remove('owner-mode');
  }
}
const showOwnerPanel = () => { const s = document.getElementById('owner-add-section'); if (s) s.style.display = 'block'; };
const hideOwnerPanel = () => { const s = document.getElementById('owner-add-section'); if (s) s.style.display = 'none'; };

function doLogout() {
  if (!confirm(`${getUser()}\n\nLogout करायचे का?`)) return;
  clearUser(); updateAuthUI(); showToast('✅ Logout झाले!');
}

// ═══════════════════════════════════════════════════
//  AUTO-LOGOUT: Tab / Browser बंद केल्यावर logout
// ═══════════════════════════════════════════════════
// Page/Tab बंद होताना logout — session-based login
// (localStorage मधून clear होतो)
window.addEventListener('beforeunload', () => {
  // Auto logout: tab/browser बंद केल्यावर session clear
  clearUser();
});

// Visibility change: user दुसऱ्या app ला गेल्यावर नाही logout,
// फक्त tab close / navigate away वर logout
// (वरील beforeunload पुरेसे आहे)

// ── Toast ──
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.className = 'show';
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 3500);
}

// ── Page Loader ──
window.addEventListener('load', () => {
  setTimeout(() => { const l = document.getElementById('page-loader'); if (l) l.classList.add('out'); }, 2200);
  updateAuthUI();
});

// ── DateTime ──
function updateDT() {
  const MM = ['जानेवारी','फेब्रुवारी','मार्च','एप्रिल','मे','जून','जुलै','ऑगस्ट','सप्टेंबर','ऑक्टोबर','नोव्हेंबर','डिसेंबर'];
  const DD = ['रविवार','सोमवार','मंगळवार','बुधवार','गुरुवार','शुक्रवार','शनिवार'];
  const n = new Date(); let h = n.getHours();
  const m = String(n.getMinutes()).padStart(2,'0'), s = String(n.getSeconds()).padStart(2,'0');
  const ap = h >= 12 ? 'सायं' : 'प्रातः'; if (h > 12) h -= 12; if (!h) h = 12;
  const de = document.getElementById('live-date'), te = document.getElementById('live-time');
  if (de) de.textContent = `${DD[n.getDay()]}, ${n.getDate()} ${MM[n.getMonth()]} ${n.getFullYear()}`;
  if (te) te.textContent = `${ap} ${h}:${m}:${s}`;
}
updateDT(); setInterval(updateDT, 1000);

// ── Mobile Nav ──
const hamburger = document.getElementById('hamburger'), navList = document.getElementById('nav-list');
if (hamburger && navList) {
  hamburger.addEventListener('click', () => {
    navList.classList.toggle('open');
    hamburger.textContent = navList.classList.contains('open') ? '✕' : '☰';
  });
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navList.contains(e.target)) {
      navList.classList.remove('open'); hamburger.textContent = '☰';
    }
  });
}

// ── Scroll Reveal ──
window.revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.1 });
function watchReveal() {
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => revealObs.observe(el));
}

// ── Active Nav ──
window.addEventListener('scroll', () => {
  let cur = '';
  document.querySelectorAll('section[id]').forEach(s => { if (window.scrollY >= s.offsetTop - 110) cur = s.id; });
  document.querySelectorAll('.nav-list a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${cur}`));
}, { passive: true });
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); if (navList) navList.classList.remove('open'); }
  });
});

// ── Ticker ──
const TQ = ['🌾 शेतकरी हा देशाचा आत्मा आहे.','💧 एक थेंब पाणी, एक दाणा अन्न — शेतकऱ्याचे श्रम.','🌱 जो जमिनीशी इमान राखतो, जमीन सोडत नाही.','☀️ उगवत्या सूर्यासारखा शेतकरी — कष्टाने जग उजळवतो.','🏆 शेती हा व्यवसाय नाही, ती एक निष्ठा आहे.','🌿 आधुनिक तंत्रज्ञान + पारंपरिक ज्ञान = समृद्ध शेतकरी.','💪 कष्टाला पर्याय नाही — शेतकरी हे जगाला शिकवतो.','🤝 संघटित शेतकरी — समृद्ध महाराष्ट्र.'];
function initTicker() {
  const t = document.getElementById('ticker-track');
  if (!t) return;
  t.innerHTML = [...TQ, ...TQ].map(q => `<span class="ticker-item">${q}</span>`).join('');
}

// ── Rotating Quotes ──
const RQ = [
  { q: 'शेतकरी हा देशाचा आत्मा आहे — त्याच्या कष्टावर जग जगते.', a: '— लोकमान्य टिळक' },
  { q: 'जो शेतात घाम गाळतो, त्याच्या ताटात सोनं येतं.', a: '— मराठी सुभाषित' },
  { q: 'शेती हे राष्ट्राचे पोषण आहे, शेतकरी हे रक्षक.', a: '— महात्मा फुले' },
  { q: 'एक सुजाण शेतकरी शंभर वकिलांपेक्षा मौल्यवान.', a: '— महात्मा गांधी' },
  { q: 'जमिनीत घातलेले बी वाया जात नाही.', a: '— मराठी लोकोक्ती' },
  { q: 'शेतकऱ्याचे हात हे देशाचा खरा खजिना.', a: '— डॉ. बाबासाहेब आंबेडकर' },
];
let qI = 0;
function initRotatingQuote() {
  const qE = document.getElementById('rotating-quote'), aE = document.getElementById('rotating-author');
  if (!qE) return;
  qE.textContent = `"${RQ[0].q}"`; if (aE) aE.textContent = RQ[0].a;
  setInterval(() => {
    qE.style.opacity = '0'; if (aE) aE.style.opacity = '0';
    setTimeout(() => {
      qI = (qI + 1) % RQ.length;
      qE.textContent = `"${RQ[qI].q}"`; if (aE) aE.textContent = RQ[qI].a;
      qE.style.opacity = '1'; if (aE) aE.style.opacity = '1';
    }, 400);
  }, 5500);
}

// ═══════════════════════════════════════════════════
//  OWNER: File Picker — PDF + Thumbnail
// ═══════════════════════════════════════════════════
let _pdfFile   = null;
let _thumbFile = null;

document.addEventListener('DOMContentLoaded', () => {
  // PDF picker
  const fi = document.getElementById('owner-pdf-input');
  if (fi) {
    fi.addEventListener('change', () => {
      const f = fi.files[0];
      if (!f || f.type !== 'application/pdf') { ownerMsg('❌ PDF file निवडा.', 'err'); return; }
      _pdfFile = f;
      const pb = document.getElementById('owner-pick-btn');
      const sl = document.getElementById('owner-file-label');
      if (pb) { pb.classList.add('selected'); pb.innerHTML = `✅ ${f.name.slice(0, 20)}${f.name.length > 20 ? '…' : ''}`; }
      if (sl) { sl.textContent = `📄 ${f.name} (${(f.size / 1024).toFixed(0)} KB)`; sl.style.display = 'flex'; }
    });
  }

  // Thumbnail picker
  const ti = document.getElementById('owner-thumb-input');
  if (ti) {
    ti.addEventListener('change', () => {
      const f = ti.files[0];
      if (!f || !f.type.startsWith('image/')) { ownerMsg('❌ Image file निवडा (JPG/PNG).', 'err'); return; }
      _thumbFile = f;
      const tb  = document.getElementById('owner-thumb-btn');
      const prv = document.getElementById('owner-thumb-preview');
      if (tb) { tb.classList.add('selected'); tb.innerHTML = `🖼️ ${f.name.slice(0, 18)}${f.name.length > 18 ? '…' : ''}`; }
      if (prv) { prv.src = URL.createObjectURL(f); prv.style.display = 'block'; }
    });
  }
});

async function ownerAddPaper() {
  const title = document.getElementById('owner-title')?.value.trim();
  const date  = document.getElementById('owner-date')?.value.trim();
  if (!title)  { ownerMsg('❌ अंकाचे नाव टाका.', 'err'); return; }
  if (!date)   { ownerMsg('❌ तारीख टाका.', 'err'); return; }
  if (!_pdfFile) { ownerMsg('❌ PDF file निवडा.', 'err'); return; }

  const sb2 = document.getElementById('owner-submit-btn');
  if (sb2) { sb2.disabled = true; sb2.textContent = '⏳ Upload होत आहे...'; }

  try {
    if (window.SB?.isReady()) {
      ownerMsg('📤 Supabase वर upload होत आहे...', 'ok');

      // Upload PDF
      const pdfUrl = await window.SB.uploadPDF(_pdfFile);

      // Upload Thumbnail (असल्यास)
      let thumbUrl = '';
      if (_thumbFile) {
        ownerMsg('🖼️ Thumbnail upload होत आहे...', 'ok');
        thumbUrl = await _uploadThumb(_thumbFile);
      }

      await window.SB.insert({
        title,
        date_text:   date,
        description: `${title} — ${date}`,
        pdf_url:     pdfUrl,
        thumb_url:   thumbUrl,
      });
      ownerMsg(`✅ "${title}" Supabase वर save झाला! Website automatically update होईल.`, 'ok');
    } else {
      // IDB fallback
      const pdfDataURL  = await _readFile(_pdfFile);
      const thumbDataURL = _thumbFile ? await _readFile(_thumbFile) : '';
      await idbPut({
        id: Date.now(), title, date_text: date, date,
        description: `${title} — ${date}`,
        pdfDataURL,
        thumbDataURL,
        pdfFileName: _pdfFile.name,
        created_at:  new Date().toISOString(),
      });
      ownerMsg(`✅ "${title}" browser मध्ये save झाला. Supabase setup करा permanent साठी.`, 'ok');
      loadAndRender();
    }

    // Reset
    _pdfFile = null; _thumbFile = null;
    ['owner-title', 'owner-date'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    ['owner-pdf-input', 'owner-thumb-input'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const pb = document.getElementById('owner-pick-btn');    if (pb) { pb.classList.remove('selected'); pb.innerHTML = '📂 PDF निवडा'; }
    const tb = document.getElementById('owner-thumb-btn');   if (tb) { tb.classList.remove('selected'); tb.innerHTML = '🖼️ Thumbnail'; }
    const sl = document.getElementById('owner-file-label'); if (sl) sl.style.display = 'none';
    const prv = document.getElementById('owner-thumb-preview'); if (prv) prv.style.display = 'none';
    if (sb2) { sb2.disabled = false; sb2.textContent = '✅ अंक जोडा'; }
    showToast('✅ नवीन अंक जोडला!');

  } catch (err) {
    ownerMsg(`❌ Error: ${err.message}`, 'err');
    if (sb2) { sb2.disabled = false; sb2.textContent = '✅ अंक जोडा'; }
  }
}

function _readFile(file) {
  return new Promise((r, j) => {
    const rd = new FileReader();
    rd.onload = e => r(e.target.result);
    rd.onerror = () => j(new Error('File read failed'));
    rd.readAsDataURL(file);
  });
}

// Upload image to Supabase Storage
async function _uploadThumb(file) {
  const sb = window.SB; if (!sb?.isReady()) return '';
  // Reuse the same bucket — thumbnails folder prefix
  const name = `thumbs/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  const sbClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  const { error } = await sbClient.storage.from('newspapers-pdfs').upload(name, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return sbClient.storage.from('newspapers-pdfs').getPublicUrl(name).data.publicUrl;
}

function ownerMsg(msg, type) {
  const el = document.getElementById('owner-msg'); if (!el) return;
  el.textContent = msg; el.className = `owner-msg ${type}`;
  clearTimeout(el._t); el._t = setTimeout(() => { el.style.display = 'none'; el.className = 'owner-msg'; }, 8000);
}

// ── IndexedDB ──
const IDB = 'KS_DB', IDB_V = 3; let _idb = null;
function _openIDB() { return new Promise((r, j) => { if (_idb) return r(_idb); const q = indexedDB.open(IDB, IDB_V); q.onupgradeneeded = e => { if (!e.target.result.objectStoreNames.contains('papers')) e.target.result.createObjectStore('papers', { keyPath: 'id' }); }; q.onsuccess = e => { _idb = e.target.result; r(_idb); }; q.onerror = e => j(e.target.error); }); }
async function idbAll()   { await _openIDB(); return new Promise((r, j) => { const q = _idb.transaction('papers','readonly').objectStore('papers').getAll(); q.onsuccess = () => r(q.result||[]); q.onerror = () => j(q.error); }); }
async function idbPut(p)  { await _openIDB(); return new Promise((r, j) => { const q = _idb.transaction('papers','readwrite').objectStore('papers').put(p); q.onsuccess = () => r(); q.onerror = () => j(q.error); }); }
async function idbDel(id) { await _openIDB(); return new Promise((r, j) => { const q = _idb.transaction('papers','readwrite').objectStore('papers').delete(id); q.onsuccess = () => r(); q.onerror = () => j(q.error); }); }

async function deletePaper(id, isSB = false) {
  if (!confirm('हा अंक delete करायचा का?')) return;
  try {
    if (isSB && window.SB?.isReady()) await window.SB.delete(id);
    else { await idbDel(id); loadAndRender(); }
    showToast('🗑️ अंक delete झाला.');
  } catch (err) { showToast('❌ Delete error: ' + err.message); }
}

// ═══════════════════════════════════════════════════
//  LOAD NEWSPAPERS — Only show papers WITH pdf_url
//  Empty demo papers are NOT shown
// ═══════════════════════════════════════════════════
let _papers = [];

async function loadAndRender() {
  const grid = document.getElementById('news-grid');
  if (grid) grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:#aaa">⏳ लोड होत आहे...</div>`;

  // Supabase (primary)
  let sbP = [];
  if (window.SB?.isReady()) {
    const res = await window.SB.fetch();
    if (res) sbP = res.map(p => ({
      ...p,
      date:      p.date_text,
      pdf:       p.pdf_url,
      thumbnail: p.thumb_url || '',
      _sb:       true,
    }));
  }

  // IDB (local fallback)
  let idbP = [];
  try { idbP = (await idbAll()).reverse().map(p => ({ ...p, _idb: true })); } catch {}

  // JSON static — but only entries with a real pdf URL
  let jsonP = [];
  try {
    const r = await fetch('news.json');
    const raw = await r.json();
    // ✅ Filter: only include if pdf field is non-empty
    jsonP = raw.filter(p => p.pdf && p.pdf.trim().length > 3);
  } catch {}
  // Note: if news.json is empty / all pdfs blank, nothing from JSON shows — correct behaviour

  // Combine — IDB shown only to owner; SB + JSON shown to all
  _papers = [...sbP, ...idbP, ...jsonP];

  if (_papers.length === 0) {
    // Show friendly empty state
    if (grid) grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:4rem 2rem;color:#aaa">
        <div style="font-size:3.5rem;margin-bottom:1rem">📰</div>
        <h3 style="font-family:var(--font-heading);font-size:1.3rem;color:#555;margin-bottom:.5rem">अजून कोणतेही अंक नाहीत</h3>
        <p style="font-size:.9rem">${isOwner() ? '👆 वर "नवीन अंक जोडा" वापरा.' : 'लवकरच नवीन अंक येतील — पुन्हा तपासा.'}</p>
      </div>`;
    const mw = document.getElementById('news-more-wrap'); if (mw) mw.style.display = 'none';
    return;
  }

  renderAll(_papers);
}

// Realtime setup
function setupRealtime() {
  if (!window.SB?.isReady()) return;
  window.SB.subscribe(
    newP => {
      // Only add if has pdf_url
      if (!newP.pdf_url) return;
      const p = { ...newP, date: newP.date_text, pdf: newP.pdf_url, thumbnail: newP.thumb_url || '', _sb: true };
      _papers = [p, ..._papers];
      renderAll(_papers);
      showToast(`📰 नवीन अंक: ${newP.title}`);
    },
    delP => {
      _papers = _papers.filter(p => !(p._sb && p.id === delP.id));
      renderAll(_papers);
    }
  );
}

// ── Render: first 9 grid, rest horizontal scroll ──
function renderAll(papers) {
  const grid     = document.getElementById('news-grid');
  const moreWrap = document.getElementById('news-more-wrap');
  const moreRow  = document.getElementById('news-scroll-row');
  if (!grid) return;
  const ow    = isOwner();
  const first = papers.slice(0, NEWS_GRID_LIMIT);
  const rest  = papers.slice(NEWS_GRID_LIMIT);

  grid.innerHTML = '';
  first.forEach((p, i) => _buildCard(p, i, ow, grid));

  if (moreWrap && moreRow) {
    if (rest.length > 0) {
      moreWrap.style.display = 'block';
      moreRow.innerHTML = '';
      rest.forEach((p, i) => _buildCard(p, i, ow, moreRow));
    } else {
      moreWrap.style.display = 'none';
    }
  }
  watchReveal();
}

function _buildCard(p, i, ow, container) {
  const isSB  = !!p._sb;
  const isIDB = !!p._idb;

  // ── Thumbnail ──
  // Priority: thumb_url (Supabase) > thumbDataURL (IDB) > placeholder
  const thumb = p.thumb_url   ? p.thumb_url
              : p.thumbDataURL ? p.thumbDataURL
              : p.thumbnail    ? p.thumbnail
              : `https://placehold.co/480x300/0f6b28/ffffff?text=${encodeURIComponent((p.title || 'अंक').slice(0, 10))}`;

  const card = document.createElement('div');
  card.className = 'news-card reveal';
  card.style.transitionDelay = `${i * 0.05}s`;

  const delBtn = (ow && (isIDB || isSB))
    ? `<button class="nc-delete-btn" onclick="deletePaper(${p.id}, ${isSB})">🗑️</button>` : '';

  card.innerHTML = `
    <div class="nc-img">
      <img src="${thumb}" alt="${p.title}" loading="lazy"
           onerror="this.src='https://placehold.co/480x300/0f6b28/ffffff?text=अंक'">
      <div class="nc-badge">📰 साप्ताहिक</div>
    </div>
    <div class="nc-body">
      <div class="nc-date">📅 ${p.date || p.date_text || ''}</div>
      <h3 class="nc-title">${p.title}</h3>
      <p class="nc-desc">${p.description || ''}</p>
    </div>
    <div class="nc-footer">
      <span style="font-size:.72rem;color:#bbb">${isSB ? '☁️ Cloud' : isIDB ? '💾 Local' : `#${p.id}`}</span>
      <div style="display:flex;gap:.4rem;align-items:center">
        ${delBtn}
        <button class="read-btn">📖 वाचा</button>
      </div>
    </div>`;

  card.querySelector('.read-btn').onclick = () => _openPDF(p);
  container.appendChild(card);
}

// ── PDF Viewer ──
function _openPDF(p) {
  const overlay = document.getElementById('pdf-modal');
  const tEl = document.getElementById('modal-title');
  const ifr = document.getElementById('pdf-iframe');
  const ph  = document.getElementById('pdf-ph');
  if (!overlay) return;
  if (tEl) tEl.textContent = p.title;

  const url = p.pdf || p.pdf_url || '';
  if (p.pdfDataURL) {
    try {
      const bs = atob(p.pdfDataURL.split(',')[1]);
      const ab = new ArrayBuffer(bs.length), ia = new Uint8Array(ab);
      for (let i = 0; i < bs.length; i++) ia[i] = bs.charCodeAt(i);
      const bu = URL.createObjectURL(new Blob([ab], { type: 'application/pdf' }));
      if (ifr) { ifr.src = bu; ifr.style.display = 'block'; }
      if (ph) ph.style.display = 'none';
    } catch { _showPH(ifr, ph); }
  } else if (url && url.length > 5) {
    if (ifr) { ifr.src = url; ifr.style.display = 'block'; }
    if (ph) ph.style.display = 'none';
  } else {
    _showPH(ifr, ph);
  }
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function _showPH(ifr, ph) { if (ifr) { ifr.src = ''; ifr.style.display = 'none'; } if (ph) ph.style.display = 'flex'; }
function closePDF() {
  const o = document.getElementById('pdf-modal'), f = document.getElementById('pdf-iframe');
  if (o) { o.classList.remove('open'); document.body.style.overflow = ''; }
  if (f) { try { URL.revokeObjectURL(f.src); } catch {} f.src = ''; }
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePDF(); });
document.getElementById('pdf-modal')?.addEventListener('click', e => { if (e.target.id === 'pdf-modal') closePDF(); });

// ── Scroll helpers ──
function scrollNewsLeft()  { const r = document.getElementById('news-scroll-row'); if (r) r.scrollBy({ left: -320, behavior: 'smooth' }); }
function scrollNewsRight() { const r = document.getElementById('news-scroll-row'); if (r) r.scrollBy({ left:  320, behavior: 'smooth' }); }

// ── DOMContentLoaded ──
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  initTicker();
  initRotatingQuote();
  loadAndRender();
  setupRealtime();
  if (window.fetchYouTubeVideos) fetchYouTubeVideos();
  watchReveal();
});
