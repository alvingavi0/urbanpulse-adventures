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
  <div class="upa-modal-overlay" style="position:fixed;inset:0;display:none;align-items:center;justify-content:center;z-index:12000;background:rgba(0,0,0,.45)">
    <div class="upa-modal-card" role="dialog" aria-modal="true" style="width:480px;max-width:92%;background:var(--bg);color:var(--text);border-radius:10px;padding:1rem;box-shadow:0 20px 60px rgba(0,0,0,.35);max-height:90%;overflow:auto;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem"><h3 style="margin:0">Book Your Adventure</h3><button id="upa-booking-close" class="btn">✕</button></div>
      <div id="upa-booking-content">
        <div style="margin-bottom:.8rem; display:flex; justify-content:flex-end;"><button id="upa-view-terms" class="btn btn-ghost" type="button">View Terms & Conditions</button></div>
        <div class="packages-list">
          <div class="package-group">
            <div class="package-group-title">Urban</div>
            <div class="package-item"><span>Kibera Street Vibes</span><button class="btn btn-primary btn-sm select-tour" data-tour="Kibera Street Vibes">Select</button></div>
          </div>
          <div class="package-group">
            <div class="package-group-title">Classic</div>
            <div class="package-item"><span>Nairobi Nightlife</span><button class="btn btn-primary btn-sm select-tour" data-tour="Nairobi Nightlife">Select</button></div>
          </div>
          <div class="package-group">
            <div class="package-group-title">Creative Modern</div>
            <div class="package-item"><span>Lens & Legends</span><button class="btn btn-primary btn-sm select-tour" data-tour="Lens & Legends">Select</button></div>
          </div>
          <div class="package-group package-group-standalone">
            <div class="package-group-title">Standalone Package</div>
            <div class="package-item"><span>UrbanStay Sanctuary</span><button class="btn btn-secondary btn-sm select-tour" data-tour="UrbanStay Sanctuary">Select</button></div>
          </div>
        </div>
        <form id="upa-booking-form" class="form" style="display:none;">
          <input name="name" class="form-input" placeholder="Your Name" required style="width:100%;margin-bottom:.5rem;padding:.5rem" />
          <input name="email" type="email" class="form-input" placeholder="Your Email" required style="width:100%;margin-bottom:.5rem;padding:.5rem" />
          <input name="tour" type="hidden" />
          <div class="form-field" style="margin-bottom:.65rem;">
            <label style="font-weight:600;margin-bottom:.3rem;">Terms & Consent</label>
            <div style="display:flex;align-items:center;gap:.5rem;font-size:.85rem;color:var(--muted);">
              <input type="checkbox" name="consent" id="upa-consent" />
              <label for="upa-consent">I have read and agree to the <a href="terms.html" target="_blank">Terms & Conditions</a>.</label>
            </div>
          </div>
          <div class="booking-datetime-row">
            <div class="form-field"><label>Select Date</label><input name="date" type="date" class="form-input form-date" required></div>
            <div class="form-field"><label>Select Time</label><input name="time" type="text" class="form-input form-time" placeholder="e.g. 2:30 PM" pattern="[0-9]{1,2}:[0-9]{2} (AM|PM|am|pm)" required></div>
          </div>
          <div style="display:flex;gap:.5rem;justify-content:flex-end"><button class="btn btn-primary" type="submit" disabled>Submit Booking</button></div>
        </form>
      </div>
    </div>
  </div>
  `; document.body.appendChild(m);
    const overlay = m.querySelector('.upa-modal-overlay');
    m.querySelector('#upa-booking-close').addEventListener('click', ()=> overlay.style.display='none');
    m.querySelector('#upa-view-terms').addEventListener('click', ()=> window.open('terms.html', '_blank'));
    m.querySelectorAll('.select-tour').forEach(btn=>btn.addEventListener('click', function(){ const tour=this.dataset.tour; const form=m.querySelector('#upa-booking-form'); form.style.display='block'; form.tour.value=tour; form.querySelector('button[type="submit"]').disabled = !form.consent.checked; }));
    const form = m.querySelector('#upa-booking-form');
    const consent = form.querySelector('input[name="consent"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    consent.addEventListener('change', function(){ submitBtn.disabled = !this.checked; });
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!this.consent.checked){
        alert('Please agree to the Terms & Conditions before submitting your booking.');
        return;
      }
      alert('Booking submitted for '+this.tour.value);
      this.reset();
      this.style.display='none';
      submitBtn.disabled = true;
      overlay.style.display='none';
    });
  }

  document.querySelectorAll('a[data-action="open-booking"]').forEach(a=>{
    a.addEventListener('click', function(e){ e.preventDefault(); ensureBookingModal(); document.querySelector('#upa-booking-modal .upa-modal-overlay').style.display='flex'; });
  });
});