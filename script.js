// ═══════════════════════════════════════════════════
//  कर्तृत्ववान शेतकरी  —  script.js  (Clean Final)
// ═══════════════════════════════════════════════════

const OWNER_EMAIL = 'harilokhande2011988@gmail.com';
const NEWS_LIMIT  = 9;

// ── Auth helpers ──
const getUser  = () => localStorage.getItem('ks_user_email') || '';
const getUName = () => localStorage.getItem('ks_user_name')  || '';
const clearUser= () => {
  localStorage.removeItem('ks_user_email');
  localStorage.removeItem('ks_user_name');
};
const isOwner  = () => getUser().toLowerCase() === OWNER_EMAIL.toLowerCase();

// ── Update header auth button ──
function updateAuthUI() {
  const btn  = document.getElementById('auth-btn');
  const lsec = document.getElementById('logout-section');
  const user = getUser();
  if (!btn) return;

  if (user) {
    const nm = (getUName() || user.split('@')[0]).slice(0, 13);
    btn.className = 'auth-btn logged-in';
    btn.innerHTML =
      '<span class="auth-dot"></span>' +
      '<span class="auth-label">' + nm + '</span>' +
      '<span style="font-size:.65rem;opacity:.6;border-left:1px solid rgba(255,255,255,.3);padding-left:6px;margin-left:3px">↩</span>';
    btn.title   = user + ' — Logout';
    btn.onclick = doLogout;
    if (lsec) lsec.classList.add('show');
    if (isOwner()) { document.getElementById('owner-add-section') && (document.getElementById('owner-add-section').style.display='block'); document.body.classList.add('owner-mode'); }
    else           { document.getElementById('owner-add-section') && (document.getElementById('owner-add-section').style.display='none');  document.body.classList.remove('owner-mode'); }
  } else {
    btn.className = 'auth-btn';
    btn.innerHTML = '<span class="auth-icon">👤</span><span class="auth-label">Login करा</span>';
    btn.title   = 'Login करा';
    btn.onclick = () => window.location.href = 'login.html';
    if (lsec) lsec.classList.remove('show');
    document.getElementById('owner-add-section') && (document.getElementById('owner-add-section').style.display='none');
    document.body.classList.remove('owner-mode');
  }
}

function doLogout() {
  if (!confirm(getUser() + '\n\nLogout करायचे का?')) return;
  clearUser();
  updateAuthUI();
  showToast('✅ Logout झाले!');
}

// ── Toast ──
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className   = 'show';
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3500);
}

// ── Page loader ──
window.addEventListener('load', function () {
  setTimeout(function () {
    var l = document.getElementById('page-loader');
    if (l) l.classList.add('out');
  }, 1800);
  updateAuthUI();
});

// ── Live Date/Time ──
function updateDT() {
  var MM = ['जानेवारी','फेब्रुवारी','मार्च','एप्रिल','मे','जून','जुलै','ऑगस्ट','सप्टेंबर','ऑक्टोबर','नोव्हेंबर','डिसेंबर'];
  var DD = ['रविवार','सोमवार','मंगळवार','बुधवार','गुरुवार','शुक्रवार','शनिवार'];
  var n = new Date(), h = n.getHours();
  var m = String(n.getMinutes()).padStart(2,'0'), s = String(n.getSeconds()).padStart(2,'0');
  var ap = h >= 12 ? 'सायं' : 'प्रातः';
  if (h > 12) h -= 12; if (!h) h = 12;
  var de = document.getElementById('live-date'), te = document.getElementById('live-time');
  if (de) de.textContent = DD[n.getDay()] + ', ' + n.getDate() + ' ' + MM[n.getMonth()] + ' ' + n.getFullYear();
  if (te) te.textContent = ap + ' ' + h + ':' + m + ':' + s;
}
updateDT();
setInterval(updateDT, 1000);

