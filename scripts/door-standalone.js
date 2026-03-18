document.addEventListener('DOMContentLoaded', function () {
  const doorTag = document.querySelector('.door-tag');
  const doorRope = document.querySelector('.door-rope');
  const hanger = document.querySelector('.hanger');
  const doorPanel = document.querySelector('.door-panel');
  const doorKnob = document.querySelector('.door-knob');
  const doorBody = document.querySelector('.door-body');

  if (!doorTag || !doorRope || !hanger || !doorPanel || !doorKnob || !doorBody) return;

  doorTag.addEventListener('click', function (e) {
    e.preventDefault();

    doorTag.classList.add('door-tag-pulled');
    doorRope.classList.add('door-rope-pulled');
    hanger.classList.add('hanger-clicked');
    doorPanel.classList.add('door-panel-pull');
    doorKnob.classList.add('door-knob-react');

    window.setTimeout(function () {
      hanger.classList.remove('hanger-clicked');
      doorPanel.classList.add('door-panel-open');
      doorBody.classList.add('door-body-open');
    }, 120);

    window.setTimeout(function () {
      window.location.href = './standalone-packages.html';
    }, 980);
  });

  doorTag.addEventListener('mouseenter', function () {
    hanger.style.animationDuration = '1.1s';
    doorTag.style.boxShadow = '0 10px 25px rgba(15,10,6,0.45)';
    doorKnob.style.boxShadow = '0 0 12px rgba(255,241,201,0.95), inset 0 1px 8px rgba(255,255,255,0.76)';
  });

  doorTag.addEventListener('mouseleave', function () {
    hanger.style.animationDuration = '2.8s';
    doorTag.style.boxShadow = '0 5px 16px rgba(15,10,6,0.31)';
    doorKnob.style.boxShadow = '0 0 7px rgba(255,233,169,0.75), inset 0 0 4px rgba(255,255,255,0.34)';
  });

  function loop() {
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
});