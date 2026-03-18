document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'upa_currency';
  const BASE_CURRENCY = 'USD';
  const API_URL = 'https://open.er-api.com/v6/latest/USD';
  const FALLBACK_RATES = {
    'USD': 1, 'EUR': 0.92, 'JPY': 149.38, 'GBP': 0.79, 'AUD': 1.55, 'CAD': 1.39, 'CHF': 0.91, 'CNY': 7.22, 'HKD': 7.81, 'NZD': 1.66, 'KES': 159.0, 'KSH': 159.0, 'ZAR': 18.48, 'EGP': 55.24, 'NGN': 1487.5, 'MAD': 10.01, 'TND': 3.10, 'GHS': 14.80, 'BWP': 13.64, 'DZD': 138.24
  };
  let liveRates = Object.assign({}, FALLBACK_RATES);

  function format(value, code){
    try{
      if(code === 'KES'){
        return new Intl.NumberFormat('en-KE', { style:'currency', currency:'KES', maximumFractionDigits:0 }).format(value);
      }
      return new Intl.NumberFormat(undefined, { style:'currency', currency: code, maximumFractionDigits:2 }).format(value);
    }catch(e){
      return (code || '') + ' ' + value.toFixed(2);
    }
  }

  const CURRENCY_ALIAS = {
    'KSH': 'KES',
    'RMB': 'CNY',
    'CNH': 'CNY'
  };

  function normalizeCurrency(code){
    if(!code) return BASE_CURRENCY;
    const upper = code.toUpperCase();
    return CURRENCY_ALIAS[upper] || upper;
  }

  function get(){ return localStorage.getItem(KEY) || null; }
  function set(code){
    const normalized = normalizeCurrency(code);
    localStorage.setItem(KEY, normalized);
    updateAll(normalized);
    const btn = document.getElementById('currencyBtn');
    if(btn) btn.title = normalized;
  }

  async function loadRates(){
    try{
      const resp = await fetch(API_URL, {cache:'no-cache'});
      if(!resp.ok) throw new Error('Rate API non-200');
      const data = await resp.json();
      if(data && data.result === 'success' && data.rates){
        liveRates = Object.assign({}, FALLBACK_RATES, data.rates);
        if (data.rates['KES'] && !data.rates['KSH']) {
          liveRates['KSH'] = data.rates['KES'];
        }
        console.log('[CUR] live rates loaded', liveRates);
      }
    }catch(err){
      console.warn('[CUR] live rate load failed, using backup rates', err);
      liveRates = Object.assign({}, FALLBACK_RATES);
    }
  }

  function detectDefault(){ try{ const lang=(navigator.language||'en').toLowerCase(); if(lang.includes('ke')||lang.includes('sw')) return 'KES'; if(lang.includes('en-us')||lang.includes('us')) return 'USD'; if(lang.includes('en-gb')||lang.includes('gb')) return 'GBP'; if(lang.includes('fr')||lang.includes('de')||lang.includes('es')) return 'EUR'; if(lang.includes('za')) return 'ZAR'; if(lang.includes('ng')) return 'NGN'; }catch(e){} return 'USD'; }

  async function updateAll(override){
    const code = normalizeCurrency((override || get() || detectDefault()));
    await loadRates();
    document.querySelectorAll('[data-usd],[data-base-price],[data-price]').forEach(el => {
      if(el.classList.contains('no-currency')) return;

      let baseUSD = null;
      if(el.hasAttribute('data-usd')){
        baseUSD = parseFloat(el.getAttribute('data-usd')) || 0;
      } else if(el.hasAttribute('data-base-price')){
        const amtKES = parseFloat(el.getAttribute('data-base-price')) || 0;
        const rateKES = parseFloat(liveRates['KES'] || FALLBACK_RATES['KES'] || 1);
        baseUSD = rateKES ? (amtKES / rateKES) : amtKES;
      } else if(el.hasAttribute('data-price')){
        const amount = parseFloat(el.getAttribute('data-price')) || 0;
        // interpret as KES for backward compatibility
        const rateKES = parseFloat(liveRates['KES'] || FALLBACK_RATES['KES'] || 1);
        baseUSD = rateKES ? (amount / rateKES) : amount;
      } else {
        baseUSD = 0;
      }

      const targetRate = (code === BASE_CURRENCY ? 1 : (parseFloat(liveRates[code]) || parseFloat(FALLBACK_RATES[code]) || 1));
      const value = baseUSD * targetRate;
      el.textContent = format(value, code);

      // keep original fields for reliable future conversion
      if (baseUSD >= 0) {
        el.setAttribute('data-usd', baseUSD.toFixed(2));
      }
    });
  }

  // expose
  window.currency = { get, set, updateAll, loadRates, liveRates, FALLBACK_RATES };

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
  (async function(){ await updateAll(); })();
});