// ── Mobile nav ──
function initNav() {
  var hb = document.getElementById('hamburger');
  var nl = document.getElementById('nav-list');
  if (!hb || !nl) return;
  hb.addEventListener('click', function () {
    nl.classList.toggle('open');
    hb.textContent = nl.classList.contains('open') ? '✕' : '☰';
  });
  document.addEventListener('click', function (e) {
    if (!hb.contains(e.target) && !nl.contains(e.target)) {
      nl.classList.remove('open');
      hb.textContent = '☰';
    }
  });
}

// ── Scroll reveal ──
window.revealObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.1 });

function watchReveal() {
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function (el) {
    revealObs.observe(el);
  });
}

// ── Active nav ──
window.addEventListener('scroll', function () {
  var cur = '';
  document.querySelectorAll('section[id]').forEach(function (s) {
    if (window.scrollY >= s.offsetTop - 110) cur = s.id;
  });
  document.querySelectorAll('.nav-list a').forEach(function (a) {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
}, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var t = document.querySelector(a.getAttribute('href'));
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth' });
      var nl = document.getElementById('nav-list');
      if (nl) nl.classList.remove('open');
    }
  });
});

// ── Ticker ──
var TQ = [
  '🌾 शेतकरी हा देशाचा आत्मा आहे.',
  '💧 एक थेंब पाणी, एक दाणा अन्न — शेतकऱ्याचे श्रम.',
  '🌱 जो जमिनीशी इमान राखतो, जमीन सोडत नाही.',
  '☀️ उगवत्या सूर्यासारखा शेतकरी — कष्टाने जग उजळवतो.',
  '🏆 शेती हा व्यवसाय नाही, ती एक निष्ठा आहे.',
  '🌿 आधुनिक तंत्रज्ञान + पारंपरिक ज्ञान = समृद्ध शेतकरी.',
  '💪 कष्टाला पर्याय नाही — शेतकरी हे जगाला शिकवतो.',
  '🤝 संघटित शेतकरी — समृद्ध महाराष्ट्र.'
];
function initTicker() {
  var t = document.getElementById('ticker-track');
  if (!t) return;
  t.innerHTML = TQ.concat(TQ).map(function (q) { return '<span class="ticker-item">' + q + '</span>'; }).join('');
}

// ── Rotating quotes ──
var RQ = [
  { q: 'शेतकरी हा देशाचा आत्मा आहे — त्याच्या कष्टावर जग जगते.', a: '— लोकमान्य टिळक' },
  { q: 'जो शेतात घाम गाळतो, त्याच्या ताटात सोनं येतं.', a: '— मराठी सुभाषित' },
  { q: 'शेती हे राष्ट्राचे पोषण आहे, शेतकरी हे रक्षक.', a: '— महात्मा फुले' },
  { q: 'एक सुजाण शेतकरी शंभर वकिलांपेक्षा मौल्यवान.', a: '— महात्मा गांधी' },
  { q: 'जमिनीत घातलेले बी वाया जात नाही.', a: '— मराठी लोकोक्ती' },
  { q: 'शेतकऱ्याचे हात हे देशाचा खरा खजिना.', a: '— डॉ. बाबासाहेब आंबेडकर' }
];
var qI = 0;
function initQuotes() {
  var qE = document.getElementById('rotating-quote');
  var aE = document.getElementById('rotating-author');
  if (!qE) return;
  qE.textContent = '"' + RQ[0].q + '"';
  if (aE) aE.textContent = RQ[0].a;
  setInterval(function () {
    qE.style.opacity = '0';
    if (aE) aE.style.opacity = '0';
    setTimeout(function () {
      qI = (qI + 1) % RQ.length;
      qE.textContent = '"' + RQ[qI].q + '"';
      if (aE) aE.textContent = RQ[qI].a;
      qE.style.opacity = '1';
      if (aE) aE.style.opacity = '1';
    }, 400);
  }, 5500);
}

// ═══════════════════════════════════════════════════
//  OWNER: PDF + Thumbnail upload
// ═══════════════════════════════════════════════════
var _pdfFile   = null;
var _thumbFile = null;

