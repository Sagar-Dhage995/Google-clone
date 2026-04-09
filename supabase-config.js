// ═══════════════════════════════════════════════════════════════
//  कर्तृत्ववान शेतकरी  —  supabase-config.js
//  Realtime Newspapers + User Login Tracking + Analytics
// ═══════════════════════════════════════════════════════════════
//
//  ONE-TIME SETUP:
//  1. https://supabase.com → New Project
//  2. Settings → API → URL + anon key copy → खाली paste करा
//  3. SQL Editor मध्ये SETUP_SQL run करा
//  4. Storage → New Bucket → "newspapers-pdfs" → Public ON
//  5. GitHub push → Vercel auto-deploy ✅

window.SUPABASE_URL      = 'https://yudwthjhvtuxcdadkunc.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1ZHd0aGpodnR1eGNkYWRrdW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NzM0OTYsImV4cCI6MjA5MTI0OTQ5Nn0.i95llFvS9-eiH_U0P21nOPIW5uyuGZXq9l8blaT5a7Y';

/* ════════ SETUP_SQL (SQL Editor मध्ये एकदा run करा) ════════

CREATE TABLE IF NOT EXISTS public.newspapers (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  date_text   TEXT NOT NULL,
  description TEXT DEFAULT '',
  pdf_url     TEXT DEFAULT '',
  thumb_url   TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_logins (
  id         BIGSERIAL PRIMARY KEY,
  email      TEXT NOT NULL,
  name       TEXT DEFAULT '',
  logged_at  TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT DEFAULT ''
);

ALTER TABLE public.newspapers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_logins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read newspapers" ON public.newspapers FOR SELECT USING (true);
CREATE POLICY "Anon insert logins"     ON public.user_logins FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read logins"     ON public.user_logins FOR SELECT USING (true);

-- Realtime enable
ALTER PUBLICATION supabase_realtime ADD TABLE public.newspapers;

════════ STORAGE: Dashboard → Storage → New Bucket
  Name: newspapers-pdfs | Public: ON ════════ */

const _SB_BUCKET = 'newspapers-pdfs';
let _sbClient = null;

function _sb() {
  if (!_sbClient && _isReady() && window.supabase) {
    _sbClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }
  return _sbClient;
}

function _isReady() {
  return window.SUPABASE_URL      !== 'YOUR_SUPABASE_PROJECT_URL' &&
         window.SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_PUBLIC_KEY';
}

// ── Newspapers ──
async function sbFetch() {
  const sb = _sb(); if (!sb) return null;
  const { data, error } = await sb.from('newspapers').select('*').order('created_at', { ascending: false });
  if (error) { console.error('[SB]', error.message); return null; }
  return data;
}

async function sbUploadPDF(file) {
  const sb = _sb(); if (!sb) throw new Error('Supabase not configured');
  const name = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  const { error } = await sb.storage.from(_SB_BUCKET).upload(name, file, { contentType:'application/pdf', upsert:false });
  if (error) throw new Error(error.message);
  return sb.storage.from(_SB_BUCKET).getPublicUrl(name).data.publicUrl;
}

async function sbInsert(rec) {
  const sb = _sb(); if (!sb) throw new Error('Supabase not configured');
  const { data, error } = await sb.from('newspapers').insert([rec]).select();
  if (error) throw new Error(error.message);
  return data[0];
}

async function sbDelete(id) {
  const sb = _sb(); if (!sb) throw new Error('Supabase not configured');
  const { error } = await sb.from('newspapers').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Realtime ──
let _rSub = null;
function sbSubscribe(onInsert, onDelete) {
  const sb = _sb(); if (!sb) return;
  if (_rSub) { sb.removeChannel(_rSub); _rSub = null; }
  _rSub = sb.channel('papers_rt')
    .on('postgres_changes', { event:'INSERT', schema:'public', table:'newspapers' }, p => onInsert && onInsert(p.new))
    .on('postgres_changes', { event:'DELETE', schema:'public', table:'newspapers' }, p => onDelete && onDelete(p.old))
    .subscribe(status => console.log('[SB Realtime]', status));
}

// ── User Login Tracking ──
async function sbTrackLogin(email, name) {
  const sb = _sb(); if (!sb) return;
  await sb.from('user_logins').insert([{ email, name: name || email.split('@')[0], user_agent: navigator.userAgent.slice(0, 200) }]);
}

// ── Analytics ──
async function sbAnalytics() {
  const sb = _sb(); if (!sb) return null;
  const now = new Date();
  const iso = d => new Date(now - d * 86400000).toISOString();

  const [all, day, week, month, year] = await Promise.all([
    sb.from('user_logins').select('id', { count:'exact', head:true }),
    sb.from('user_logins').select('id', { count:'exact', head:true }).gte('logged_at', iso(1)),
    sb.from('user_logins').select('id', { count:'exact', head:true }).gte('logged_at', iso(7)),
    sb.from('user_logins').select('id', { count:'exact', head:true }).gte('logged_at', iso(30)),
    sb.from('user_logins').select('id', { count:'exact', head:true }).gte('logged_at', iso(365)),
  ]);

  const { data: allEmails } = await sb.from('user_logins').select('email');
  const unique = allEmails ? new Set(allEmails.map(r => r.email)).size : 0;

  const { data: recent } = await sb.from('user_logins').select('email,name,logged_at').order('logged_at', { ascending:false }).limit(100);

  // Daily chart data (last 30 days)
  const { data: daily } = await sb.from('user_logins').select('logged_at').gte('logged_at', iso(30)).order('logged_at', { ascending:true });
  const dailyMap = {};
  (daily || []).forEach(r => { const d = r.logged_at.slice(0,10); dailyMap[d] = (dailyMap[d]||0) + 1; });

  // Weekly chart (last 12 weeks)
  const { data: weekly } = await sb.from('user_logins').select('logged_at').gte('logged_at', iso(84));
  const weekMap = {};
  (weekly || []).forEach(r => {
    const d = new Date(r.logged_at);
    const wk = `${d.getFullYear()}-W${String(Math.ceil((d.getDate() + new Date(d.getFullYear(), d.getMonth(), 1).getDay()) / 7)).padStart(2,'0')}`;
    weekMap[wk] = (weekMap[wk]||0) + 1;
  });

  return { total: all.count||0, today: day.count||0, week: week.count||0, month: month.count||0, year: year.count||0, unique, recent: recent||[], dailyMap, weekMap };
}

window.SB = { isReady:_isReady, fetch:sbFetch, uploadPDF:sbUploadPDF, insert:sbInsert, delete:sbDelete, subscribe:sbSubscribe, trackLogin:sbTrackLogin, analytics:sbAnalytics };
