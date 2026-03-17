// Simple HTTP backend for i18next
// Loads translation JSON files from the locales folder

// Register the HTTP backend directly
i18next.use({
  type: 'backend',
  init: function(services, backendOptions, i18nextOptions) {},
  read: function(language, namespace, callback) {
    // Load translation file
    const url = `./locales/${language}.json`;
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load: ${url}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('[i18n-backend] Loaded translations for:', language);
        callback(null, data);
      })
      .catch(err => {
        console.error('[i18n-backend] Error loading translations:', err);
        callback(err);
      });
  }
});
