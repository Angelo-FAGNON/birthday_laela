/* ═══════════════════════════════════
   CURSOR (desktop)
═══════════════════════════════════ */
const cur = document.getElementById('cursor');
const cRing = document.getElementById('cursorRing');
let mx=0, my=0, rx=0, ry=0;

if (cur && cRing) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.transform = `translate(${mx-5}px, ${my-5}px)`;
  });
  (function animRing() {
    rx += (mx - rx) * .13; ry += (my - ry) * .13;
    cRing.style.transform = `translate(${rx-17}px, ${ry-17}px)`;
    requestAnimationFrame(animRing);
  })();
}

/* ═══════════════════════════════════
   PARTICLES (hero)
═══════════════════════════════════ */
const pWrap = document.getElementById('particles');
const pColors = ['#d4af37','#2a7a5a','#ffffff','#e8cc6a'];
for (let i = 0; i < 20; i++) {
  const p = document.createElement('div'); p.className = 'particle';
  const s = Math.random() * 4 + 2;
  p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;background:${pColors[~~(Math.random()*4)]};animation-duration:${7+Math.random()*12}s;animation-delay:${Math.random()*8}s;`;
  pWrap.appendChild(p);
}

/* ═══════════════════════════════════
   MUSIC
═══════════════════════════════════ */
const audio = document.getElementById('bgMusic');
const audio2 = document.getElementById('bgMusic2');
const mIcon = document.getElementById('mIcon');
const mBtn  = document.getElementById('musicBtn');
let playing = false;

// Quand le premier audio se termine, passer au second
audio.addEventListener('ended', () => {
  if (playing) audio2.play();
});

// Quand le second audio se termine, recommencer au premier
audio2.addEventListener('ended', () => {
  if (playing) audio.play();
});

function toggleMusic() {
  if (!playing) {
    audio.play()
      .then(() => { playing=true; mIcon.className='fa-solid fa-pause'; mBtn.classList.add('playing'); showToast('🎵 Musique activée !'); })
      .catch(() => showToast('⚠️ Autorisez l\'audio dans le navigateur'));
  } else {
    audio.pause(); 
    audio2.pause();
    playing=false; 
    mIcon.className='fa-solid fa-music'; 
    mBtn.classList.remove('playing'); 
    showToast('⏸️ Musique pausaée');
  }
}

/* ═══════════════════════════════════
   GALLERY
═══════════════════════════════════ */
const galleryImgs = [
  { u:'./assests/img/1.webp', a:'Image 1' },
  { u:'./assests/img/2.webp', a:'Image 2' },
  { u:'./assests/img/3.webp', a:'Image 3' },
  { u:'./assests/img/4.webp', a:'Image 4' },
  { u:'./assests/img/5.webp', a:'Image 5' },
  { u:'./assests/img/6.webp', a:'Image 6' },
  { u:'./assests/img/7.webp', a:'Image 7' },
  { u:'./assests/img/8.webp', a:'Image 8' },
  { u:'./assests/img/9.webp', a:'Image 9' },
  { u:'./assests/img/10.webp', a:'Image 10' },
  { u:'./assests/img/11.webp', a:'Image 11' },
  { u:'./assests/img/12.webp', a:'Image 12' },
];

function buildGalleryRow(id, imgs) {
  const row = document.getElementById(id);
  [...imgs, ...imgs].forEach(({ u, a }) => {
    const wrap = document.createElement('div'); wrap.className = 'g-item';
    wrap.innerHTML = `<img src="${u}" alt="${a}" loading="lazy"/><div class="g-zoom-icon"><i class="fa-solid fa-magnifying-glass-plus"></i></div>`;
    wrap.addEventListener('mouseenter', () => row.classList.add('paused'));
    wrap.addEventListener('mouseleave', () => row.classList.remove('paused'));
    wrap.addEventListener('click', () => openLB(u, a));
    row.appendChild(wrap);
  });
}
buildGalleryRow('gRow1', galleryImgs);
buildGalleryRow('gRow2', [...galleryImgs].reverse());

function openLB(src, alt) {
  document.getElementById('lb-img').src = src;
  document.getElementById('lb-img').alt = alt;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLB() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target === document.getElementById('lightbox')) closeLB();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

/* ═══════════════════════════════════
   QUIZ
═══════════════════════════════════ */
const quizData = [
  { e:'', q:'Quel est le super-pouvoir de Laëla dans l\'équipe DigiWeb ?',
    opts:['Faire du café parfait','Créer du contenu percutant','Disparaître avant l\'heure de sortie','Rendre tout le monde accro aux réseaux'], ans:1 },
  { e:'', q:'Si Laëla était un réseau social, elle serait…',
    opts:['LinkedIn (sérieuse & pro)','Instagram (belle & créative)','TikTok (virale & fun) ','Twitter/X (directe & percutante)'], ans:2 },
  { e:'', q:'Quelle phrase décrit le mieux Laëla ?',
    opts:['"Pour votre information, il y a du Yaourt"','"Tiens! Tiens! Autant pour vous, Autant pour moi"','"Olétafishô Ilé"','"Celle qui est au courant de tout les gbêrê dans l\'équipe" '], ans:3 },
  { e:'', q:'Quelle est la réaction typique de Laëla face à un imprévu ou un défi de dernière minute ?',
    opts:['Colère Volcanique','Panique','Changement d\'humeur gigantesque','Sauter de joie'], ans:2 },
  { e:'', q:'Quelle est la vraie valeur de Laëla pour DigiWeb ?',
    opts:['Meilleure Collègue','Mood et Trouble Maker','Elle connaît tous les memes','Elle arrive toujours à l\'heure pile'], ans:1 },
];
let curQ = 0, score = 0, answered = false;

function renderQ() {
  const q = quizData[curQ];
  document.getElementById('qProg').style.width = (curQ / quizData.length * 100) + '%';
  document.getElementById('btnNext').style.display = 'none';
  const optsHTML = q.opts.map((o, i) =>
    `<div class="q-opt" onclick="pickOpt(this,${i})"><span class="q-ltr">${String.fromCharCode(65+i)}</span><span>${o}</span></div>`
  ).join('');
  const html = `<div class="q-count">Question ${curQ+1} / ${quizData.length}</div><span class="q-emoji">${q.e}</span><p class="q-text">${q.q}</p><div class="q-opts">${optsHTML}</div>`;
  const body = document.getElementById('quizBody');
  body.style.opacity = 0;
  setTimeout(() => { body.innerHTML = html; body.style.transition = 'opacity .4s'; body.style.opacity = 1; }, 180);
  answered = false;
}

function pickOpt(el, idx) {
  if (answered) return; answered = true;
  const q = quizData[curQ];
  document.querySelectorAll('.q-opt').forEach(o => o.classList.add('disabled'));
  if (idx === q.ans) { el.classList.add('correct'); score++; showToast('✅ Bonne réponse !'); launchMini(); }
  else { el.classList.add('wrong'); document.querySelectorAll('.q-opt')[q.ans].classList.add('correct'); showToast('❌ Pas cette fois…'); }
  document.getElementById('btnNext').style.display = 'inline-flex';
}

function nextQ() {
  curQ++;
  if (curQ < quizData.length) renderQ();
  else showResult();
}

function showResult() {
  document.getElementById('qProg').style.width = '100%';
  document.getElementById('btnNext').style.display = 'none';
  const pct = score / quizData.length;
  let ic, ti, ms;
  if (pct < 0.4)      { ic='😅'; ti='Hmmm… on s\'inquiète !'; ms='Soit tu ne la connais pas vraiment, soit tu as répondu les yeux fermés 😂 Reviens après avoir vu tous ses posts !'; }
  else if (pct < 0.8) { ic='😊'; ti='Pas mal du tout !'; ms='Tu connais bien Laëla ! Continue à l\'observer en action et tu deviendras un expert certifié 🌟'; }
  else                { ic='🔥'; ti='Tu fais partie de la DigiWeb Family !'; ms='WOW ! Tu connais vraiment notre star ! Tu mérites une médaille DigiWeb. Laëla serait fière de toi ! 🏆✨'; }
  document.getElementById('quizBody').innerHTML = `
    <div class="q-result">
      <span class="q-res-icon">${ic}</span>
      <div class="q-res-score">${score}/${quizData.length}</div>
      <h3 class="q-res-title">${ti}</h3>
      <p class="q-res-msg">${ms}</p>
      <button class="btn-restart" onclick="restartQ()"><i class="fa-solid fa-rotate-right me-2"></i>Rejouer</button>
    </div>`;
  if (pct >= 0.8) launchConfetti(160);
}

function restartQ() { curQ = 0; score = 0; renderQ(); }
renderQ();

/* ═══════════════════════════════════
   MESSAGES
═══════════════════════════════════ */
const messages = [
  {n:'Mr Bernard',       m:'Chère Laëla, je te souhaite un très heureux anniversaire. Que chaque jour de l\'année à venir t\'apporte joie, santé et accomplissement.'},
  {n:'Mr Samuel',        m:'Joyeux anniversaire Miss Laëla. Ton talent de communication et ta vision créative font briller notre présence digitale chaque jour.'},
  {n:'Miss Chrisvalène', m:'Très heureux anniversaire Miss Laëla. Merci pour ta passion contagieuse et ton engagement envers notre communauté.'},
  {n:'Mr Raoul',         m:'Joyeux anniversaire Miss Laëla. Que cette nouvelle année t\'apporte encore plus de succès dans tes campagnes créatives.'},
  {n:'Mr Lauriano',      m:'Bon anniversaire Miss Laëla. Ton dévouement et ta détermination inspirent toute l\'équipe à donner le meilleur.'},
  {n:'Mr Bill',          m:'Joyeux anniversaire Miss Laëla. Tu construis des ponts entre nos produits et notre audience avec un talent remarquable.'},
  {n:'Mr Rodrigue',      m:'Très bon anniversaire Miss Laëla. Merci pour ton esprit collaboratif et ta capacité à transformer les idées en histoires captivantes.'},
  {n:'Miss Rouka',       m:'Joyeux anniversaire Miss Laëla. Continue à enchanter nos followers avec ton contenu innovant et authentique.'},
  {n:'Mr Renaud',        m:'Bon anniversaire Miss Laëla. Ta précision stratégique et ta créativité rendent chaque publication mémorable.'},
  {n:'Mr Hercule',       m:'Joyeux anniversaire Miss Laëla. Travailler avec toi est un apprentissage constant en engagement et en connexion humaine.'},
  {n:'Mr Mouhid',        m:'Très heureux anniversaire Miss Laëla. Merci pour ta perspicacité et ta maîtrise des tendances digitales.'},
  {n:'Mr Anthony',       m:'Bon anniversaire Miss Laëla. Que cette nouvelle année soit remplie de campagnes couronnées de succès et de croissance.'},
  {n:'Miss Paloma',      m:'Joyeux anniversaire Miss Laëla. Ton travail et ta passion font de DigiWeb une marque que les gens adorent suivre.'},
  {n:'Miss Serena',      m:'Très bon anniversaire Miss Laëla. Continue à créer du contenu qui inspire, divertit et engage notre communauté.'},
  {n:'Mr Etienne',       m:'Joyeux anniversaire Miss Laëla. Ton autorité dans la gestion communautaire est un véritable atout pour notre stratégie digitale.'},
  {n:'Mr Angelo',        m:'Joyeux anniversaire Miss Laëla. Ta maîtrise du storytelling inspire confiance et fidélité chez nos followers.'},
  {n:'Mr Magloire',      m:'Très heureux anniversaire Miss Laëla. Que ta créativité continue d\'électriser nos réseaux sociaux.'},
  {n:'Mr Emery',         m:'Bon anniversaire Miss Laëla. Merci pour ta constance et ton excellence dans chaque interaction communautaire.'},
  {n:'Mme TOSSAVI',      m:'Joyeux anniversaire Miss Laëla. Nous te souhaitons une année pleine de succès, de connexions et d\'innovations extraordinaires.'},
  {n:'Mr TOSSAVI',       m:'Très bon anniversaire Miss Laëla. Que ton talent continue de bâtir la réputation et le rayonnement de DigiWeb.'},
];
const mTrack = document.getElementById('msgTrack');
[...messages, ...messages].forEach(({ n, m }, idx) => {
  const num = (idx % messages.length) + 1;
  const card = document.createElement('div'); card.className = 'msg-card';
  card.innerHTML = `<div class="msg-av">${num}</div><div class="msg-name">${n}</div><p class="msg-text">${m}</p><div class="msg-stars">★ ★ ★ ★ ★</div>`;
  mTrack.appendChild(card);
});


/* ═══════════════════════════════════
   COMPLIMENT
═══════════════════════════════════ */
const compliments = [
  '"Pour notre CM : Il y a des voix qu’on entend, Et d’autres qu’on ressent. La tienne fait les deux. Dans chaque message, il y a une intention, Dans chaque idée, une direction, Et dans chaque silence… une vision. Tu ne fais pas que gérer, Tu comprends, tu relies, tu construis.Tu laisses ta trace partout. Aujourd’hui, On ne célèbre pas seulement ton anniversaire… On célèbre ce que tu es, Et tout ce que tu apportes. Succès, Santé, Longévité à toi." ',
  '"Si la créativité avait un visage, ce serait le tien." ',
  '"Tu es la raison pour laquelle notre communauté est si engagée." ',
  '"Ton énergie positive illumine toute l\'équipe, chaque jour." ',
  '"Tu ne suis pas les tendances — tu les crées." ',
  '"Travailler avec toi, c\'est apprendre quelque chose de nouveau chaque jour." ',
  '"La DigiWeb Family sans toi ? Impensable." ',
  '"Tu as l\'art de rendre les gens heureux rien qu\'avec tes mots." ',
  '"Tu es une reine du storytelling, et tout le monde le sait." ',
  '"Ta rigueur et ta passion sont une leçon pour nous tous." ',
  '"Chaque contenu que tu produis est une œuvre d\'art." ',
  '"Tu donnes du sens au mot excellence." ',
];

let complimentIndex = 0;

function showCmp() {
  const el = document.getElementById('cmpMsg');
  el.classList.remove('show');
  setTimeout(() => { 
    el.textContent = compliments[complimentIndex]; 
    complimentIndex = (complimentIndex + 1) % compliments.length;
    el.classList.add('show'); 
  }, 200);
  launchMini();
}

/* ═══════════════════════════════════
   CONFETTI
═══════════════════════════════════ */
const cfColors = ['#d4af37','#0f3d2e','#ffffff','#e8cc6a','#2a7a5a','#f7d060','#ff6b9d','#c084fc','#60a5fa','#34d399'];
function launchConfetti(count = 120) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div'); el.className = 'cf';
    const size = 5 + Math.random() * 10;
    const rnd = Math.random();
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: -12px;
      width: ${rnd > .55 ? size * .5 : size}px;
      height: ${size}px;
      background: ${cfColors[~~(Math.random() * cfColors.length)]};
      border-radius: ${rnd > .65 ? '50%' : '2px'};
      animation-duration: ${2.5 + Math.random() * 3.5}s;
      animation-delay: ${Math.random() * 2}s;
    `;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}
