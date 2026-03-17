document.addEventListener('DOMContentLoaded', () => {
  // Ensure consistent IDs on nav buttons if missing
  document.querySelectorAll('.login-btn').forEach(b => { if(!b.id) b.id = 'loginBtn'; });
  document.querySelectorAll('.language-btn').forEach(b => { if(!b.id) b.id = 'languageBtn'; });
  document.querySelectorAll('.currency-btn').forEach(b => { if(!b.id) b.id = 'currencyBtn'; });
  document.querySelectorAll('.theme-toggle').forEach(b => { if(!b.id) b.id = 'themeToggle'; });

  // Close dropdowns on outside click
  document.addEventListener('click', function(e){ if(!e.target.closest('.utility-dropdown')) document.querySelectorAll('.dropdown-menu').forEach(m=>m.classList.remove('active')); });

  // Wire dropdown button toggles
  document.querySelectorAll('.utility-dropdown .utility-btn').forEach(btn => {
    btn.addEventListener('click', function(e){ e.stopPropagation(); const menu = this.closest('.utility-dropdown').querySelector('.dropdown-menu'); if(!menu) return; document.querySelectorAll('.dropdown-menu').forEach(m=>{ if(m!==menu) m.classList.remove('active'); }); menu.classList.toggle('active'); });
  });

  // If language or currency items lack data attributes try to set them sensibly
  document.querySelectorAll('.dropdown-menu.language-menu .dropdown-item').forEach(btn => { if(!btn.hasAttribute('data-lang')){ const txt=btn.textContent.trim().toLowerCase(); const map={'english':'en','swahili':'sw','español':'es','français':'fr','hindi':'hi','mandarin':'zh-CN','arabic':'ar','bengali':'bn','portuguese':'pt','russian':'ru','indonesian':'id','deutsch':'de'}; for(const k in map){ if(txt.includes(k)) { btn.setAttribute('data-lang', map[k]); break; } } } });

  document.querySelectorAll('.dropdown-menu.currency-menu .dropdown-item').forEach(btn => { if(!btn.hasAttribute('data-currency')){ const txt = btn.textContent.trim().split(' ').pop(); btn.setAttribute('data-currency', txt.replace(/[^A-Z]/g,'')); } });

  // If Google widget hasn't been injected yet, language.js will handle it.

  // BOOKINGS: open floating booking card when nav link clicked
  function ensureBookingModal(){ if(document.getElementById('upa-booking-modal')) return; const m=document.createElement('div'); m.id='upa-booking-modal'; m.innerHTML=`
  <div class="upa-modal-overlay" style="position:fixed;inset:0;display:none;align-items:center;justify-content:center;z-index:12000;background:rgba(0,0,0,.5)">
    <div class="upa-modal-card" role="dialog" aria-modal="true">
      <div class="upa-modal-header">
        <h2 class="upa-modal-title">Book Your Adventure</h2>
        <button id="upa-booking-close" class="upa-modal-close" aria-label="Close booking">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      
      <div id="upa-booking-content">
        <div id="upa-packages-view" class="upa-view-section">
          <div class="upa-section-label">Step 1: Select Your Experience</div>
          <div class="packages-list">
            <div class="package-group">
              <div class="package-group-title">🏙️ Urban</div>
              <div class="package-item"><span>Kibera Street Vibes</span><button class="btn btn-primary btn-sm select-tour" data-tour="Kibera Street Vibes">Select</button></div>
            </div>
            <div class="package-group">
              <div class="package-group-title">🌙 Classic</div>
              <div class="package-item"><span>Nairobi Nightlife</span><button class="btn btn-primary btn-sm select-tour" data-tour="Nairobi Nightlife">Select</button></div>
            </div>
            <div class="package-group">
              <div class="package-group-title">📸 Creative Modern</div>
              <div class="package-item"><span>Lens & Legends</span><button class="btn btn-primary btn-sm select-tour" data-tour="Lens & Legends">Select</button></div>
            </div>
            <div class="package-group package-group-standalone">
              <div class="package-group-title">🏡 Standalone Package</div>
              <div class="package-item"><span>UrbanStay Sanctuary</span><button class="btn btn-secondary btn-sm select-tour" data-tour="UrbanStay Sanctuary">Select</button></div>
            </div>
          </div>
        </div>

        <form id="upa-booking-form" class="upa-booking-form" style="display:none;">
          <input name="tour" type="hidden" />
          
          <div class="upa-form-section">
            <div class="upa-section-label">Step 2: Your Details</div>
            <div class="form-group">
              <label for="upa-name" class="form-label">Full Name</label>
              <input id="upa-name" name="name" class="form-input" placeholder="John Doe" required />
            </div>
            <div class="form-group">
              <label for="upa-email" class="form-label">Email Address</label>
              <input id="upa-email" name="email" type="email" class="form-input" placeholder="you@example.com" required />
            </div>
          </div>

          <div class="upa-form-section">
            <div class="upa-section-label">Step 3: Schedule Your Visit</div>
            <div class="booking-datetime-row">
              <div class="form-group">
                <label for="upa-date" class="form-label">Select Date</label>
                <input id="upa-date" name="date" type="date" class="form-input form-date" required />
              </div>
              <div class="form-group">
                <label for="upa-time" class="form-label">Select Time</label>
                <input id="upa-time" name="time" type="text" class="form-input form-time" placeholder="2:30 PM" pattern="[0-9]{1,2}:[0-9]{2} (AM|PM|am|pm)" required />
              </div>
            </div>
          </div>

          <div class="upa-form-section upa-consent-section">
            <label class="consent-checkbox-wrapper">
              <input type="checkbox" name="consent" id="upa-consent" class="consent-checkbox" />
              <span class="checkbox-custom"></span>
              <span class="consent-text">
                I have read and agree to the <a href="terms.html" target="_blank" class="terms-link">Terms & Conditions</a>
              </span>
            </label>
            <p class="consent-helper-text">Please review our terms before confirming your booking</p>
          </div>

          <div class="upa-form-actions">
            <button class="btn btn-secondary" type="button" id="upa-form-back">Back</button>
            <button class="btn btn-primary" type="submit" disabled>Confirm Booking</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `; document.body.appendChild(m);
    const overlay = m.querySelector('.upa-modal-overlay');
    m.querySelector('#upa-booking-close').addEventListener('click', ()=> { overlay.style.display='none'; document.querySelector('#upa-booking-form').style.display='none'; document.querySelector('#upa-packages-view').style.display='block'; });
    
    m.querySelectorAll('.select-tour').forEach(btn=>btn.addEventListener('click', function(){ 
      const tour=this.dataset.tour; 
      const form=m.querySelector('#upa-booking-form'); 
      form.style.display='block'; 
      form.tour.value=tour; 
      form.querySelector('button[type="submit"]').disabled = !form.consent.checked;
      document.querySelector('#upa-packages-view').style.display='none';
    }));
    
    const form = m.querySelector('#upa-booking-form');
    const consent = form.querySelector('input[name="consent"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const backBtn = form.querySelector('#upa-form-back');
    
    consent.addEventListener('change', function(){ submitBtn.disabled = !this.checked; });
    
    backBtn.addEventListener('click', function(){ 
      document.querySelector('#upa-packages-view').style.display='block'; 
      form.style.display='none'; 
      form.reset(); 
      submitBtn.disabled = true; 
    });
    
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!this.consent.checked){
        alert('Please agree to the Terms & Conditions before submitting your booking.');
        return;
      }
      alert('Booking submitted for '+this.tour.value);
      this.reset();
      this.style.display='none';
      document.querySelector('#upa-packages-view').style.display='block';
      submitBtn.disabled = true;
      overlay.style.display='none';
    });
  }

  document.querySelectorAll('a[data-action="open-booking"]').forEach(a=>{
    a.addEventListener('click', function(e){ e.preventDefault(); ensureBookingModal(); document.querySelector('#upa-booking-modal .upa-modal-overlay').style.display='flex'; });
  });
});