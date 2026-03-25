
const WHATSAPP_NUMBER = '5519999112173';
const WHATSAPP_MSG    = 'Olá! Vi o site da Moras e quero saber mais sobre os serviços. 🟣';

   //WHATSAPP

function abrirWhatsApp() {
  const msg = encodeURIComponent(WHATSAPP_MSG);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  window.open(url, '_blank');
}

// Expõe globalmente
window.abrirWhatsApp = abrirWhatsApp;


function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.scrollToSection = scrollToSection;



window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
  }, 1800);
});


   //CURSOR CUSTOMIZADO

const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursorTrail');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  trail.style.left  = e.clientX + 'px';
  trail.style.top   = e.clientY + 'px';
});



  // Quadrados e cubos subindo pela tela

const stage = document.getElementById('floatStage');
const TOTAL_SHAPES = 20;

function rand(a, b) {
  return a + Math.random() * (b - a);
}

function makeCubeHTML(size) {
  const half = size / 2;
  const fs   = `width:${size}px;height:${size}px;`;
  const transforms = [
    `translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateY(90deg)  translateZ(${half}px)`,
    `rotateX(90deg)  translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];
  const faces = transforms
    .map(t => `<div style="${fs}position:absolute;border:1px solid rgba(124,58,237,.35);background:rgba(45,11,107,.05);transform:${t};"></div>`)
    .join('');

  return `
    <div style="width:${size}px;height:${size}px;perspective:${size * 3}px;">
      <div style="width:${size}px;height:${size}px;transform-style:preserve-3d;
        animation:fCubeSpin ${rand(14, 28).toFixed(1)}s ease-in-out infinite;
        position:relative;">
        ${faces}
      </div>
    </div>`;
}

// Injeta o keyframe dos cubos flutuantes no <head>
const floatStyle = document.createElement('style');
floatStyle.textContent = `
  @keyframes fCubeSpin {
    0%,100% { transform: rotateX(-15deg) rotateY(0deg); }
    50%     { transform: rotateX(-15deg) rotateY(180deg); }
  }
`;
document.head.appendChild(floatStyle);

for (let i = 0; i < TOTAL_SHAPES; i++) {
  const isCube = Math.random() > 0.45;
  const size   = Math.round(rand(18, 70));
  const rot0   = rand(-30, 30);
  const rot1   = rot0 + rand(-120, 120);
  const dur    = rand(18, 45);
  const delay  = rand(0, dur);
  const op     = rand(0.04, 0.10);

  const el = document.createElement('div');
  el.classList.add('float-el');
  el.style.cssText = `
    left: ${rand(0, 96)}vw;
    --rot0: ${rot0}deg;
    --rot1: ${rot1}deg;
    --op: ${op};
    animation-duration: ${dur}s;
    animation-delay: -${delay}s;
  `;

  el.innerHTML = isCube
    ? makeCubeHTML(size)
    : `<div class="float-sq" style="width:${size}px;height:${size}px;"></div>`;

  stage.appendChild(el);
}


const revObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

   //Olhos do quadrado seguem o cursor

document.addEventListener('mousemove', e => {
  ['dEyeL', 'dEyeR'].forEach(id => {
    const pupil = document.getElementById(id);
    if (!pupil) return;

    const eye   = pupil.parentElement;
    const rect  = eye.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = e.clientX - cx;
    const dy    = e.clientY - cy;
    const dist  = Math.min(Math.sqrt(dx * dx + dy * dy), 5);
    const angle = Math.atan2(dy, dx);

    pupil.style.transform = `translate(
      calc(-50% + ${Math.cos(angle) * dist}px),
      calc(-50% + ${Math.sin(angle) * dist}px)
    )`;
  });
});


  // cubo  arrastável Mouse e Touch 

const demoCube = document.getElementById('demoCube');

if (demoCube) {
  let dragging = false;
  let startX   = 0, startY = 0;
  let rotX     = -18, rotY = -30;
  let velX     = 0,   velY = 0;
  let rafId    = null;

  function applyRot() {
    demoCube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  function inertia() {
    if (Math.abs(velX) < 0.04 && Math.abs(velY) < 0.04) return;
    velX *= 0.92;
    velY *= 0.92;
    rotX -= velX;
    rotY += velY;
    applyRot();
    rafId = requestAnimationFrame(inertia);
  }

  // Mouse
  demoCube.parentElement.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    velX = velY = 0;
    if (rafId) cancelAnimationFrame(rafId);
    demoCube.style.transition = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    velY = dx * 0.38;
    velX = dy * 0.38;
    rotY += dx * 0.38;
    rotX -= dy * 0.38;
    startX = e.clientX;
    startY = e.clientY;
    applyRot();
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    demoCube.style.transition = 'transform .04s linear';
    inertia();
  });

  // Touch
  demoCube.parentElement.addEventListener('touchstart', e => {
    const t = e.touches[0];
    dragging = true;
    startX = t.clientX;
    startY = t.clientY;
    velX = velY = 0;
    if (rafId) cancelAnimationFrame(rafId);
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const t  = e.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    velY = dx * 0.38;
    velX = dy * 0.38;
    rotY += dx * 0.38;
    rotX -= dy * 0.38;
    startX = t.clientX;
    startY = t.clientY;
    applyRot();
  }, { passive: true });

  document.addEventListener('touchend', () => {
    dragging = false;
    inertia();
  });

  applyRot();
}


 //  PARALLAX — texto gigante do hero

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  document.querySelectorAll('.hero-bg-text').forEach(el => {
    el.style.transform = `translate(-50%, -50%) translateY(${y * 0.28}px)`;
  });
});


   //PULSO DO QUADRADO DEMO (sutil)

setInterval(() => {
  const sq = document.getElementById('demoSq');
  if (!sq) return;
  sq.style.boxShadow = '0 0 60px rgba(124,58,237,.45)';
  setTimeout(() => {
    sq.style.boxShadow = '0 0 40px rgba(124,58,237,.2)';
  }, 300);
}, 4000);