function launchMini() { launchConfetti(35); }

/* Welcome confetti on load */
window.addEventListener('load', () => setTimeout(() => launchConfetti(90), 900));

/* ═══════════════════════════════════
   TOAST
═══════════════════════════════════ */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* ═══════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════ */
const revEls = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
revEls.forEach(r => revObs.observe(r));

/* ═══════════════════════════════════
   WORD ROTATION (Sublime → Joyeux → Heureux)
═══════════════════════════════════ */
const wordRotateEl = document.querySelector('.word-rotate');
const words = ['Sublime', 'Joyeux', 'Heureux'];
let wordIndex = 0;

function rotateWord() {
  if (!wordRotateEl) return;
  
  // Fade out (0.6s)
  wordRotateEl.style.opacity = '0';
  
  // Change word and fade in after fade out completes
  setTimeout(() => {
    wordIndex = (wordIndex + 1) % words.length;
    wordRotateEl.textContent = words[wordIndex];
    // Fade in (0.6s)
    wordRotateEl.style.opacity = '1';
  }, 600);
}

// Cycle: 2000ms visible + 600ms fade out + 600ms fade in = 3200ms total
setInterval(rotateWord, 3200);

/* ═══════════════════════════════════
   3D ROTATION CARD
═══════════════════════════════════ */
(function initRotationCard() {
  const rc3DImages = [
    './assests/img/1.webp',
    './assests/img/2.webp',
    './assests/img/3.webp',
    './assests/img/4.webp',
  ];

 const rc3DMessages = [
  'Une femme de talent, une force de la nature digitale.',
  'Créativité, stratégie, impact : son trio de charme.',
  'Une bauté naturelle qui rend son regard et son sourire irrésistibles.',
  'DigiWeb brille grâce à son dévouement quotidien.',
];

  // Préchargement des images
  rc3DImages.forEach(src => { const i = new Image(); i.src = src; });

  const card      = document.getElementById('rotationCard');
  const frontFace = document.getElementById('rcFront');
  const backFace  = document.getElementById('rcBack');
  const frontImg  = document.getElementById('rcFrontImg');
  const backImg   = document.getElementById('rcBackImg');
  const frontMsg  = document.getElementById('rcFrontMsg');
  const backMsg   = document.getElementById('rcBackMsg');
  const dotsWrap  = document.getElementById('rcDots');

  if (!card) return;

  let current   = 0;
  let flipped   = false;
  let busy      = false;
  let autoTimer = null;
  const total   = rc3DImages.length;

  // Dots
  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 'rc-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo((current + 1) % total));
    dotsWrap.appendChild(d);
  }

  function setDots(idx) {
    dotsWrap.querySelectorAll('.rc-dot').forEach((d, i) =>
      d.classList.toggle('active', i === idx)
    );
  }

  // Init face avant
  frontImg.style.backgroundImage = `url('${rc3DImages[0]}')`;
  frontMsg.textContent = rc3DMessages[0];
  frontFace.classList.add('active-face');

  // Préparer la face arrière avec l'index suivant
  function prepareHiddenFace(nextIdx) {
    const hiddenImg = flipped ? frontImg : backImg;
    const hiddenMsg = flipped ? frontMsg : backMsg;
    hiddenImg.style.backgroundImage = `url('${rc3DImages[nextIdx]}')`;
    hiddenMsg.textContent = rc3DMessages[nextIdx];
  }

  function goTo(nextIdx) {
    if (busy) return;
    busy = true;
    stopAuto();

    const activeFace = flipped ? backFace : frontFace;
    const hiddenFace = flipped ? frontFace : backFace;

    // Préparer la face cachée
    prepareHiddenFace(nextIdx);

    // Retirer le message actif
    activeFace.classList.remove('active-face');

    // Flip
    flipped = !flipped;
    card.classList.toggle('is-flipped',   flipped);
    card.classList.toggle('is-unflipped', !flipped);

    // Après la transition (750ms) : activer le message de la nouvelle face
    setTimeout(() => {
      hiddenFace.classList.add('active-face');
      current = nextIdx;
      setDots(current);
      busy = false;
      startAuto();
    }, 750);
  }

  function next() { goTo((current + 1) % total); }

  function startAuto() {
    stopAuto();
    autoTimer = setTimeout(next, 4000);
  }

  function stopAuto() {
    clearTimeout(autoTimer);
  }

  card.addEventListener('click', next);
  card.addEventListener('mouseenter', stopAuto);
  card.addEventListener('mouseleave', startAuto);

  startAuto();
})();


