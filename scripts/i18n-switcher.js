// Language Switcher using i18next
// Replaces Google Translate with i18next-based translations

document.addEventListener('DOMContentLoaded', () => {
  console.log('[i18n-switcher] Language switcher module loaded');

  // Get current language from localStorage or default to 'en'
  const currentLang = localStorage.getItem('upa_language') || 'en';
  
  // Initialize language badge
  updateLanguageBadge(currentLang);

  // Hook into language dropdown items
  document.querySelectorAll('.dropdown-menu.language-menu .dropdown-item').forEach(btn => {
    const text = btn.textContent.trim().toLowerCase();
    
    // Map display text to language codes
    let langCode = 'en'; // default
    if (text.includes('swahili') || text.includes('sw')) langCode = 'sw';
    else if (text.includes('español') || text.includes('es')) langCode = 'es';
    else if (text.includes('français') || text.includes('fr')) langCode = 'fr';
    
    btn.setAttribute('data-lang', langCode);
    
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const code = this.getAttribute('data-lang');
      console.log('[i18n-switcher] Language item clicked:', text, '-> code:', code);
      
      // Only switch to supported languages (en, sw for now)
      if (code === 'en' || code === 'sw') {
        switchLanguage(code);
      } else {
        console.warn('[i18n-switcher] Language not supported:', code);
      }
      
      // Close dropdown
      const dropdown = this.closest('.utility-dropdown');
      if (dropdown) {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) menu.classList.remove('active');
      }
    });
  });

  // Function to switch language
  function switchLanguage(langCode) {
    if (!window.i18next) {
      console.warn('[i18n-switcher] i18next not available, cannot switch language');
      return;
    }
    
    i18next.changeLanguage(langCode, (err, t) => {
      if (err) {
        console.error('[i18n-switcher] Error changing language:', err);
        return;
      }
      console.log('[i18n-switcher] Language switched to:', langCode);
      updateLanguageBadge(langCode);
    });
  }

  // Expose globally
  window.switchLanguage = switchLanguage;
});

// Update the language badge (EN, SW, etc.)
function updateLanguageBadge(langCode) {
  const langBtn = document.querySelector('.utility-btn.language-btn');
  if (!langBtn) return;

  const code = (langCode || 'en').toUpperCase();
  let badge = langBtn.querySelector('.lang-badge');
  
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'lang-badge';
    badge.style.position = 'absolute';
    badge.style.top = '-6px';
    badge.style.right = '-6px';
    badge.style.fontSize = '0.6rem';
    badge.style.fontWeight = '700';
    badge.style.padding = '.1rem .25rem';
    badge.style.borderRadius = '4px';
    badge.style.backgroundColor = 'var(--accent-2)';
    badge.style.color = 'white';
    badge.style.lineHeight = '1';
    badge.style.minWidth = '20px';
    badge.style.textAlign = 'center';
    langBtn.style.position = 'relative';
    langBtn.appendChild(badge);
  }
  
  badge.textContent = code;
  langBtn.title = 'Language: ' + code;
  console.log('[i18n-switcher] Language badge updated to:', code);
}