function initOwnerPickers() {
  var pdfInput   = document.getElementById('owner-pdf-input');
  var thumbInput = document.getElementById('owner-thumb-input');

  if (pdfInput) {
    pdfInput.addEventListener('change', function () {
      var f = pdfInput.files[0];
      if (!f || f.type !== 'application/pdf') { ownerMsg('❌ PDF file निवडा.', 'err'); return; }
      _pdfFile = f;
      var pb = document.getElementById('owner-pick-btn');
      var sl = document.getElementById('owner-file-label');
      if (pb) { pb.classList.add('selected'); pb.innerHTML = '✅ ' + f.name.slice(0, 20) + (f.name.length > 20 ? '…' : ''); }
      if (sl) { sl.textContent = '📄 ' + f.name + ' (' + (f.size / 1024).toFixed(0) + ' KB)'; sl.style.display = 'flex'; }
    });
  }

  if (thumbInput) {
    thumbInput.addEventListener('change', function () {
      var f = thumbInput.files[0];
      if (!f || !f.type.startsWith('image/')) { ownerMsg('❌ Image file निवडा.', 'err'); return; }
      _thumbFile = f;
      var tb  = document.getElementById('owner-thumb-btn');
      var prv = document.getElementById('owner-thumb-preview');
      if (tb)  { tb.classList.add('selected'); tb.innerHTML = '🖼️ ' + f.name.slice(0, 16) + (f.name.length > 16 ? '…' : ''); }
      if (prv) { prv.src = URL.createObjectURL(f); prv.style.display = 'block'; }
    });
  }
}

async function ownerAddPaper() {
  var title = (document.getElementById('owner-title') || {}).value;
  var date  = (document.getElementById('owner-date')  || {}).value;
  title = title ? title.trim() : '';
  date  = date  ? date.trim()  : '';
  if (!title)  { ownerMsg('❌ अंकाचे नाव टाका.', 'err'); return; }
  if (!date)   { ownerMsg('❌ तारीख टाका.', 'err'); return; }
  if (!_pdfFile) { ownerMsg('❌ PDF file निवडा.', 'err'); return; }

  var sbtn = document.getElementById('owner-submit-btn');
  if (sbtn) { sbtn.disabled = true; sbtn.textContent = '⏳ Upload...'; }

  try {
    if (window.SB && window.SB.isReady()) {
      ownerMsg('📤 Supabase वर upload होत आहे...', 'ok');
      var pdfUrl   = await window.SB.uploadPDF(_pdfFile);
      var thumbUrl = '';
      if (_thumbFile) {
        ownerMsg('🖼️ Thumbnail upload होत आहे...', 'ok');
        thumbUrl = await _uploadThumb(_thumbFile);
      }
      await window.SB.insert({ title: title, date_text: date, description: title + ' — ' + date, pdf_url: pdfUrl, thumb_url: thumbUrl });
      ownerMsg('✅ "' + title + '" Supabase वर save झाला! Website आपोआप update होईल.', 'ok');
    } else {
      // IDB fallback
      var pdfDU   = await _readFileAsDataURL(_pdfFile);
      var thumbDU = _thumbFile ? await _readFileAsDataURL(_thumbFile) : '';
      await idbPut({ id: Date.now(), title: title, date_text: date, date: date, description: title + ' — ' + date, pdfDataURL: pdfDU, thumbDataURL: thumbDU, pdfFileName: _pdfFile.name, created_at: new Date().toISOString() });
      ownerMsg('✅ "' + title + '" browser मध्ये save झाला. Supabase setup करा permanent साठी.', 'ok');
      loadAndRender();
    }
    // Reset form
    _pdfFile = null; _thumbFile = null;
    ['owner-title','owner-date'].forEach(function (id) { var el = document.getElementById(id); if (el) el.value = ''; });
    ['owner-pdf-input','owner-thumb-input'].forEach(function (id) { var el = document.getElementById(id); if (el) el.value = ''; });
    var pb = document.getElementById('owner-pick-btn');   if (pb)  { pb.classList.remove('selected'); pb.innerHTML = '📂 PDF निवडा'; }
    var tb = document.getElementById('owner-thumb-btn');  if (tb)  { tb.classList.remove('selected'); tb.innerHTML = '🖼️ Thumbnail'; }
    var sl = document.getElementById('owner-file-label'); if (sl)  sl.style.display = 'none';
    var prv = document.getElementById('owner-thumb-preview'); if (prv) prv.style.display = 'none';
    if (sbtn) { sbtn.disabled = false; sbtn.textContent = '✅ अंक जोडा'; }
    showToast('✅ नवीन अंक जोडला!');
  } catch (err) {
    ownerMsg('❌ Error: ' + err.message, 'err');
    if (sbtn) { sbtn.disabled = false; sbtn.textContent = '✅ अंक जोडा'; }
  }
}

