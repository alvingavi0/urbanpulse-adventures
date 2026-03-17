document.addEventListener('DOMContentLoaded', () => {
  async function detectRegion(){
    // Try navigator and Intl first
    try{
      const nav = navigator.language || (navigator.languages && navigator.languages[0]) || 'en-US';
      const parts = nav.split('-'); if(parts[1]) return parts[1].toUpperCase();
    }catch(e){}
    // Fallback to IP geolocation (best-effort)
    try{
      const res = await fetch('https://ipapi.co/json/');
      if(res.ok){ const j = await res.json(); if(j && j.country_code) return j.country_code.toUpperCase(); }
    }catch(e){}
    return 'US';
  }

  window.geo = { detectRegion };
});