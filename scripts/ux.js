// Futuristic UI interactions: page transitions, nav toggle, button ripple

function initializeUx(){
  console.log('[UX] initializeUx running');
  // Page entrance animation
  document.body.classList.add('page-enter');
  requestAnimationFrame(() => {
    document.body.classList.add('page-enter-active');
  });
  setTimeout(() => {
    document.body.classList.remove('page-enter', 'page-enter-active');
  }, 600);

  // Standardized loader: show for 3 seconds, then reveal all page content
  const loader = document.getElementById('site-loader');
  if (loader) {
    loader.classList.remove('hidden');
    setTimeout(() => {
      console.log('[UX] hiding loader after 3s');
      // After 3 seconds, remove preload class and hide/remove loader
      document.body.classList.remove('site-preload');
      loader.classList.add('hidden');
      setTimeout(() => { 
        try { loader.remove(); } catch (e) {}
      }, 520);
    }, 3000);
  } else {
    console.log('[UX] no loader element found');
    // If no loader exists, just ensure preload is removed
    document.body.classList.remove('site-preload');
  }

  // Nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Set active nav link based on current page and close mobile menu on link click
  function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.main-nav a');
    const currentPath = window.location.pathname;
    let foundActive = false;

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      let isActive = false;

      if (href === './' || href === '') {
        isActive = currentPath === '/' || currentPath.endsWith('index.html');
      } else if (href && !href.startsWith('#')) {
        isActive = currentPath.includes(href.replace(/^\.\//, ''));
      }

      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
        foundActive = true;
      } else {
        link.removeAttribute('aria-current');
      }

      // Close mobile menu when nav link is clicked
      if (isActive === false) {
        link.addEventListener('click', () => {
          if (mainNav.classList.contains('open')) {
            mainNav.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
          }
        });
      }
    });
  }
  updateActiveNavLink();
  window.addEventListener('load', updateActiveNavLink);

  // Theme toggle (light brown <-> dark)
  const themeToggle = document.querySelector('.theme-toggle');
  function applyTheme(theme){
    if(theme === 'dark') document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('site-theme', theme);
  }
  // expose for delegated handler or external code
  window.applyTheme = applyTheme;
  // Initialize theme from storage or system
  const saved = localStorage.getItem('site-theme');
  if(saved) applyTheme(saved);
  else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');
  if(themeToggle){
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
      themeToggle.textContent = isDark ? '☼' : '●';
    });
    // set correct symbol
    themeToggle.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '●' : '☼';
  }

  // Live clock with AM/PM
  const liveClock = document.getElementById('live-clock');
  if (liveClock) {
    function updateClock() {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      liveClock.textContent = timeString;
    }
    updateClock(); // Initial update
    setInterval(updateClock, 1000); // Update every second
  }

  // Button ripple effect
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('pointerdown', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height) * 0.9;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Link hover microinteraction for pointer devices
  document.querySelectorAll('a').forEach(a => {
    a.addEventListener('mousemove', (e) => {
      if (!a.classList.contains('link-fx')) return;
      const rect = a.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      a.style.setProperty('--hover-x', px);
    });
  });

  // Simple progressive page navigation animation for internal links
  document.querySelectorAll('a[href]').forEach(a => {
    try {
      const url = new URL(a.href);
      if (url.origin === location.origin) {
        a.addEventListener('click', (ev) => {
          const href = a.getAttribute('href');
          if (!href || href.startsWith('#')) return;
          ev.preventDefault();
          document.body.classList.add('page-exit-active');
          setTimeout(() => location.href = href, 300);
        });
      }
    } catch (e) { /* ignore invalid hrefs */ }
  });

  // Maintain hero slides order (user prefers fixed sequence)
  /* previously randomized; keeping original markup order now */
  // (function shuffleHeroSlides(){
  //   const container = document.querySelector('.hero .slides');
  //   if(!container) return;
  //   const slides = Array.from(container.children);
  //   if(slides.length <= 1) return;
  //   slides.sort(() => Math.random() - 0.5);
  //   slides.forEach(s => container.appendChild(s));
  // })();

  /* ----- Additional site-wide utilities: Auth, Translate Widget, Currency Manager, Theme vars ----- */
  (function enhancedSiteFeatures(){
    // Theme CSS variables (light and dark brown themes)
    if (!document.getElementById('upa-theme-vars')){
      const s = document.createElement('style');
      s.id = 'upa-theme-vars';
      s.textContent = `
      :root{ --bg:#ffffff; --text:#2c1b12; --muted:#6b4a3a; --accent:#b8865b; --accent-2:#c27b39; }
      [data-theme='dark']{ --bg:#2c1b12; --text:#efe6d9; --muted:#bdaea0; --accent:#8c6a4f; --accent-2:#a6784f }
      body{ background:var(--bg); color:var(--text); }
      .site-header, .site-footer, .card { background: transparent; }
      `;
      document.head.appendChild(s);
    }

    // AUTH - simple client-side users and session manager (localStorage)
    window.authManager = (function(){
      const KEY_USERS = 'upa_users';
      const KEY_SESSION = 'upa_session';

      function loadUsers(){ try { return JSON.parse(localStorage.getItem(KEY_USERS) || '[]'); } catch(e){ return []; } }
      function saveUsers(u){ localStorage.setItem(KEY_USERS, JSON.stringify(u)); }
      function saveSession(sess){ localStorage.setItem(KEY_SESSION, JSON.stringify(sess)); }
      function loadSession(){ try { return JSON.parse(localStorage.getItem(KEY_SESSION) || 'null'); } catch(e){ return null; } }
      function clearSession(){ localStorage.removeItem(KEY_SESSION); }

      function findUser(email){ return loadUsers().find(u => u.email === email); }

      function signup(name,email,password){
        const users = loadUsers();
        if(findUser(email)) throw new Error('User exists');
        const u = { id: Date.now(), name: name||email.split('@')[0], email, password };
        users.push(u); saveUsers(users);
        const sess = { userId: u.id, name: u.name, email: u.email, token: 'sess-' + Date.now() };
        saveSession(sess);
        return sess;
      }

      function login(email,password){
        const u = findUser(email);
        if(!u || u.password !== password) throw new Error('Invalid credentials');
        const sess = { userId: u.id, name: u.name, email: u.email, token: 'sess-' + Date.now() };
        saveSession(sess);
        return sess;
      }

      function logout(){ clearSession(); }

      function current(){ return loadSession(); }

      // Modal UI injection
      function ensureModal(){
        if(document.getElementById('upa-auth-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'upa-auth-modal';
        modal.innerHTML = `
        <div class="upa-modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.45);display:none;align-items:center;justify-content:center;z-index:12000">
          <div class="upa-modal-card" role="dialog" aria-modal="true" style="width:420px;max-width:92%;background:var(--bg);color:var(--text);border-radius:12px;padding:1rem;box-shadow:0 18px 60px rgba(0,0,0,0.35)">
            <h3 style="margin:0 0 .5rem">Account</h3>
            <div style="display:flex;gap:.5rem;margin-bottom:.75rem">
              <button id="upa-tab-login" class="btn">Login</button>
              <button id="upa-tab-signup" class="btn btn-ghost">Sign up</button>
            </div>
            <div id="upa-forms">
              <form id="upa-login-form">
                <input name="email" placeholder="Email" required style="width:100%;margin-bottom:.5rem;padding:.5rem" />
                <input name="password" type="password" placeholder="Password" required style="width:100%;margin-bottom:.5rem;padding:.5rem" />
                <div style="display:flex;gap:.5rem;justify-content:flex-end"><button type="submit" class="btn btn-primary">Login</button><button type="button" id="upa-close" class="btn">Close</button></div>
              </form>
              <form id="upa-signup-form" style="display:none">
                <input name="name" placeholder="Full name" required style="width:100%;margin-bottom:.5rem;padding:.5rem" />
                <input name="email" placeholder="Email" required style="width:100%;margin-bottom:.5rem;padding:.5rem" />
                <input name="password" type="password" placeholder="Password" required style="width:100%;margin-bottom:.5rem;padding:.5rem" />
                <div style="display:flex;gap:.5rem;justify-content:flex-end"><button type="submit" class="btn btn-primary">Create account</button><button type="button" id="upa-close-2" class="btn">Close</button></div>
              </form>
            </div>
          </div>
        </div>
        `;
        document.body.appendChild(modal);
        const overlay = modal.querySelector('.upa-modal-overlay');
        const loginForm = modal.querySelector('#upa-login-form');
        const signupForm = modal.querySelector('#upa-signup-form');
        modal.querySelector('#upa-tab-login').addEventListener('click', ()=>{ loginForm.style.display='block'; signupForm.style.display='none'; });
        modal.querySelector('#upa-tab-signup').addEventListener('click', ()=>{ loginForm.style.display='none'; signupForm.style.display='block'; });
        modal.querySelector('#upa-close').addEventListener('click', ()=> overlay.style.display='none');
        modal.querySelector('#upa-close-2').addEventListener('click', ()=> overlay.style.display='none');

        loginForm.addEventListener('submit', function(e){ e.preventDefault(); try{ const email=this.email.value; const pass=this.password.value; const sess=login(email,pass); overlay.style.display='none'; applyLoggedInState(sess); window.location.href = './dashboard.html'; } catch(err){ alert(err.message); } });
        signupForm.addEventListener('submit', function(e){ e.preventDefault(); try{ const name=this.name.value; const email=this.email.value; const pass=this.password.value; const sess=signup(name,email,pass); overlay.style.display='none'; applyLoggedInState(sess); window.location.href = './dashboard.html'; } catch(err){ alert(err.message); } });
      }

      function open(){ ensureModal(); const modal = document.getElementById('upa-auth-modal'); const overlay = modal.querySelector('.upa-modal-overlay'); overlay.style.display='flex'; }

      function applyLoggedInState(sess){
        // update login button to show account
        const loginBtn = document.querySelector('.login-btn');
        if(loginBtn){ loginBtn.title = 'Account: ' + (sess.name || sess.email); loginBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        }
      }

      // Wire into global openLoginModal
      window.openLoginModal = function(){ open(); };

      // If session exists, apply
      const sess = loadSession(); if(sess) { applyLoggedInState(sess); }

      return { signup, login, logout, current, open };
    })();

    // TRANSLATE - integrate Google Translate Web Element (limited languages)
    window.translateManager = (function(){
      const allowed = ['en','sw','zh-CN','hi','es','ar','fr','bn','pt','ru','id','de'];
      function injectWidget(){
        if(document.getElementById('google_translate_element')) return;
        const container = document.createElement('div'); container.id = 'google_translate_element'; container.style.display='inline-block';
        const utilities = document.querySelector('.nav-utilities');
        if(utilities) utilities.appendChild(container);
        window.googleTranslateElementInit = function(){
          try{
            new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: allowed.join(','), layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
          }catch(e){}
        };
        const s = document.createElement('script'); s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'; s.async = true; document.head.appendChild(s);
      }

      function setLanguage(code){
        // map code variants
        if(!allowed.includes(code)) return;
        // Try to set using the widget select control
        try{
          const frame = document.querySelector('#google_translate_element select');
          if(frame){ frame.value = code; frame.dispatchEvent(new Event('change')); return; }
          // fallback: attempt to call global function
          if(window.google && window.google.translate && typeof window.google.translate.TranslateElement === 'function'){ /* rely on widget */ }
        }catch(e){}
      }

      injectWidget();
      return { setLanguage, allowed };
    })();

    // CURRENCY - KES base
    window.currencyManager = (function(){
      const KEY = 'upa_currency';
      // exchangeRates defined as 1 KES -> X currency units (converted = KES * rate)
      const rates = {
        'USD': 0.0065, 'EUR': 0.0059, 'JPY': 0.91, 'GBP': 0.0047, 'AUD': 0.0097, 'CAD': 0.0086, 'CHF': 0.0060, 'CNY': 0.046, 'HKD': 0.051, 'NZD': 0.010, 'KES': 1, 'ZAR': 0.11, 'EGP': 0.20, 'NGN': 3.18, 'MAD': 0.061, 'TND': 0.019, 'GHS': 0.056, 'BWP': 0.079, 'DZD': 0.91
      };
      function get(){ return localStorage.getItem(KEY) || detectDefault(); }
      function set(code){ localStorage.setItem(KEY, code); updateAllPrices(code); }
      function detectDefault(){
        try{
          const lang = (navigator.language || 'en').toLowerCase();
          if(lang.includes('ke') || lang.includes('sw')) return 'KES';
          if(lang.includes('us') || lang.includes('en-us')) return 'USD';
          if(lang.includes('gb')||lang.includes('en-gb')) return 'GBP';
          if(lang.includes('jp')) return 'JPY';
        }catch(e){}
        return 'USD';
      }

      function formatAmount(amount, code){
        try{
          const locale = code === 'JPY' ? 'ja-JP' : (code === 'EUR' ? 'de-DE' : 'en-US');
          return new Intl.NumberFormat(locale, { style: 'currency', currency: code, maximumFractionDigits: 2 }).format(amount);
        }catch(e){ return (code || '') + ' ' + amount; }
      }

      function updateAllPrices(overrideCode){
        const code = overrideCode || get();
        document.querySelectorAll('[data-price]').forEach(el => {
          const baseKES = parseFloat(el.getAttribute('data-price')) || parseFloat(el.textContent.replace(/[^0-9\.]/g,'')) || 0;
          const rate = rates[code] || 1;
          const converted = (baseKES * rate);
          el.textContent = formatAmount(converted, code);
        });
      }

      // expose
      window.exchangeRates = rates;
      return { get, set, updateAllPrices, rates };
    })();

    // Hook language and currency dropdowns to these managers
    document.addEventListener('click', function(e){
      const lang = e.target.closest('.dropdown-item[data-lang]');
      if(lang){ const code = lang.getAttribute('data-lang'); try{ window.translateManager.setLanguage(code); localStorage.setItem('upa_lang', code); } catch(e){} return; }
      const cur = e.target.closest('.dropdown-item[data-currency]');
      if(cur){ const code = cur.getAttribute('data-currency'); try{ window.currencyManager.set(code); } catch(e){} return; }
    }, true);

    // Enhance existing inline dropdown items (if not already marked) by adding data attributes
    document.querySelectorAll('.dropdown-menu.language-menu .dropdown-item').forEach(btn => {
      if(!btn.hasAttribute('data-lang')){
        const text = btn.textContent.trim().toLowerCase();
        // map visible labels to language codes
        const map = { 'english':'en','swahili':'sw','español':'es','français':'fr','roadman':'en','mandarin':'zh-CN','chinese':'zh-CN','hindi':'hi','arabic':'ar','bengali':'bn','portuguese':'pt','russian':'ru','indonesian':'id','deutsch':'de' };
        for(const k in map){ if(text.includes(k)) { btn.setAttribute('data-lang', map[k]); break; } }
      }
    });
    document.querySelectorAll('.dropdown-menu.currency-menu .dropdown-item').forEach(btn => {
      if(!btn.hasAttribute('data-currency')){
        const txt = btn.textContent.trim(); const parts = txt.split(' ');
        const code = parts[parts.length-1] || txt; btn.setAttribute('data-currency', code.replace(/[^A-Z]/g,''));
      }
    });

    // On init run currency update for elements using data-price
    try{ window.currencyManager.updateAllPrices(); }catch(e){}

  })();

  // Robust: attach explicit listeners (capture) so buttons always respond regardless of load timing
  try {
    document.querySelectorAll('.utility-btn.language-btn').forEach(btn => {
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        const menu = this.closest('.utility-dropdown').querySelector('.dropdown-menu');
        // ensure menu toggles
        if (menu) menu.classList.toggle('active');
      }, {capture: true});
    });

    document.querySelectorAll('.utility-btn.currency-btn').forEach(btn => {
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        const menu = this.closest('.utility-dropdown').querySelector('.dropdown-menu');
        if (menu) menu.classList.toggle('active');
      }, {capture: true});
    });

    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function(e){
        e.stopPropagation();
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        applyTheme(isDark ? 'light' : 'dark');
        this.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '●' : '☼';
      }, {capture: true});
    }
  } catch (err) { /* ignore setup errors */ }

  // Site-wide translations, price updater, clock and calendar injection
  (function siteWideI18nAndUtilities(){
    // Full translations object (copied from nightlife page) to cover all data-i18n keys site-wide
    const translations = {
      'en': {'hero-title':'Nairobi Nightlife','hero-desc':'Discover Nairobi\'s vibrant after-dark culture — live music, food streets, and vibrant local scenes.','activities-heading':'Our Nightlife Activities','activity-clubhopping':'Club Hopping','activity-clubhopping-desc':'Dive into Nairobi\'s pulsating club scene with local guides leading the way.','activity-documentary':'Documentary Filming','activity-documentary-desc':'Capture authentic stories and moments with professional filming sessions.','activity-acoustic':'Acoustic Music and Karaoke','activity-acoustic-desc':'Enjoy live acoustic performances and join in karaoke fun.','activity-skyscrapers':'Nairobi Skyscrapers','activity-skyscrapers-desc':'Discover Nairobi\'s iconic skyscrapers and modern architecture lighting up the night sky.','activity-stargazing':'Stargazing','activity-stargazing-desc':'Gaze at the night sky and learn about constellations in a serene setting.','activity-nightscape':'City Night Scape','activity-nightscape-desc':'Explore the illuminated cityscape and hidden night spots.','activity-mall':'Mall Activities','activity-mall-desc':'Shop, dine, and enjoy entertainment at Nairobi\'s vibrant malls.','activity-dinner':'Dinner Buffet','activity-dinner-desc':'Indulge in a variety of cuisines at exclusive dinner buffets.','activity-cinema':'Cinema and Theatre','activity-cinema-desc':'Catch the latest films or live theatre performances.','activity-camping':'Camping and Bonfire','activity-camping-desc':'Experience an unforgettable night under the stars with friends around a bonfire.','activity-mtaa':'Mtaa Game Night','activity-mtaa-desc':'Compete in urban street games, challenges, and social competitions with the vibrant Nairobi community.','package-heading':'Nairobi Nightlife Package','package-title':'Nairobi Nightlife Experience','age-label':'Age Restriction:','age-restrict-text':'18+ (Adults Only)','highlights-heading':'Highlights','highlight-1':'Savor the flavors of Kenya with a traditional dinner or open grill feast','highlight-2':'Experience Nairobi\'s vibrant nightlife with a guided bar-hopping tour','highlight-3':'Dance the night away at a club with Afro-house, Amapiano, and more','highlight-4':'Try late-night street food like smokie pasua, mutura, and chips masala','description-heading':'Full Description','desc-1':'Begin your evening with a professional guide. As dusk settles, drive through Nairobi\'s bustling streets toward a rooftop lounge—often in Westlands, Kilimani, or Lavington—areas famous for their high-end night spots.','desc-2':'Enjoy a complimentary cocktail or fresh juice, panoramic views of Nairobi\'s skyline, and soft Afro-jazz or soulful music as the city lights come alive. It\'s the perfect moment for photos and settling into the rhythm of the night.','desc-3':'Next, head to a top-rated restaurant for an authentic Kenyan dining experience. Depending on your preference, the evening may feature a traditional Kenyan buffet or a carnivore-style open grill experience. For adventurous eaters, try a selection of game meats alongside lively African music and dancing.','desc-4':'A cultural briefing introduces Kenyan drinking etiquette, nightlife culture, and popular local brews (Tusker, White Cap, or craft beers).','desc-5':'With your guide leading the way, set off for a bar-hopping experience across Nairobi\'s most energetic nightlife hub: Westlands. Each stop offers a different flavor of the city. Visit a cocktail lounge, a live music joint, and a social pub or sports bar.','desc-6':'Now that the night is in full swing, it\'s time for Nairobi\'s famed club scene. Options include high-energy clubs known for Afro-house, Amapiano, Afrobeat, Dancehall, Hip-hop, and local Kenyan hits. Expect a vibrant, diverse crowd, high-quality DJs, light shows, and upbeat dance floors.','desc-7':'After dancing, cool off with Nairobi\'s favorite late-night snacks: smokie pasua, mutura (Kenyan sausage), chips masala, mahindi choma (roast maize), and nyama choma stands. This is Nairobi at its most authentic—energetic, flavorful, and full of local charm.','desc-8':'Finally, your driver returns you safely to your hotel or residence. End the night with a full photo gallery, memories of unmatched Kenyan hospitality, and a new understanding of why Nairobi\'s nightlife is legendary.','includes-heading':'Includes','include-1':'Professional nightlife guide','include-2':'Welcome drink','include-3':'Entry to bars and clubs','include-4':'Security oversight','include-5':'Cultural explanations','include-6':'Photography assistance','include-7':'VIP table at clubs','include-8':'Craft beer tasting','include-9':'Personalized photography package','include-10':'Private group vehicles','include-11':'Celebrity performance nights','meetpoint-heading':'Meeting Point','meetpoint-location':'Prestige Plaza Shopping Mall','meetpoint-desc':'We meet at the front gate entrance.','maps-link':'Open in Google Maps','important-heading':'Important Information — Know Before You Go','important-1':'The tour involves visiting multiple nightlife venues, so comfortable clothing and shoes are recommended.','important-2':'Participants should be prepared for a late night, as the tour ends between 2:00 and 3:00 AM.','important-3':'The tour includes alcoholic beverages, so participants should be of legal drinking age.','booking-title':'Book Your Adventure','ready-book':'Ready to Experience Nairobi\'s Nightlife?','book-desc':'Book your unforgettable adventure today. Choose your activities, select your date and time, and reserve your spot now.','book-btn':'Book Now'},
      'sw': {'hero-title':'Mabukeni ya Nairobi','hero-desc':'Tafuta utajiri wa Nairobi baada ya jua - muziki bege, mitaa ya chakula, na maeneo ya ndoto.','activities-heading':'Shughuli Zetu za Usiku','activity-clubhopping':'Kuzunguka Vilabu','activity-clubhopping-desc':'Ingia katika nyumba ya musiki ya Nairobi na viongozi wa ndani wanakuongoza.','activity-documentary':'Kurekodi Filamu za Utamaduni','activity-documentary-desc':'Kamata hadithi na mipango halisi na vikoba vya filamu.','activity-acoustic':'Muziki wa Akustiki na Karaoke','activity-acoustic-desc':'Furahia tamasha za muziki halisi na ujina wa karaoke.','activity-skyscrapers':'Nyumba za Nairobi','activity-skyscrapers-desc':'Gundua majengo ya Nairobi na usanifu wa kisasa unaomwang\'a angavu usiku.','activity-stargazing':'Kutazama Nyota','activity-stargazing-desc':'Angalia angavu na jifunze kuhusu nyota katika mahali tulivu.','activity-nightscape':'Mandhari ya Jioni ya Jiji','activity-nightscape-desc':'Tembea jijini lililowaka na mahali maalum ya usiku.','activity-mall':'Shughuli za Duka la Jumla','activity-mall-desc':'Nunua, kula, na furahia burudani katika maduka ya Nairobi.','activity-dinner':'Chakula cha Jioni','activity-dinner-desc':'Taka vyakula mbalimbali katika meza za chakula.','activity-cinema':'Sinema na Ustadi','activity-cinema-desc':'Tazama filamu mpya au tamasha la ustadi.','activity-camping':'Kambi na Moto','activity-camping-desc':'Jifunza usiku usiotaka kusahau chini ya nyota na rafiki karibu na moto.','activity-mtaa':'Logomgeli ya Mtaa','activity-mtaa-desc':'Pinga katika michezo ya mitaa, changamoto, na shindano la kijamii na jamii ya Nairobi.','package-heading':'Paketi ya Mabukeni ya Nairobi','package-title':'Uzoefu wa Mabukeni ya Nairobi','age-label':'Jalibu la Umri:','age-restrict-text':'18+ (Watu Wazima Tu)','highlights-heading':'Vidokezo','highlight-1':'Taka ladha ya Kenya na chakula au kupika kwa moto','highlight-2':'Jifunza mabukeni ya Nairobi na mwongozo wa vilabu','highlight-3':'Cheza sehemu nzuri ya mgahawa na musiki wa Afro-house','highlight-4':'Jaribu chakula cha jioni kama smokie, mutura, na chips masala','description-heading':'Maelezo Kamili','desc-1':'Anza jioni yako na mwongozo. Huko njia ya jioni, endesha katika mitaa ya Nairobi kuelekea nyumba ya stuu - mara nyingi juu katika Westlands, Kilimani, au Lavington - maeneo yanayofahamika kwa mahali yenye bei nyingi.','desc-2':'Furahia kinywaji kama karatasi au maji ya matunda, mwonekano wa Nairobi, na muziki wa Afro-jazz au soulful wakati jiji linalocheza kuponyoka. Ni wakati mzuri kwa picha na kutembea kwa ritmu ya usiku.','desc-3':'Swalei, kuelekea mgahawa mzuri kwa ajili ya chakula cha Kenyan. Kulingana na upendeleo, jioni inaweza kuwa na chakula cha Kenyan au bifu ya moto. Kwa waajuzi, jaribu bifu mbalimbali sambamba na muziki wa Africa na mgema.','desc-4':'Fukuza kuhusu adabu ya kunywea, mabukeni, na bia za ndani (Tusker, White Cap, au bia za krafti).','desc-5':'Na mwongozo, tandika kwa uzoefu wa vilabu juu ya jiji - Westlands. Kila sehemu ina ladha tofauti. Tembelea mgahawa wa kinywaji, mahali pa muziki, na baa ya ndani.','desc-6':'Sasa jioni iko katika kasi yake, wakati wa vilabu vya Nairobi. Chaguo linajumuisha vilabu vya nguvu, muziki wa Afro-house, Amapiano, Afrobeat, Dancehall, Hip-hop. Taraj mtu tofauti, DJ mzuri, mwaliko, na safu ya mgema.','desc-7':'Baada ya mgema, kikohozi na chakula cha jioni: smokie pasua, mutura, chips masala, mahindi choma, na nyama choma. Hii ni Nairobi - nzuri, imara, na puno la ujinga wa ndani.','desc-8':'Hatimaye, dereva anakurudisha nyumbani salama. Kumalizisha jioni na picha kamili, kumbukumbu ya upendo wa Kenya, na uelewa mpya wa niaba ya mabukeni.','includes-heading':'Inajumuisha','include-1':'Mwongozo wa mabukeni','include-2':'Kinywaji cha karibu','include-3':'Kuingia vilabu','include-4':'Usalama','include-5':'Maelezo ya utamaduni','include-6':'Kusaidia picha','include-7':'Meza ya VIP','include-8':'Kupewa bia ya krafti','include-9':'Paketi ya picha','include-10':'Gari la ndani','include-11':'Usiku wa sanaa','meetpoint-heading':'Mahali pa Mkutano','meetpoint-location':'Prestige Plaza Shopping Mall','meetpoint-desc':'Tunakutana kwenye mlangoni wa ambo.','maps-link':'Fungua Google Maps','important-heading':'Taarifa Muhimu - Jua Kabla Ya Kuamua','important-1':'Uzoefu unajumuisha vilabu mbalimbali, kwa hiyo nguo nyingi na viatu vya rahat vinashauriwa.','important-2':'Waathirika wanapaswa kuwa tayari kwa jioni ndefu, uzoefu unatamatia kati ya 2:00 na 3:00 asubuhi.','important-3':'Uzoefu unajumuisha bia, kwa hiyo waathirika wanapaswa kuwa na umri wa kunywea.','booking-title':'Jaza Uzoefu Wako','ready-book':'Uma kukamatia Uzoefu wa Mabukeni ya Nairobi?','book-desc':'Jaza uzoefu wako usiotaka kusahau leo. Chagua shughuli zako, chagua tarehe na wakati, na jaza mahali paka sasa.','book-btn':'Jaza Sasa'},
      'es': {'hero-title':'Vida Nocturna de Nairobi','hero-desc':'Descubre la vibrante cultura nocturna de Nairobi - música en vivo, calles de comida y escenas locales.','activities-heading':'Nuestras Actividades Nocturnas','activity-clubhopping':'Club Hopping','activity-clubhopping-desc':'Sumérgete en la escena de clubes palpitante de Nairobi con guías locales.','activity-documentary':'Filmación Documental','activity-documentary-desc':'Captura historias y momentos auténticos con sesiones de filmación profesional.','activity-acoustic':'Música Acústica y Karaoke','activity-acoustic-desc':'Disfruta de presentaciones de música acústica en vivo y diversión de karaoke.','activity-skyscrapers':'Rascacielos de Nairobi','activity-skyscrapers-desc':'Descubre los icónicos rascacielos de Nairobi y la arquitectura moderna que ilumina la noche.','activity-stargazing':'Observación de Estrellas','activity-stargazing-desc':'Contempla el cielo nocturno y aprende sobre constelaciones en un entorno sereno.','activity-nightscape':'Panorama Nocturno de la Ciudad','activity-nightscape-desc':'Explora el paisaje urbano iluminado y lugares ocultos nocturnos.','activity-mall':'Actividades en Centros Comerciales','activity-mall-desc':'Compra, cena y disfruta del entretenimiento en los centros comerciales vibrantes de Nairobi.','activity-dinner':'Cena Buffet','activity-dinner-desc':'Disfruta de una variedad de cocinas en buffetes de cena exclusivos.','activity-cinema':'Cine y Teatro','activity-cinema-desc':'Ve las últimas películas o presentaciones de teatro en vivo.','activity-camping':'Acampada y Fogata','activity-camping-desc':'Vive una noche inolvidable bajo las estrellas con amigos alrededor de una fogata.','activity-mtaa':'Noche de Juegos de Mtaa','activity-mtaa-desc':'Compite en juegos urbanos, desafíos y competiciones sociales con la comunidad vibrante de Nairobi.','package-heading':'Paquete de Vida Nocturna de Nairobi','package-title':'Experiencia de Vida Nocturna de Nairobi','age-label':'Restricción de Edad:','age-restrict-text':'18+ (Solo Adultos)','highlights-heading':'Destacados','highlight-1':'Saborea los sabores de Kenia con una cena tradicional o asado a la parrilla','highlight-2':'Experimenta la vibrante vida nocturna de Nairobi con un recorrido de bar en bar guiado','highlight-3':'Baila toda la noche en un club con Afro-house, Amapiano y más','highlight-4':'Prueba comida callejera nocturna como smokie pasua, mutura y chips masala','description-heading':'Descripción Completa','desc-1':'Comienza tu noche con un guía profesional. Al anochecer, conduce por las bulliciosas calles de Nairobi hacia un salón azotea—a menudo en Westlands, Kilimani o Lavington—áreas famosas por sus lugares de lujo.','desc-2':'Disfruta de un cóctel gratuito o jugo fresco, vistas panorámicas del horizonte de Nairobi, y música Afro-jazz suave o soulful mientras las luces de la ciudad cobran vida. Es el momento perfecto para fotos y sumergirse en el ritmo de la noche.','desc-3':'Luego, dirígete a un restaurante de primera categoría para una experiencia culinaria keniana auténtica. Dependiendo de tu preferencia, la noche puede presentar un buffet keniano tradicional o una experiencia de parrilla al estilo carnívoro. Para aventureros, prueba una selección de carnes de caza junto con música y danza africana animada.','desc-4':'Una charla cultural presenta la etiqueta de bebida keniana, la cultura nocturna y cervezas locales populares (Tusker, White Cap o cervezas artesanales).','desc-5':'Con tu guía liderando el camino, emprende una experiencia de bar en bar en el centro nocturno más energético de Nairobi: Westlands. Cada parada ofrece un sabor diferente de la ciudad. Visita un salón de cócteles, un lugar de música en vivo y un pub social o bar deportivo.','desc-6':'Ahora que la noche está en pleno apogeo, es hora de la famosa escena de clubes de Nairobi. Las opciones incluyen clubs de alta energía conocidos por Afro-house, Amapiano, Afrobeat, Dancehall, Hip-hop y éxitos de Kenia. Espera una multitud vibrante y diversa, DJs de alta calidad, espectáculos de luz y pisos de baile animados.','desc-7':'Después de bailar, refréscat con los bocadillos nocturnos favoritos de Nairobi: smokie pasua, mutura (salchicha kenyana), chips masala, mahindi choma (maíz asado) y puestos de nyama choma. Este es Nairobi en su forma más auténtica—energético, sabroso y lleno de encanto local.','desc-8':'Finalmente, tu conductor te devuelve a tu hotel o residencia de forma segura. Termina la noche con una galería de fotos completa, recuerdos de la hospitalidad keniana inigualable, y una nueva comprensión de por qué la vida nocturna de Nairobi es legendaria.','includes-heading':'Incluye','include-1':'Guía profesional de vida nocturna','include-2':'Bebida de bienvenida','include-3':'Entrada a bares y clubs','include-4':'Supervisión de seguridad','include-5':'Explicaciones culturales','include-6':'Asistencia fotográfica','include-7':'Mesa VIP en clubs','include-8':'Degustación de cerveza artesanal','include-9':'Paquete de fotografía personalizado','include-10':'Vehículos privados de grupo','include-11':'Noches de presentaciones de celebridades','meetpoint-heading':'Punto de Encuentro','meetpoint-location':'Prestige Plaza Shopping Mall','meetpoint-desc':'Nos reunimos en la entrada de la puerta principal.','maps-link':'Abre Google Maps','important-heading':'Información Importante - Sepa Antes de Ir','important-1':'El recorrido implica visitar varios lugares nocturnos, por lo que se recomienda ropa cómoda y zapatos.','important-2':'Los participantes deben estar preparados para una noche tardía, ya que el recorrido termina entre las 2:00 y las 3:00 AM.','important-3':'El recorrido incluye bebidas alcohólicas, por lo que los participantes deben ser mayores de edad legal para beber.','booking-title':'Reserva Tu Aventura','ready-book':'¿Listo para Experimentar la Vida Nocturna de Nairobi?','book-desc':'Reserva tu aventura inolvidable hoy. Elige tus actividades, selecciona tu fecha y hora, y reserva tu lugar ahora.','book-btn':'Reservar Ahora'}
    };

    // Expose translatePage globally if not present (nightlife defines its own fuller version)
    if (typeof window.translatePage !== 'function') {
      window.translatePage = function(lang){
        const trans = translations[lang] || translations['en'];
        Object.keys(trans).forEach(key => {
          const el = document.querySelector(`[data-i18n="${key}"]`);
          if (!el) return;
          if (el.children.length > 0) {
            // preserve inline children (icons), update trailing text node
            let lastNode = el.childNodes[el.childNodes.length-1];
            if (lastNode && lastNode.nodeType === Node.TEXT_NODE) lastNode.textContent = ' ' + trans[key];
            else el.appendChild(document.createTextNode(' ' + trans[key]));
          } else {
            el.textContent = trans[key];
          }
        });
      };
    }

    // Global updatePrices helper (uses data-base-price or fallback basePrice)
    if (typeof window.updatePrices !== 'function') {
      window.updatePrices = function(){
        const code = window.currentCurrency || 'USD';
        const rate = (window.exchangeRates && window.exchangeRates[code]) || 1;
        // Update any element with class price-display and optional data-base-price
        document.querySelectorAll('.price-display').forEach(el => {
          if (el.classList.contains('no-currency')) {
            // keep card package base pricing fixed (e.g., KES 1,150)
            return;
          }
          const base = parseFloat(el.getAttribute('data-base-price')) || 1150;
          const amount = (base * rate).toFixed(2);
          el.textContent = (window.currencySymbols && window.currencySymbols[code] ? window.currencySymbols[code] : '') + amount;
        });
      };
    }

    // Inject clock and date picker into header utilities
    // (function injectClockAndCalendar(){
    //   const utilities = document.querySelector('.nav-utilities');
    //   if(!utilities) return;

    //   // Clock
    //   const clock = document.createElement('div');
    //   clock.id = 'site-clock';
    //   clock.className = 'site-clock';
    //   clock.setAttribute('aria-live','polite');
    //   clock.style.display = 'inline-block';
    //   clock.style.margin = '0 .5rem';
    //   clock.style.fontVariantNumeric = 'tabular-nums';
    //   utilities.insertBefore(clock, utilities.firstChild);

    //   // Calendar (date input)
    //   const cal = document.createElement('input');
    //   cal.type = 'date';
    //   cal.id = 'site-calendar';
    //   cal.className = 'site-calendar';
    //   cal.style.marginLeft = '.25rem';
    //   cal.title = 'Select date';
    //   utilities.insertBefore(cal, utilities.firstChild.nextSibling);

    //   function updateClock(){
    //     const now = new Date();
    //     const hh = String(now.getHours()).padStart(2,'0');
    //     const mm = String(now.getMinutes()).padStart(2,'0');
    //     const ss = String(now.getSeconds()).padStart(2,'0');
    //     clock.textContent = hh + ':' + mm + ':' + ss;
    //   }
    //   updateClock();
    //   setInterval(updateClock, 1000);
    // })();

    // Attempt to detect visitor locale & apply preferences (site-wide)
    if (typeof window.detectAndApplyLocale !== 'function') {
      window.detectAndApplyLocale = function(){
        try {
          const navLocale = (navigator.languages && navigator.languages[0]) || navigator.language || 'en-US';
          const parts = navLocale.split('-');
          const langPart = parts[0] ? parts[0].toLowerCase() : 'en';
          const regionPart = parts[1] ? parts[1].toUpperCase() : null;
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
          const timezoneToCountry = {'Africa/Nairobi':'KE','Europe/Paris':'FR','Europe/Madrid':'ES','Europe/London':'GB','Asia/Kolkata':'IN','Asia/Tokyo':'JP','Asia/Dubai':'AE','Africa/Johannesburg':'ZA','America/New_York':'US','America/Los_Angeles':'US'};
          const region = regionPart || timezoneToCountry[tz] || null;
          const countryToCurrency = {'KE':'KSH','US':'USD','GB':'GBP','FR':'EUR','ES':'EUR','IN':'INR','JP':'JPY','AE':'AED','ZA':'ZAR'};

          let detectedLang = 'en';
          if (langPart === 'sw' || region === 'KE') detectedLang = 'sw';
          else if (langPart === 'es' || region === 'ES') detectedLang = 'es';
          else if (langPart === 'fr' || region === 'FR') detectedLang = 'fr';

          let detectedCurrency = 'USD';
          if (region && countryToCurrency[region]) detectedCurrency = countryToCurrency[region];

          window.setLanguage(detectedLang);
          window.setCurrency(detectedCurrency, window.currencySymbols[detectedCurrency]);
        } catch (e) { window.setLanguage('en'); window.setCurrency('USD', window.currencySymbols['USD']); }
      };
    }

    // Apply locale preferences and initial UI updates
    try { window.detectAndApplyLocale(); } catch (e) {}
    try { window.updatePrices(); } catch (e) {}
    try { window.translatePage(window.currentLanguage || 'en'); } catch (e) {}
  })();

  // Hero background slideshow (Ken Burns continues on each image) - legacy fallback
  (function heroSlideshow(){
    const hero = document.querySelector('.hero');
    if(!hero) return;
    // Skip the homepage slideshow for smaller hero variants (e.g., dedicated pages)
    if (hero.classList.contains('hero-sm')) return;
    const images = [
      './files/download.jpg',
      './files/image%2030.jpg',
      './files/image%2026.jpg'
    ].map(u=>u.replace(/ /g, '%20'));
    let idx = 0;
    // set initial if not set
    if(!hero.style.backgroundImage) {
      hero.style.backgroundImage = `linear-gradient(180deg, rgba(139,94,52,0.24), rgba(194,123,57,0.12)), url('${images[0]}')`;
    }
    const interval = 8000;
    setInterval(()=>{
      idx = (idx + 1) % images.length;
      // fade out, swap, fade in
      hero.style.transition = 'opacity .7s ease';
      hero.style.opacity = '0';
      setTimeout(()=>{
        hero.style.backgroundImage = `linear-gradient(180deg, rgba(139,94,52,0.24), rgba(194,123,57,0.12)), url('${images[idx]}')`;
        // ensure kenburns pseudo-element uses new background-image (it's inherited)
        hero.style.opacity = '1';
      }, 720);
    }, interval);
  })();

  // Global language / currency / login handlers (works across all pages)
  (function globalUtilityHandlers(){
    window.currentLanguage = window.currentLanguage || 'en';
    window.currentCurrency = window.currentCurrency || 'USD';

    window.exchangeRates = window.exchangeRates || {
      'USD': 1,
      'EUR': 0.92,
      'GBP': 0.80,
      'JPY': 150,
      'INR': 84,
      'AED': 3.67,
      'ZAR': 18.50,
      'KSH': 131
    };
    window.currencySymbols = window.currencySymbols || {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'INR': '₹', 'AED': 'د.إ', 'ZAR': 'R', 'KSH': 'Ksh'
    };

    window.setCurrency = function(code, symbol, evt){
      const upperCode = (code || 'USD').toUpperCase();
      window.currentCurrency = upperCode;
      const btn = document.getElementById('currencyBtn');
      if(btn) btn.title = upperCode;

      if (typeof window.currency !== 'undefined' && typeof window.currency.set === 'function') {
        window.currency.set(upperCode);
      } else {
        if(typeof window.updatePrices === 'function') {
          window.updatePrices();
        } else {
          // fallback for legacy elements
          const rate = (window.exchangeRates && window.exchangeRates[upperCode]) || 1;
          document.querySelectorAll('[data-base-price]').forEach(el => {
            const base = parseFloat(el.getAttribute('data-base-price')) || 0;
            el.textContent = (window.currencySymbols[upperCode] || '') + (base * rate).toFixed(2);
          });
        }
      }

      if(evt && evt.target) {
        const dd = evt.target.closest('.utility-dropdown'); if(dd) closeAllDropdowns();
      }
    };

    // Language setting is handled by language.js with Google Translate widget
    // Do not override window.setLanguage here to avoid conflicts

    window.openLoginModal = function(){
      // simple shared behaviour
      alert('Login / Sign Up feature coming soon.');
    };

    function closeAllDropdowns(){
      document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('active'));
    }

    // Use delegated click handling so controls work even if listeners are attached late
    document.addEventListener('click', function(e){
      // Language button
      const langBtn = e.target.closest('.utility-btn.language-btn');
      if (langBtn) {
        e.stopPropagation();
        const menu = langBtn.closest('.utility-dropdown').querySelector('.dropdown-menu');
        closeAllDropdowns();
        if (menu) menu.classList.toggle('active');
        return;
      }

      // Currency button
      const curBtn = e.target.closest('.utility-btn.currency-btn');
      if (curBtn) {
        e.stopPropagation();
        const menu = curBtn.closest('.utility-dropdown').querySelector('.dropdown-menu');
        closeAllDropdowns();
        if (menu) menu.classList.toggle('active');
        return;
      }

      // Theme toggle (supports clicks on the button or inner elements)
      const themeBtn = e.target.closest('.theme-toggle');
      if (themeBtn) {
        e.stopPropagation();
        // reuse existing applyTheme logic if available
        try {
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          if (typeof window.applyTheme === 'function') {
            window.applyTheme(isDark ? 'light' : 'dark');
          } else {
            if (isDark) document.documentElement.removeAttribute('data-theme');
            else document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('site-theme', isDark ? 'light' : 'dark');
          }
          // update symbol if present
          themeBtn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '●' : '☼';
        } catch (err) {
          // no-op
        }
        return;
      }

      // Click outside any utility dropdown — close menus
      if (!e.target.closest('.utility-dropdown')) closeAllDropdowns();
    });
  })();
}

// ensure initialization happens even if script loads after DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUx);
} else {
  initializeUx();
}