function _readFileAsDataURL(file) {
  return new Promise(function (resolve, reject) {
    var r = new FileReader();
    r.onload  = function (e) { resolve(e.target.result); };
    r.onerror = function ()  { reject(new Error('File read failed')); };
    r.readAsDataURL(file);
  });
}

async function _uploadThumb(file) {
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) return '';
  var name = 'thumbs/' + Date.now() + '_' + file.name.replace(/\s+/g, '_');
  var client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  var result = await client.storage.from('newspapers-pdfs').upload(name, file, { contentType: file.type, upsert: false });
  if (result.error) throw new Error(result.error.message);
  return client.storage.from('newspapers-pdfs').getPublicUrl(name).data.publicUrl;
}

function ownerMsg(msg, type) {
  var el = document.getElementById('owner-msg');
  if (!el) return;
  el.textContent  = msg;
  el.className    = 'owner-msg ' + type;
  clearTimeout(el._t);
  el._t = setTimeout(function () { el.style.display = 'none'; el.className = 'owner-msg'; }, 8000);
}

// ── IndexedDB ──
var _idbName = 'KS_DB', _idbVer = 3, _idb = null;
function _openDB() {
  return new Promise(function (resolve, reject) {
    if (_idb) return resolve(_idb);
    var req = indexedDB.open(_idbName, _idbVer);
    req.onupgradeneeded = function (e) {
      if (!e.target.result.objectStoreNames.contains('papers'))
        e.target.result.createObjectStore('papers', { keyPath: 'id' });
    };
    req.onsuccess = function (e) { _idb = e.target.result; resolve(_idb); };
    req.onerror   = function (e) { reject(e.target.error); };
  });
}
async function idbAll()   { await _openDB(); return new Promise(function (r, j) { var q = _idb.transaction('papers','readonly').objectStore('papers').getAll(); q.onsuccess = function () { r(q.result || []); }; q.onerror = function () { j(q.error); }; }); }
async function idbPut(p)  { await _openDB(); return new Promise(function (r, j) { var q = _idb.transaction('papers','readwrite').objectStore('papers').put(p); q.onsuccess = function () { r(); }; q.onerror = function () { j(q.error); }; }); }
async function idbDel(id) { await _openDB(); return new Promise(function (r, j) { var q = _idb.transaction('papers','readwrite').objectStore('papers').delete(id); q.onsuccess = function () { r(); }; q.onerror = function () { j(q.error); }; }); }

async function deletePaper(id, isSB) {
  if (!confirm('हा अंक delete करायचा का?')) return;
  try {
    if (isSB && window.SB && window.SB.isReady()) {
      await window.SB.delete(id);
    } else {
      await idbDel(id);
      loadAndRender();
    }
    showToast('🗑️ अंक delete झाला.');
  } catch (err) {
    showToast('❌ Delete error: ' + err.message);
  }
}

// ═══════════════════════════════════════════════════
//  NEWSPAPERS — load, realtime, render
// ═══════════════════════════════════════════════════
var _allPapers = [];

