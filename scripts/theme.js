document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'upa_theme';
  function apply(theme){ if(theme==='dark') document.documentElement.setAttribute('data-theme','dark'); else document.documentElement.removeAttribute('data-theme'); localStorage.setItem(KEY, theme); updateIcon(); }
  function updateIcon(){ const btn = document.querySelector('.theme-toggle'); if(!btn) return; btn.textContent = document.documentElement.getAttribute('data-theme')==='dark' ? '●' : '☼'; }
  function init(){ const saved = localStorage.getItem(KEY); if(saved) apply(saved); else { if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) apply('dark'); else apply('light'); } document.querySelectorAll('.theme-toggle').forEach(b => b.addEventListener('click', (e)=>{ e.preventDefault(); const isDark = document.documentElement.getAttribute('data-theme')==='dark'; apply(isDark ? 'light' : 'dark'); })); updateIcon(); }
  window.theme = { apply, init };
  init();
});