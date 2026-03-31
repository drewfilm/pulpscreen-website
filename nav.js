// ===== PULPSCREEN UNIVERSAL NAVIGATION =====
// Single source of truth — loaded by all pages
// Detects language from URL path, renders the correct nav

(function() {
  const path = window.location.pathname;
  const langs = {
    en: { flag: '🇬🇧', code: 'EN', svc: 'Services', guide: 'Co-Production Guide', guideHome: 'Guide Home', taxInc: 'Tax Incentives', compare: 'Compare Countries', copro: 'Co-Production Framework', treaties: 'Treaties & Funds', cta: 'Get in Touch', homePath: '/', guidePath: '/eu-incentive-guide.html' },
    fr: { flag: '🇫🇷', code: 'FR', svc: 'Services', guide: 'Guide de Coproduction', guideHome: 'Accueil du Guide', taxInc: 'Incitations Fiscales', compare: 'Comparer les Pays', copro: 'Cadre de Coproduction', treaties: 'Traités et Fonds', cta: 'Nous Contacter', homePath: '/fr/', guidePath: '/fr/eu-incentive-guide.html' },
    es: { flag: '🇪🇸', code: 'ES', svc: 'Servicios', guide: 'Guía de Coproducción', guideHome: 'Inicio de la Guía', taxInc: 'Incentivos Fiscales', compare: 'Comparar Países', copro: 'Marco de Coproducción', treaties: 'Tratados y Fondos', cta: 'Contáctenos', homePath: '/es/', guidePath: '/es/eu-incentive-guide.html' },
    de: { flag: '🇩🇪', code: 'DE', svc: 'Leistungen', guide: 'Koproduktions-Guide', guideHome: 'Guide Startseite', taxInc: 'Steuerliche Anreize', compare: 'Länder vergleichen', copro: 'Koproduktionsrahmen', treaties: 'Abkommen & Fonds', cta: 'Kontakt', homePath: '/de/', guidePath: '/de/eu-incentive-guide.html' },
    it: { flag: '🇮🇹', code: 'IT', svc: 'Servizi', guide: 'Guida alla Coproduzione', guideHome: 'Home della Guida', taxInc: 'Incentivi Fiscali', compare: 'Confronta Paesi', copro: 'Quadro di Coproduzione', treaties: 'Trattati e Fondi', cta: 'Contattaci', homePath: '/it/', guidePath: '/it/eu-incentive-guide.html' },
  };

  // Detect current language from URL
  const langMatch = path.match(/^\/(fr|es|de|it)\//);
  const currentLang = langMatch ? langMatch[1] : 'en';
  const t = langs[currentLang];

  // Detect if we're on homepage or guide (for contact link)
  const isHomepage = path === '/' || path === '/index.html' || path === t.homePath || path === t.homePath + 'index.html';
  const contactHref = isHomepage ? '#contact' : (currentLang === 'en' ? '/#contact' : '/#contact');
  const servicesHref = isHomepage ? '#services' : '/#services';

  // Image path (relative for subdirectories)
  const imgPath = currentLang === 'en' ? 'images' : '../images';

  // Build language dropdown
  let langLinks = '';
  for (const [code, l] of Object.entries(langs)) {
    const isGuide = path.includes('eu-incentive-guide');
    const href = isGuide ? l.guidePath : l.homePath;
    const active = code === currentLang ? ' class="active"' : '';
    langLinks += `<a href="${href}"${active}><span class="flag">${l.flag}</span> ${
      code === 'en' ? 'English' : code === 'fr' ? 'Français' : code === 'es' ? 'Español' : code === 'de' ? 'Deutsch' : 'Italiano'
    }</a>`;
  }

  const navHTML = `
<nav class="nav" id="nav">
  <a href="${t.homePath}" class="nav-logo">
    <img src="/${imgPath}/Asset 3@5x.png" alt="Pulpscreen"
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
    <div class="nav-logo-fallback" style="display:none;">
      <div class="nav-logo-mark">P</div>
      <span class="nav-wordmark">Pulpscreen</span>
    </div>
  </a>

  <div class="nav-links">
    <a href="${servicesHref}" class="nav-link">${t.svc}</a>
    <div class="nav-dropdown">
      <a href="${t.guidePath}" class="nav-link">${t.guide}</a>
      <div class="nav-dropdown-menu">
        <a href="${t.guidePath}">${t.guideHome}</a>
        <a href="${t.guidePath}#incentives">${t.taxInc}</a>
        <a href="${t.guidePath}#compare">${t.compare}</a>
        <a href="${t.guidePath}#copro">${t.copro}</a>
        <a href="${t.guidePath}#treaties">${t.treaties}</a>
      </div>
    </div>
    <a href="${contactHref}" class="nav-cta">${t.cta}</a>
  </div>

  <div class="lang-switch">
    <div class="lang-current"><span class="flag">${t.flag}</span> ${t.code}</div>
    <div class="lang-dropdown">${langLinks}</div>
  </div>
  <button class="nav-toggle" onclick="document.querySelector('.nav-links').classList.toggle('show')" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>`;

  // Inject nav
  const target = document.getElementById('main-nav');
  if (target) {
    target.innerHTML = navHTML;
  }

  // Nav scroll effect
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // Language dropdown click toggle
  document.addEventListener('click', (e) => {
    const current = e.target.closest('.lang-current');
    if (current) {
      e.stopPropagation();
      current.closest('.lang-switch').classList.toggle('open');
      return;
    }
    document.querySelectorAll('.lang-switch.open').forEach(el => el.classList.remove('open'));
  });

  // Close mobile menu on anchor click
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.remove('show');
    });
  });

  // Language persistence
  const stored = localStorage.getItem('pulpscreen-lang');
  const allLangs = ['en','fr','es','de','it'];

  if (stored && stored !== currentLang && allLangs.includes(stored)) {
    const basePath = path.replace(/^\/(fr|es|de|it)\//, '/');
    const newPath = stored === 'en' ? basePath : '/' + stored + basePath;
    window.location.replace(newPath + window.location.hash);
    return;
  }

  document.querySelectorAll('.lang-dropdown a').forEach(a => {
    a.addEventListener('click', function() {
      const href = this.getAttribute('href');
      const lang = href === '/' ? 'en' : (href.match(/^\/(fr|es|de|it)\//) || [])[1] || 'en';
      localStorage.setItem('pulpscreen-lang', lang);
    });
  });

  if (!stored) localStorage.setItem('pulpscreen-lang', currentLang);
})();
