(function () {
  const THEME_KEY = 'slm-sprogblomsten-theme';
  const FILTER_KEY = 'slm-sprogblomsten-filter';
  const initialTheme = (() => {
    try {
      const s = localStorage.getItem(THEME_KEY);
      if (s === 'light' || s === 'dark') return s;
    } catch {}
    return 'light';
  })();
  let filterCategory = (() => {
    try {
      const s = localStorage.getItem(FILTER_KEY);
      if (s && ['lytteLaese', 'taleSkrive', 'snakkeSkriveSammen', 'formidling'].includes(s)) return s;
    } catch {}
    return null;
  })();
  document.documentElement.setAttribute('data-theme', initialTheme === 'dark' ? 'dark' : '');

  document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next === 'dark' ? 'dark' : '');
    try { localStorage.setItem(THEME_KEY, next); } catch {}
  });
  

  const diagramWrap = document.getElementById('diagramWrap');
  const bubbleWrap = document.getElementById('bubbleWrap');

  const SYMBOL_MAP = { lytteLaese: 'circle', taleSkrive: 'triangle', snakkeSkriveSammen: 'square', formidling: 'star' };
  const popupTitle = document.getElementById('popupTitle');
  const popupBookmarksList = document.getElementById('popupBookmarksList');
  const regionHint = document.getElementById('regionHint');

  const SPROGFÆRDIGHEDER = {
    lytteLaese: { udtryk: 'Lytte/Læse', term: 'Reception', factor: 'Receptiv sproglig aktivitet' },
    taleSkrive: { udtryk: 'Tale/Skrive', term: 'Produktion', factor: 'Produktiv sproglig aktivitet' },
    snakkeSkriveSammen: { udtryk: 'Samarbejde', term: 'Interaktion', factor: 'Interaktion og samarbejde' },
    formidling: { udtryk: 'Anvende Teori', term: 'Mediering', factor: 'Formidle og præsentere indhold' }
  };

  const FILL_TO_REGION = {
    '#FEEFAE': { name: 'Fagsprog', desc: 'Fagligt og professionelt sprog' },
    '#B0F0F2': { name: 'Hverdagssprog', desc: 'Hverdagens sprog og daglig kommunikation' },
    '#FEB5E2': { name: 'Akademisk sprog', desc: 'Akademisk og fagligt sprog' },
    '#FFC8A1': { name: 'Fag- og akademisk sprog', desc: 'Overlap mellem fagsprog og akademisk sprog' },
    '#B0CAE3': { name: 'Hverdags- og akademisk sprog', desc: 'Overlap mellem hverdagssprog og akademisk sprog' },
    '#B3E7CB': { name: 'Fag- og hverdagssprog', desc: 'Overlap mellem fagsprog og hverdagssprog' }
  };

  /* Forløb fra Excel – hver region har array af forløb. url: '#' = link mangler i MYRE */
  const REGION_BOOKMARKS = {
    '#FEEFAE': [ /* Fagsprog */
      { url: 'https://gdlt.sdu.dk/sosu-ai-borger/', title: 'Samtale med AI Borger', description: 'SDU kandidatstuderende & SOSU undervisere. Sprog: Dansk.', previewImage: 'Assets/AI-Borger.png', categories: ['lytteLaese', 'taleSkrive', 'snakkeSkriveSammen', 'formidling'] },
      { url: '#', title: 'Fagsprog med H5P', description: 'Fagord og fagsprog med H5P. Sprog: Dansk.', previewImage: '', categories: ['lytteLaese', 'taleSkrive'] },
      { url: '#', title: 'Læseaccelerator', description: 'International læringscafé med AI-tools. Sprog: Dansk.', previewImage: '', categories: ['taleSkrive'] },
      { url: '#', title: 'Gummiand som vejleder', description: 'Elevernes individuelle faglige guide. Sprog: Dansk.', previewImage: '', categories: ['snakkeSkriveSammen', 'taleSkrive'] },
      { url: '#', title: 'AI-Talegenkendelse', description: 'At øve botanisk latin med AI-talegenkendelse. Sprog: Latin – Engelsk.', previewImage: '', categories: ['taleSkrive'] },
      { url: '#', title: 'Droneinspektion', description: 'Droneinspektion af store træer. Sprog: Dansk – Latin.', previewImage: '', categories: ['lytteLaese', 'taleSkrive', 'snakkeSkriveSammen', 'formidling'] }
    ],
    '#B0F0F2': [], /* Hverdagssprog – ingen forløb endnu */
    '#FEB5E2': [ /* Akademisk sprog */
      { url: '#', title: 'Avatarer med personligheder', description: 'Sprog: Engelsk – Dansk.', previewImage: '', categories: ['lytteLaese', 'taleSkrive', 'snakkeSkriveSammen', 'formidling'] },
      { url: '#', title: 'Gligglish', description: 'Studerende analyserer sprog-app. Sprog: Dansk.', previewImage: '', categories: ['snakkeSkriveSammen', 'formidling'] }
    ],
    '#FFC8A1': [ /* Fag- og akademisk sprog */
      { url: 'https://gdlt.sdu.dk/mercantec-python/', title: 'Machine Learning med Python', description: 'SDU Metaverse Lab. Sprog: Dansk – Python.', previewImage: 'Assets/ML-Mercantec.png', categories: ['snakkeSkriveSammen'] },
      { url: '#', title: 'Virtuel Peer feedback', description: 'Peer feedback på tværs, Mercantec & SDU. Sprog: Dansk.', previewImage: '', categories: ['lytteLaese', 'taleSkrive', 'snakkeSkriveSammen', 'formidling'] }
    ],
    '#B0CAE3': [ /* Hverdags- og akademisk sprog */
      { url: '#', title: 'Avatar Præsentation', description: 'Elev-avatarer i udlands-valgfag. Sprog: Tysk, Portugies, Islandsk.', previewImage: '', categories: ['snakkeSkriveSammen', 'taleSkrive'] }
    ],
    '#B3E7CB': [ /* Fag- og hverdagssprog */
      { url: '#', title: 'AR Anatomi', description: 'Augmenteringer i undervisningen. Sprog: Engelsk. Status: Under forbehold.', previewImage: '', categories: ['lytteLaese', 'taleSkrive', 'snakkeSkriveSammen', 'formidling'] },
      { url: '#', title: 'Powerpoint AI Oversættelse', description: 'AI-genererede oversættelser i PowerPoint. Status: Under forbehold.', previewImage: '', categories: ['lytteLaese'] },
      { url: 'https://gdlt.sdu.dk/mercantec-internationalt/', title: 'Coding Culture', description: 'Co-creation på tværs af landegrænser. Sprog: Engelsk – Dansk – Hollandsk.', previewImage: 'Assets/Co-Creation.png', categories: ['lytteLaese', 'taleSkrive', 'snakkeSkriveSammen', 'formidling'] },
      { url: '#', title: 'VR Refleksion', description: 'VR-didaktik for mundtlig kommunikation i grupper. Sprog: Dansk.', previewImage: '', categories: ['lytteLaese', 'taleSkrive', 'snakkeSkriveSammen', 'formidling'] }
    ]
  };

  function normalizeFill(fill) {
    if (!fill) return null;
    const m = fill.match(/#[a-fA-F0-9]{6}/);
    return m ? m[0].toUpperCase() : null;
  }

  function makeRegionKey(fill) {
    const n = normalizeFill(fill);
    return n ? Object.keys(FILL_TO_REGION).find(k => k.toUpperCase() === n) : null;
  }

  function renderBookmarkCard(bookmark) {
    const card = document.createElement('div');
    card.className = 'bookmark-card';
    const isPlaceholder = !bookmark.url || bookmark.url === '#';
    const link = document.createElement(isPlaceholder ? 'div' : 'a');
    link.className = 'bookmark-link';
    if (!isPlaceholder) {
      link.href = bookmark.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.style.cursor = 'default';
    }
    let urlDisplay = '';
    try {
      if (bookmark.url !== '#') {
        const u = new URL(bookmark.url);
        urlDisplay = u.hostname + u.pathname.replace(/\/$/, '');
      }
    } catch {}
    link.innerHTML = bookmark.previewImage
      ? `<div class="bookmark-preview-wrap"><img class="bookmark-preview" src="${bookmark.previewImage}" alt="${bookmark.title}" /><span class="bookmark-preview-placeholder">Indlæser…</span></div>
      <div class="bookmark-content">
        <span class="bookmark-title">${bookmark.title}</span>
        <div class="bookmark-categories" aria-label="Sprogfærdigheder"></div>
        <span class="bookmark-desc">${bookmark.description}</span>
        ${urlDisplay ? `<span class="bookmark-url">${urlDisplay}</span>` : ''}
      </div>`
      : `<div class="bookmark-content" style="padding: 1rem;">
        <span class="bookmark-title">${bookmark.title}</span>
        <div class="bookmark-categories" aria-label="Sprogfærdigheder"></div>
        <span class="bookmark-desc">${bookmark.description}</span>
        ${urlDisplay ? `<span class="bookmark-url">${urlDisplay}</span>` : ''}
      </div>`;
    const catsEl = link.querySelector('.bookmark-categories');
    (bookmark.categories || []).forEach(catId => {
      const sym = SYMBOL_MAP[catId];
      const def = SPROGFÆRDIGHEDER[catId];
      if (!sym || !def) return;
      const span = document.createElement('span');
      span.className = `forlob-symbol ${sym} forlob-symbol-${catId}`;
      span.title = `${def.udtryk} (${def.term}): ${def.factor}`;
      span.setAttribute('aria-label', `${def.udtryk} – ${def.term}`);
      catsEl.appendChild(span);
    });
    if (bookmark.previewImage) {
      const img = link.querySelector('.bookmark-preview');
      if (img) {
        img.onload = () => img.parentElement?.classList.add('loaded');
        img.onerror = () => { img.parentElement?.classList.remove('loaded'); img.nextElementSibling && (img.nextElementSibling.textContent = 'Ingen forhåndsvisning'); };
      }
    }
    card.appendChild(link);
    return card;
  }

  function openPopup(key, region) {
    popupTitle.textContent = region.name;
    const bookmarks = REGION_BOOKMARKS[key] || [];
    popupBookmarksList.innerHTML = '';
    if (bookmarks.length) {
      bookmarks.forEach(b => popupBookmarksList.appendChild(renderBookmarkCard(b)));
    } else {
      const empty = document.createElement('p');
      empty.style.cssText = 'color: var(--text-dim); font-size: 0.9rem;';
      empty.textContent = 'Ingen forløb i denne region endnu.';
      popupBookmarksList.appendChild(empty);
    }
    bubbleWrap.classList.add('is-open');
    bubbleWrap.setAttribute('aria-hidden', 'false');
  }

  function closePopup() {
    bubbleWrap.classList.remove('is-open');
    bubbleWrap.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('.diagram-wrap path.clickable.active').forEach(p => p.classList.remove('active'));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bubbleWrap.classList.contains('is-open')) closePopup();
  });

  document.addEventListener('click', (e) => {
    if (!bubbleWrap.classList.contains('is-open')) return;
    if (popupBubble.contains(e.target)) return;
    if (e.target.closest('.diagram-wrap path.clickable')) return;
    closePopup();
  });

  const CENTER_FILL = '#B3E8D0'; /* Sprog i EUD – midterste overlap, bruges til at vise/skjule forløb */
  const DARK_LABEL_FILLS = ['black', '#000', '#000000', '#090909', '#231F20', '#333', '#333333', '#2d3748'];
  /* Rækkefølge til udfoldning: overlap først (4,5,6) → centrum → kronblade */
  const BLOOM_FILL_ORDER = ['#FFC8A1', '#B0CAE3', '#B3E7CB', '#B3E8D0', '#FEEFAE', '#B0F0F2', '#FEB5E2'];

  function setupSvg(svg) {
    if (!svg) return null;
    svg.classList.add('diagram-svg');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    const darkRect = svg.querySelector('rect[fill="#1E1E1E"]');
    if (darkRect) darkRect.remove();
    const paths = svg.querySelectorAll('path');
    let lastRegionIndex = null;
    paths.forEach(path => {
      if (path.closest('mask')) return;
      const fill = (path.getAttribute('fill') || '').trim().toLowerCase();
      const fillNorm = normalizeFill(path.getAttribute('fill'));
      const key = makeRegionKey(path.getAttribute('fill'));
      const stroke = (path.getAttribute('stroke') || '').trim();
      const isDarkLabel = DARK_LABEL_FILLS.some(d => fill === d || fill === d.toLowerCase());
      /* Stroke-ring uden egen fyld: animér sammen med den sidst sete region (oval/overlap) */
      if (!fill || fill === 'none') {
        if (stroke && lastRegionIndex !== null) {
          path.classList.add('bloom-petal', `bloom-petal-${lastRegionIndex}`);
        }
        return;
      }
      /* Bloom-klasse til udfoldning: hver region får sin rækkefølge */
      if (fillNorm) {
        const bloomIndex = BLOOM_FILL_ORDER.findIndex(c => c.toUpperCase() === fillNorm.toUpperCase());
        if (bloomIndex >= 0) {
          path.classList.add('bloom-petal', `bloom-petal-${bloomIndex}`);
          lastRegionIndex = bloomIndex;
        }
      }
      /* Sprog i EUD – centrum: klik viser/skjuler forløb */
      if (fillNorm && fillNorm.toUpperCase() === CENTER_FILL.toUpperCase()) {
        path.classList.add('clickable', 'center-toggle');
        path.dataset.centerToggle = '1';
        path.setAttribute('role', 'button');
        path.setAttribute('tabindex', '0');
        path.setAttribute('aria-label', 'Vis eller skjul forløb');
        path.addEventListener('mouseenter', () => {
          regionHint.textContent = diagramWrap.classList.contains('show-forloeb') ? 'Klik for at skjule forløb' : 'Klik for at vise forløb';
        });
        path.addEventListener('mouseleave', () => {
          if (!bubbleWrap.classList.contains('is-open')) regionHint.textContent = 'Klik på en region i diagrammet';
        });
        path.addEventListener('click', () => {
          const willShow = !diagramWrap.classList.contains('show-forloeb');
          swapDiagram(willShow);
        });
        path.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            path.click();
          }
        });
        return;
      }
      if (key && FILL_TO_REGION[key]) {
        path.classList.add('clickable');
        path.dataset.regionKey = key;
        path.addEventListener('mouseenter', () => {
          regionHint.textContent = FILL_TO_REGION[key].name;
        });
        path.addEventListener('mouseleave', () => {
          if (!bubbleWrap.classList.contains('is-open')) regionHint.textContent = 'Klik på en region i diagrammet';
        });
        path.addEventListener('click', () => {
          document.querySelectorAll('.diagram-wrap path.clickable.active').forEach(p => p.classList.remove('active'));
          path.classList.add('active');
          openPopup(key, FILL_TO_REGION[key]);
        });
      } else if (isDarkLabel) {
        path.classList.add('svg-label', 'bloom-label');
      }
    });
    return svg;
  }

  let svgClean = null;
  let svgWithForloeb = null;

  function swapDiagram(showForloeb) {
    if (svgClean) svgClean.classList.toggle('diagram-svg-active', !showForloeb);
    if (svgWithForloeb) svgWithForloeb.classList.toggle('diagram-svg-active', showForloeb);
    diagramWrap.classList.toggle('show-forloeb', showForloeb);
  }

  function updateFilterUI() {
    document.querySelectorAll('.postit[data-category]').forEach(el => {
      el.classList.toggle('is-filter', el.dataset.category === filterCategory);
    });
  }

  document.querySelectorAll('.postit[data-category]').forEach(el => {
    el.addEventListener('click', () => {
      const cat = el.dataset.category;
      const wasActive = filterCategory === cat;
      filterCategory = wasActive ? null : cat;
      try { localStorage.setItem(FILTER_KEY, filterCategory || ''); } catch {}
      updateFilterUI();
      buildForlobOverlay();
      if (wasActive) closePopup();
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  function buildForlobOverlay() {
    const overlay = document.getElementById('forlobOverlay');
    if (!overlay) return;
    overlay.innerHTML = '';
    /* Placering inde i ovalerne (centrum af hver region, % af diagram) */
    const positions = {
      '#FEB5E2': { left: '20%', top: '49%' },   /* Akademisk sprog – længere ud i venstre oval */
      '#B0F0F2': { left: '57%', top: '37%' },   /* Hverdagssprog – øverste højre */
      '#FEEFAE': { left: '65%', top: '75%' },   /* Fagsprog – nederste oval */
      '#B0CAE3': { left: '30%', top: '20%' },   /* Hverdags- og akademisk – top overlap */
      '#FFC8A1': { left: '33%', top: '76%' },   /* Fag- og akademisk – venstre overlap */
      '#B3E7CB': { left: '73%', top: '53%' }    /* Fag- og hverdagssprog – højre overlap */
    };
    Object.entries(REGION_BOOKMARKS).forEach(([key, bookmarks]) => {
      let filtered = filterCategory
        ? (bookmarks || []).filter(b => b.categories && b.categories.includes(filterCategory))
        : (bookmarks || []);
      if (filtered.length === 0) return;
      const pos = positions[key];
      if (!pos) return;
      const box = document.createElement('div');
      box.className = 'forlob-region-box' + (key === '#FEB5E2' ? ' forlob-box-akademisk' : '');
      box.style.left = pos.left;
      box.style.top = pos.top;
      filtered.forEach(b => {
        const hasLink = b.url && b.url !== '#';
        const item = document.createElement(hasLink ? 'a' : 'div');
        item.className = 'forlob-item' + (hasLink ? ' forlob-item-link' : '');
        if (hasLink) {
          item.href = b.url;
          item.target = '_blank';
          item.rel = 'noopener noreferrer';
        }
        const symbols = document.createElement('div');
        symbols.className = 'forlob-item-symbols';
        (b.categories || []).forEach(catId => {
          const sym = SYMBOL_MAP[catId];
          if (!sym) return;
          const def = SPROGFÆRDIGHEDER[catId];
          const span = document.createElement('span');
          span.className = `forlob-symbol ${sym} forlob-symbol-${catId}`;
          span.title = def ? `${def.udtryk} (${def.term}): ${def.factor}` : '';
          span.setAttribute('aria-label', def ? `${def.udtryk} – ${def.term}` : '');
          symbols.appendChild(span);
        });
        const title = document.createElement('span');
        title.className = 'forlob-item-title';
        title.textContent = b.title;
        item.appendChild(title);
        item.appendChild(symbols);
        box.appendChild(item);
      });
      overlay.appendChild(box);
    });
  }

  Promise.all([
    fetch('Assets/SprogBlomstenClean.svg').then(r => r.text()),
    fetch('Assets/SprogBlomsten.svg').then(r => r.text())
  ]).then(([cleanText, withForloebText]) => {
    const parser = new DOMParser();
    const cleanDoc = parser.parseFromString(cleanText, 'image/svg+xml');
    const withForloebDoc = parser.parseFromString(withForloebText, 'image/svg+xml');
    svgClean = setupSvg(cleanDoc.querySelector('svg'));
    svgWithForloeb = setupSvg(withForloebDoc.querySelector('svg'));

    const svgWrap = document.getElementById('diagramSvgWrap');
    if (svgWrap) {
      if (svgClean) svgWrap.appendChild(svgClean);
      if (svgWithForloeb) svgWrap.appendChild(svgWithForloeb);
    }
    swapDiagram(false);
    updateFilterUI();
    buildForlobOverlay();
  });
})();