async function loadAndRender() {
  var grid = document.getElementById('news-grid');
  if (grid) grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2rem;color:#aaa">⏳ लोड होत आहे...</div>';

  var sbP = [];
  if (window.SB && window.SB.isReady()) {
    var res = await window.SB.fetch();
    if (res) sbP = res.map(function (p) {
      return Object.assign({}, p, { date: p.date_text, pdf: p.pdf_url, thumbnail: p.thumb_url || '', _sb: true });
    });
  }

  var idbP = [];
  try { idbP = (await idbAll()).reverse().map(function (p) { return Object.assign({}, p, { _idb: true }); }); } catch (e) {}

  // JSON — only if pdf field has real URL
  var jsonP = [];
  try {
    var res2 = await fetch('news.json');
    var raw  = await res2.json();
    jsonP = raw.filter(function (p) { return p.pdf && p.pdf.trim().length > 5; });
  } catch (e) {}

  _allPapers = sbP.concat(idbP).concat(jsonP);

  if (_allPapers.length === 0) {
    if (grid) grid.innerHTML =
      '<div style="grid-column:1/-1;text-align:center;padding:4rem 2rem;color:#aaa">' +
      '<div style="font-size:3rem;margin-bottom:1rem">📰</div>' +
      '<h3 style="color:#555;margin-bottom:.5rem">अजून कोणतेही अंक नाहीत</h3>' +
      '<p style="font-size:.88rem">' + (isOwner() ? '👆 वर अंक जोडा.' : 'लवकरच नवीन अंक येतील.') + '</p>' +
      '</div>';
    var mw = document.getElementById('news-more-wrap'); if (mw) mw.style.display = 'none';
    return;
  }
  renderAll(_allPapers);
}

function setupRealtime() {
  if (!window.SB || !window.SB.isReady()) return;
  window.SB.subscribe(
    function (newP) {
      if (!newP.pdf_url) return;
      var p = Object.assign({}, newP, { date: newP.date_text, pdf: newP.pdf_url, thumbnail: newP.thumb_url || '', _sb: true });
      _allPapers = [p].concat(_allPapers);
      renderAll(_allPapers);
      showToast('📰 नवीन अंक: ' + newP.title);
    },
    function (delP) {
      _allPapers = _allPapers.filter(function (p) { return !(p._sb && p.id === delP.id); });
      renderAll(_allPapers);
    }
  );
}

function renderAll(papers) {
  var grid     = document.getElementById('news-grid');
  var moreWrap = document.getElementById('news-more-wrap');
  var moreRow  = document.getElementById('news-scroll-row');
  if (!grid) return;
  var ow    = isOwner();
  var first = papers.slice(0, NEWS_LIMIT);
  var rest  = papers.slice(NEWS_LIMIT);

  grid.innerHTML = '';
  first.forEach(function (p, i) { buildCard(p, i, ow, grid); });

  if (moreWrap && moreRow) {
    if (rest.length > 0) {
      moreWrap.style.display = 'block';
      moreRow.innerHTML = '';
      rest.forEach(function (p, i) { buildCard(p, i, ow, moreRow); });
    } else {
      moreWrap.style.display = 'none';
    }
  }
  watchReveal();
}

