document.addEventListener('DOMContentLoaded', () => {
  const USERS_KEY = 'upa_users';
  const SESSION_KEY = 'upa_session';

  function loadUsers(){ try{ return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }catch(e){ return []; } }
  function saveUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
  function saveSession(s){ localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
  function loadSession(){ try{ return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }catch(e){ return null; } }
  function clearSession(){ localStorage.removeItem(SESSION_KEY); }

  function findUser(email){ return loadUsers().find(u=>u.email===email); }

  function createUser(name,email,password){
    const users = loadUsers();
    if(findUser(email)) throw new Error('User already exists');
    const u = { id: Date.now(), name, email, password };
    users.push(u); saveUsers(users); return u;
  }

  function authenticate(email,password){
    const u = findUser(email);
    if(!u || u.password !== password) throw new Error('Invalid credentials');
    const session = { token: 's-'+Date.now(), userId: u.id, name: u.name, email: u.email };
    saveSession(session); return session;
  }

  // modal
  function ensureModal(){ if(document.getElementById('upa-auth-modal')) return; const m = document.createElement('div'); m.id='upa-auth-modal'; m.innerHTML = `
  <div class="upa-modal-overlay" style="position:fixed;inset:0;display:none;align-items:center;justify-content:center;z-index:12000;background:rgba(0,0,0,.45)">
    <div class="upa-modal-card" role="dialog" aria-modal="true" style="width:420px;max-width:92%;background:var(--bg);color:var(--text);border-radius:10px;padding:1rem;box-shadow:0 20px 60px rgba(0,0,0,.35)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem"><h3 style="margin:0">Account</h3><button id="upa-close-x" class="btn">✕</button></div>
      <div style="display:flex;gap:.5rem;margin-bottom:.75rem">
        <button id="upa-tab-login" class="btn btn-ghost">Login</button>
        <button id="upa-tab-signup" class="btn">Sign up</button>
      </div>
      <div id="upa-forms">
        <form id="upa-login-form">
          <input name="email" placeholder="Email" required style="width:100%;margin-bottom:.5rem;padding:.5rem" />
          <input name="password" type="password" placeholder="Password" required style="width:100%;margin-bottom:.5rem;padding:.5rem" />
          <div style="display:flex;gap:.5rem;justify-content:space-between;align-items:center;margin-bottom:.5rem">
            <button type="button" id="upa-forgot-password" class="btn btn-ghost" style="font-size:0.9rem;padding:0.25rem 0.5rem;">Forgot Password?</button>
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
        </form>
        <form id="upa-signup-form" style="display:none">
          <input name="name" placeholder="Full name" required style="width:100%;margin-bottom:.5rem;padding:.5rem" />
          <input name="email" placeholder="Email" required style="width:100%;margin-bottom:.5rem;padding:.5rem" />
          <input name="password" type="password" placeholder="Password" required style="width:100%;margin-bottom:.5rem;padding:.5rem" />
          <input name="confirm" type="password" placeholder="Confirm Password" required style="width:100%;margin-bottom:.5rem;padding:.5rem" />
          <div style="display:flex;gap:.5rem;justify-content:flex-end"><button type="submit" class="btn btn-primary">Create account</button></div>
        </form>
      </div>
    </div>
  </div>
  `; document.body.appendChild(m);

    const overlay = m.querySelector('.upa-modal-overlay');
    m.querySelector('#upa-close-x').addEventListener('click', ()=> overlay.style.display='none');
    m.querySelector('#upa-tab-login').addEventListener('click', ()=>{ m.querySelector('#upa-login-form').style.display='block'; m.querySelector('#upa-signup-form').style.display='none'; });
    m.querySelector('#upa-tab-signup').addEventListener('click', ()=>{ m.querySelector('#upa-login-form').style.display='none'; m.querySelector('#upa-signup-form').style.display='block'; });

    m.querySelector('#upa-login-form').addEventListener('submit', function(e){ e.preventDefault(); const email=this.email.value; const pass=this.password.value; try{ const sess=authenticate(email,pass); overlay.style.display='none'; applyLoggedIn(sess); window.location.href = './dashboard.html'; }catch(err){ alert(err.message); } });

    m.querySelector('#upa-forgot-password').addEventListener('click', () => { alert('Please contact support at info@urbanpulseadventures.com to reset your password.'); });

    m.querySelector('#upa-signup-form').addEventListener('submit', function(e){ e.preventDefault(); const name=this.name.value; const email=this.email.value; const pass=this.password.value; const conf=this.confirm.value; if(pass.length<6){ alert('Password must be at least 6 characters'); return; } if(pass!==conf){ alert('Passwords do not match'); return; } try{ createUser(name,email,pass); const sess = authenticate(email,pass); overlay.style.display='none'; applyLoggedIn(sess); window.location.href = './dashboard.html'; } catch(err){ alert(err.message); } });
  }

  function openModal(){ ensureModal(); const overlay = document.querySelector('#upa-auth-modal .upa-modal-overlay'); overlay.style.display = 'flex'; }

  function applyLoggedIn(sess){ const loginBtn = document.querySelector('.login-btn'); if(loginBtn){ loginBtn.title = 'Account: '+(sess.name||sess.email); loginBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';} }

  // expose
  window.auth = { openModal, current: loadSession, logout: ()=>{ clearSession(); location.reload(); } };

  // attach to existing nav button
  console.log('[AUTH] initializing auth module');
  const loginBtns = document.querySelectorAll('.login-btn');
  loginBtns.forEach(b => b.addEventListener('click', (e)=>{ 
    e.preventDefault();
    console.log('[AUTH] login button clicked');
    openModal(); 
  }));

  // apply session state on load
  const sess = loadSession(); if(sess) applyLoggedIn(sess);
});