// i18next initialization script
// Initializes i18next with English and Swahili translations

(function initializeI18next() {
  // Check if i18next is available
  if (!window.i18next) {
    console.error('[i18n] i18next not loaded yet');
    return;
  }

  // Get stored language or default to 'en'
  const storedLanguage = localStorage.getItem('upa_language') || 'en';

  // Initialize i18next with inline resources (translations loaded from JSON files)
  i18next.init(
    {
      lng: storedLanguage,
      fallbackLng: 'en',
      ns: 'translation',
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false // React already handles XSS
      }
    },
    function (err, t) {
      if (err) {
        console.error('[i18n] Error initializing i18next:', err);
        return;
      }
      console.log('[i18n] i18next initialized with language:', storedLanguage);
      
      // Run translation of page content
      translatePageContent();
      
      // Listen for language changes
      i18next.on('languageChanged', function(lng) {
        console.log('[i18n] Language changed to:', lng);
        localStorage.setItem('upa_language', lng);
        translatePageContent();
        updateLanguageBadge(lng);
      });
    }
  );

  // Function to translate page content using data-key attributes
  function translatePageContent() {
    const translatableElements = document.querySelectorAll('[data-key]');
    
    translatableElements.forEach(el => {
      const key = el.getAttribute('data-key');
      const translation = i18next.t(key);
      
      // For elements with children (like buttons with icons), update only text nodes
      if (el.children.length > 0) {
        // Preserve child elements, update text content
        let textNode = null;
        for (let node of el.childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            textNode = node;
            break;
          }
        }
        if (textNode) {
          textNode.textContent = translation;
        } else {
          el.appendChild(document.createTextNode(translation));
        }
      } else {
        el.textContent = translation;
      }
    });
    
    console.log('[i18n] Page content translated');
  }

  // Expose globally so language switcher can use it
  window.i18nTranslate = translatePageContent;
  window.getCurrentLanguage = function() {
    return i18next.language;
  };

})();
