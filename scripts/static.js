// enhanced client-side interactions: nav toggle, booking, and reveal animations
document.addEventListener('DOMContentLoaded', function(){
  const year = new Date().getFullYear();
  const y = document.getElementById('year');
  const y2 = document.getElementById('year2');
  if(y) y.textContent = year;
  if(y2) y2.textContent = year;

  // booking form
  const form = document.getElementById('bookingForm');
  const msg = document.getElementById('bookingMsg');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const fm = new FormData(form);
      const name = fm.get('name');
      const tour = fm.get('tour');
      const date = fm.get('date');
      const time = fm.get('time');
      msg.textContent = `Thanks ${name || 'friend'} — your request for "${tour}" on ${date} at ${time} was received! We'll contact you via email.`;
      msg.classList.add('muted');
      form.reset();
    });
  }

  // mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('mainNav');
  if(navToggle && mainNav){
    navToggle.addEventListener('click', function(){
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('open');
      mainNav.setAttribute('aria-hidden', String(expanded));
    });
  }

  // reveal cards on scroll
  const elems = document.querySelectorAll('.card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elems.forEach(el => { el.classList.add('reveal'); io.observe(el); });

  // subtle tilt micro-interaction for cards
  document.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rx = (y) * 6;
      const ry = (x) * -6;
      card.style.transform = `translateY(-6px) scale(1.01) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.transform = '';
    });
  });
});
