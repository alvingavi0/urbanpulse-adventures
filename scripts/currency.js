document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'upa_currency';
  const RATES = {
    // rate: 1 KES -> X currency
    'USD': 0.0065,'EUR':0.0059,'JPY':0.91,'GBP':0.0047,'AUD':0.0097,'CAD':0.0086,'CHF':0.0060,'CNY':0.046,'HKD':0.051,'NZD':0.010,'KES':1,'ZAR':0.11,'EGP':0.20,'NGN':3.18,'MAD':0.061,'TND':0.019,'GHS':0.056,'BWP':0.079,'DZD':0.91
  };

  function format(value, code){ try{ return new Intl.NumberFormat(undefined, { style:'currency', currency: code, maximumFractionDigits:2 }).format(value); }catch(e){ return (code||'')+' '+value.toFixed(2); } }

  function get(){ return localStorage.getItem(KEY) || null; }
  function set(code){ localStorage.setItem(KEY, code); updateAll(code); const btn = document.getElementById('currencyBtn'); if(btn) btn.title = code; }

  function detectDefault(){ try{ const lang=(navigator.language||'en').toLowerCase(); if(lang.includes('ke')||lang.includes('sw')) return 'KES'; if(lang.includes('en-us')||lang.includes('us')) return 'USD'; if(lang.includes('en-gb')||lang.includes('gb')) return 'GBP'; if(lang.includes('fr')||lang.includes('de')||lang.includes('es')) return 'EUR'; if(lang.includes('za')) return 'ZAR'; if(lang.includes('ng')) return 'NGN'; }catch(e){} return 'USD'; }

  function updateAll(override){ const code = override || get() || detectDefault(); document.querySelectorAll('[data-price],[data-base-price]').forEach(el => { if(el.classList.contains('no-currency')) return; const baseAttr = el.getAttribute('data-price') || el.getAttribute('data-base-price'); const baseKES = parseFloat(baseAttr) || 0; const rate = RATES[code] || 1; const v = baseKES * rate; el.textContent = format(v, code); }); }

  // expose
  window.currency = { get, set, updateAll, RATES };

  console.log('[CUR] currency module loaded');
  // wire dropdown items (data-currency attributes)
  document.querySelectorAll('.dropdown-menu.currency-menu .dropdown-item').forEach(btn => {
    btn.addEventListener('click', function(e){ 
      const code = this.getAttribute('data-currency') || this.textContent.trim().split(' ').pop();
      console.log('[CUR] clicked item', this.textContent.trim(), 'resolved to', code);
      set(code);
      // close menu after changing
      const dd = this.closest('.utility-dropdown');
      if(dd){ const menu = dd.querySelector('.dropdown-menu'); if(menu) menu.classList.remove('active'); }
    });
  });

  // initial run
  updateAll();
});