function buildCard(p, i, ow, container) {
  var isSB  = !!p._sb;
  var isIDB = !!p._idb;

  // Thumbnail: Supabase URL > IDB base64 > news.json field > placeholder
  var thumb = p.thumb_url    ||
              p.thumbDataURL  ||
              p.thumbnail     ||
              ('https://placehold.co/480x280/0f6b28/ffffff?text=' + encodeURIComponent((p.title || 'अंक').slice(0, 8)));

  var card = document.createElement('div');
  card.className = 'news-card reveal';
  card.style.transitionDelay = (i * 0.05) + 's';

  var delBtn = (ow && (isIDB || isSB))
    ? '<button class="nc-delete-btn" onclick="deletePaper(' + p.id + ',' + isSB + ')">🗑️</button>'
    : '';

  card.innerHTML =
    '<div class="nc-img">' +
      '<img src="' + thumb + '" alt="' + p.title + '" loading="lazy" ' +
           'onerror="this.src=\'https://placehold.co/480x280/0f6b28/ffffff?text=अंक\'">' +
      '<div class="nc-badge">📰 साप्ताहिक</div>' +
    '</div>' +
    '<div class="nc-body">' +
      '<div class="nc-date">📅 ' + (p.date || p.date_text || '') + '</div>' +
      '<h3 class="nc-title">' + p.title + '</h3>' +
      '<p class="nc-desc">' + (p.description || '') + '</p>' +
    '</div>' +
    '<div class="nc-footer">' +
      '<span style="font-size:.72rem;color:#bbb">' + (isSB ? '☁️ Cloud' : isIDB ? '💾 Local' : '#' + p.id) + '</span>' +
      '<div style="display:flex;gap:.4rem;align-items:center">' + delBtn + '<button class="read-btn">📖 वाचा</button></div>' +
    '</div>';

  card.querySelector('.read-btn').addEventListener('click', function () { openPDF(p); });
  container.appendChild(card);
}

// ── PDF Viewer ──
function openPDF(p) {
  var overlay = document.getElementById('pdf-modal');
  var tEl     = document.getElementById('modal-title');
  var ifr     = document.getElementById('pdf-iframe');
  var ph      = document.getElementById('pdf-ph');
  if (!overlay) return;
  if (tEl) tEl.textContent = p.title;

  var url = p.pdf || p.pdf_url || '';
  if (p.pdfDataURL) {
    try {
      var bs = atob(p.pdfDataURL.split(',')[1]);
      var ab = new ArrayBuffer(bs.length), ia = new Uint8Array(ab);
      for (var i = 0; i < bs.length; i++) ia[i] = bs.charCodeAt(i);
      var bu = URL.createObjectURL(new Blob([ab], { type: 'application/pdf' }));
      if (ifr) { ifr.src = bu; ifr.style.display = 'block'; }
      if (ph)  ph.style.display = 'none';
    } catch (e) { showPlaceholder(ifr, ph); }
  } else if (url && url.length > 5) {
    if (ifr) { ifr.src = url; ifr.style.display = 'block'; }
    if (ph)  ph.style.display = 'none';
  } else {
    showPlaceholder(ifr, ph);
  }
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showPlaceholder(ifr, ph) {
  if (ifr) { ifr.src = ''; ifr.style.display = 'none'; }
  if (ph)  ph.style.display = 'flex';
}

function closePDF() {
  var o = document.getElementById('pdf-modal');
  var f = document.getElementById('pdf-iframe');
  if (o) { o.classList.remove('open'); document.body.style.overflow = ''; }
  if (f) { try { URL.revokeObjectURL(f.src); } catch (e) {} f.src = ''; }
}

document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePDF(); });
setTimeout(function () {
  var m = document.getElementById('pdf-modal');
  if (m) m.addEventListener('click', function (e) { if (e.target.id === 'pdf-modal') closePDF(); });
}, 500);

// ── Scroll buttons ──
function scrollNewsLeft()  { var r = document.getElementById('news-scroll-row'); if (r) r.scrollBy({ left: -320, behavior: 'smooth' }); }
function scrollNewsRight() { var r = document.getElementById('news-scroll-row'); if (r) r.scrollBy({ left:  320, behavior: 'smooth' }); }

// ═══════════════════════════════════════════════════
//  INIT — single DOMContentLoaded
// ═══════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function () {
  updateAuthUI();
  initNav();
  initTicker();
  initQuotes();
  initOwnerPickers();
  loadAndRender();
  setupRealtime();
  if (typeof fetchYouTubeVideos === 'function') fetchYouTubeVideos();
  watchReveal();
});
