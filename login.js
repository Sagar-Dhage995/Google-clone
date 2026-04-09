// ═══════════════════════════════════════════════════
//  कर्तृत्ववान शेतकरी  —  login.js  v5
//  Supabase Login Tracking + EmailJS
// ═══════════════════════════════════════════════════

const EJ_PUBLIC_KEY     = 'PQZ8-cpqNCQY88aoe';
const EJ_SERVICE_ID     = 'service_3mwcpmt';
const EJ_USER_TEMPLATE  = 'template_nsz9w6n';
const EJ_ADMIN_TEMPLATE = 'template_nsz9w6n';
const ADMIN_EMAIL       = 'harilokhande2011988@gmail.com';
const OWNER_EMAIL       = 'harilokhande2011988@gmail.com';

function ejReady() { return EJ_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY'; }
function validEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('ks_user_email')) { window.location.href='index.html'; return; }
  updateDate();
  if (ejReady() && typeof emailjs !== 'undefined') emailjs.init(EJ_PUBLIC_KEY);
});

function updateDate(){
  const MM=['जानेवारी','फेब्रुवारी','मार्च','एप्रिल','मे','जून','जुलै','ऑगस्ट','सप्टेंबर','ऑक्टोबर','नोव्हेंबर','डिसेंबर'];
  const DD=['रविवार','सोमवार','मंगळवार','बुधवार','गुरुवार','शुक्रवार','शनिवार'];
  const n=new Date(), el=document.getElementById('login-date');
  if(el)el.textContent=`${DD[n.getDay()]}, ${n.getDate()} ${MM[n.getMonth()]} ${n.getFullYear()}`;
}

const form=document.getElementById('login-form'), msgEl=document.getElementById('login-msg'), btn=document.getElementById('login-btn');

if(form){
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    if (!email)         { show('❌ Email Address टाका.','error'); return; }
    if (!validEmail(email)) { show('❌ Email format चुकीचा. (name@gmail.com)','error'); return; }

    btn.disabled=true; btn.textContent='⏳ ...';
    const name = email.split('@')[0];
    const time = new Date().toLocaleString('mr-IN');
    const isOwner = email.toLowerCase()===OWNER_EMAIL.toLowerCase();

    // ① Supabase login tracking (Supabase configured असल्यास)
    if (window.SB?.isReady()) {
      try { await window.SB.trackLogin(email, name); }
      catch(e){ console.warn('[SB track]', e.message); }
    }

    // ② EmailJS
    if (ejReady() && typeof emailjs !== 'undefined') {
      try {
        await emailjs.send(EJ_SERVICE_ID, EJ_USER_TEMPLATE, { to_email:email, to_name:name, user_email:email, login_time:time, site_url:location.origin });
        if (email.toLowerCase()!==ADMIN_EMAIL.toLowerCase()) {
          await emailjs.send(EJ_SERVICE_ID, EJ_ADMIN_TEMPLATE, { to_email:ADMIN_EMAIL, user_email:email, user_name:name, login_time:time, site_url:location.origin });
        }
      } catch(err){ console.warn('[EJ]', err.text||err.message); }
    }

    // Save login state
    localStorage.setItem('ks_user_email', email);
    localStorage.setItem('ks_user_name', name);

    btn.textContent='✅ Login!';
    show(`✅ <strong>${email}</strong> — Login यशस्वी!<br>${isOwner?'<strong style="color:#0f6b28">🔐 Owner Access — अंक add/delete करता येतील.</strong><br>':''}<small>Redirect होत आहे...</small>`,'success');
    confetti();
    setTimeout(()=>window.location.href='index.html', 2800);
  });
}

function show(html, type){
  if(!msgEl)return;
  msgEl.innerHTML=html; msgEl.className=`form-msg ${type}`;
  msgEl.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function confetti(){
  const C=['#0f6b28','#e07b1a','#c9940f','#3dbe5e','#fff'];
  for(let i=0;i<60;i++){const d=document.createElement('div');const sz=5+Math.random()*8;d.style.cssText=`position:fixed;width:${sz}px;height:${sz}px;background:${C[Math.floor(Math.random()*C.length)]};border-radius:${Math.random()>.5?'50%':'2px'};top:-20px;left:${Math.random()*100}vw;z-index:9999;pointer-events:none;animation:cf ${1.5+Math.random()*2}s ease-in forwards;animation-delay:${Math.random()*.5}s;`;document.body.appendChild(d);setTimeout(()=>d.remove(),3500);}
  if(!document.getElementById('cf-s')){const s=document.createElement('style');s.id='cf-s';s.textContent='@keyframes cf{to{top:110vh;transform:rotate(720deg);opacity:0}}';document.head.appendChild(s);}
}