/* ═══════════════════════════════════
   COUNTDOWN — À L'ANNÉE PROCHAINE
═══════════════════════════════════ */
(function initCountdown() {
  const BIRTH_MONTH = 4;  // Avril = mois 4 (1-indexé) — à ajuster si besoin
  const BIRTH_DAY   = 13; // Jour — à ajuster si besoin

  function getNextBirthday() {
    const now   = new Date();
    const year  = now.getFullYear();
    let next    = new Date(year, BIRTH_MONTH - 1, BIRTH_DAY, 0, 0, 0, 0);
    if (now >= next) {
      next = new Date(year + 1, BIRTH_MONTH - 1, BIRTH_DAY, 0, 0, 0, 0);
    }
    return next;
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function formatDate(d) {
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  const elDays    = document.getElementById('cdDays');
  const elHours   = document.getElementById('cdHours');
  const elMinutes = document.getElementById('cdMinutes');
  const elSeconds = document.getElementById('cdSeconds');
  const elFill    = document.getElementById('cdProgressFill');
  const elPct     = document.getElementById('cdProgressPct');
  const elDate    = document.getElementById('cdNextDate');

  if (!elDays) return;

  const nextBD = getNextBirthday();
  elDate.textContent = formatDate(nextBD);

  // Durée totale d'une année en ms (depuis maintenant jusqu'à l'anniversaire)
  const now0   = new Date();
  const prevBD = new Date(nextBD);
  prevBD.setFullYear(prevBD.getFullYear() - 1);
  const totalMs = nextBD - prevBD;

  function tick() {
    const now     = new Date();
    const diff    = nextBD - now;

    if (diff <= 0) {
      elDays.textContent    = '00';
      elHours.textContent   = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      elFill.style.width    = '100%';
      elPct.textContent     = '100%';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    elDays.textContent    = pad(days);
    elHours.textContent   = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);

    const elapsed = totalMs - diff;
    const pct     = Math.min(100, Math.round((elapsed / totalMs) * 100));
    elFill.style.width  = pct + '%';
    elPct.textContent   = pct + '%';
  }

  tick();
  setInterval(tick, 1000);
})();