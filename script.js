// =============================================================
// WFTC site script
//  - Tab switching (Home / Cruise Details / Itinerary), hash-synced
//  - Config injection (data-cfg) with placeholder highlighting
//  - Countdown timer
//  - List/table rendering from config
//  - Phone/email href wiring (Royal Caribbean group line)
//  - Click tracking
//  - Sticky CTA visibility
// =============================================================
(function () {
  const cfg = window.cruiseConfig || {};

  // ----- Helpers -----
  function get(obj, path) {
    return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
  }
  function isPlaceholder(val) {
    return typeof val === 'string' && /\[[^\]]+\]/.test(val);
  }
  function escape(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
  function inject(el, val) {
    if (val == null) return;
    el.textContent = val;
    if (isPlaceholder(val)) el.classList.add('placeholder');
  }

  // ----- 1. Inject config values into [data-cfg] elements -----
  document.querySelectorAll('[data-cfg]').forEach(el => {
    inject(el, get(cfg, el.getAttribute('data-cfg')));
  });

  // ----- 2. Agent tel: / mailto: hrefs -----
  const phoneEl = document.getElementById('cd-agent-phone');
  if (phoneEl && cfg.agent && cfg.agent.phone && !isPlaceholder(cfg.agent.phone)) {
    const digits = String(cfg.agent.phone).replace(/[^\d+]/g, '');
    if (digits) phoneEl.setAttribute('href', 'tel:' + digits);
  }
  const emailEl = document.getElementById('cd-agent-email');
  if (emailEl && cfg.agent && cfg.agent.email && cfg.agent.email.indexOf('@') > -1) {
    const subject = encodeURIComponent('Windsor Forest Takeover Cruise inquiry');
    const body = encodeURIComponent('Group code: ' + (cfg.groupCode || ''));
    emailEl.setAttribute('href', 'mailto:' + cfg.agent.email + '?subject=' + subject + '&body=' + body);
  }
  const primaryCta = document.getElementById('cd-primary-cta');
  if (primaryCta && cfg.agent && cfg.agent.phone && !isPlaceholder(cfg.agent.phone)) {
    const digits = String(cfg.agent.phone).replace(/[^\d+]/g, '');
    if (digits) primaryCta.setAttribute('href', 'tel:' + digits);
  }

  // ----- 3. Promo video (facade pattern: poster + custom play
  //          button; iframe mounts on click with autoplay=1) -----
  const videoWrap = document.getElementById('video-wrap');
  function extractYouTubeId(url) {
    const m = String(url).match(/\/embed\/([A-Za-z0-9_-]+)/);
    return m ? m[1] : '';
  }
  if (videoWrap && cfg.promoVideoEmbedUrl) {
    const id = extractYouTubeId(cfg.promoVideoEmbedUrl);
    if (id) {
      const poster = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
      videoWrap.innerHTML =
        '<button class="video-facade" type="button" aria-label="Play promo video">' +
          '<img class="vp-poster" src="' + escape(poster) + '" alt="" loading="lazy" />' +
          '<span class="vp-overlay" aria-hidden="true"></span>' +
          '<span class="vp-play" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' +
          '</span>' +
        '</button>';
      const btn = videoWrap.querySelector('.video-facade');
      btn.addEventListener('click', () => {
        const sep = cfg.promoVideoEmbedUrl.indexOf('?') > -1 ? '&' : '?';
        const url = cfg.promoVideoEmbedUrl + sep + 'autoplay=1';
        videoWrap.innerHTML =
          '<iframe src="' + escape(url) + '" frameborder="0" ' +
          'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
          'allowfullscreen></iframe>';
      }, { once: true });
    }
  }

  // ----- 3b. Background images (hero + amenity cards) -----
  const imgs = cfg.images || {};
  if (imgs.hero) {
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.classList.add('hero-has-bg');
      hero.style.setProperty('--hero-bg-url', `url('${imgs.hero}')`);
    }
  }
  const amenityMap = {
    dining:        imgs.amenityDining,
    pools:         imgs.amenityPools,
    entertainment: imgs.amenityEntertainment
  };
  document.querySelectorAll('.amenity[data-amenity]').forEach(card => {
    const url = amenityMap[card.dataset.amenity];
    if (url) {
      card.style.backgroundImage = `url('${url}')`;
      card.setAttribute('data-has-bg', 'true');
    }
  });
  const experienceMap = {
    community:   imgs.experienceCommunity,
    destination: imgs.experienceDestination,
    ship:        imgs.experienceShip
  };
  document.querySelectorAll('.card[data-experience]').forEach(card => {
    const url = experienceMap[card.dataset.experience];
    if (url) {
      card.style.backgroundImage = `url('${url}')`;
      card.setAttribute('data-has-bg', 'true');
    }
  });

  // ----- 3d. Click-to-copy on the group-code pill -----
  document.querySelectorAll('[data-copy-code]').forEach(btn => {
    btn.addEventListener('click', () => {
      const valEl = btn.querySelector('.code-pill-value');
      const code = valEl ? valEl.textContent.trim() : '';
      if (!code || /^\[/.test(code)) return; // skip placeholders
      const done = () => {
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done).catch(() => {
          // fallback: select the text so user can copy manually
          const range = document.createRange();
          range.selectNodeContents(valEl);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        });
      }
    });
  });

  // ----- 3c. Photo credits (footer) -----
  const creditsEl = document.getElementById('photo-credits');
  if (creditsEl && Array.isArray(cfg.photoCredits) && cfg.photoCredits.length) {
    creditsEl.innerHTML =
      'Photography: ' +
      cfg.photoCredits.map(c => escape(c)).join(' &nbsp;&bull;&nbsp; ');
  }

  // ----- 4. What's Included / Not Included -----
  function renderBullets(elId, items) {
    const ul = document.getElementById(elId);
    if (!ul || !Array.isArray(items)) return;
    ul.innerHTML = items.map(item => {
      const isPh = isPlaceholder(item);
      const inner = isPh ? `<span class="inline-placeholder">${escape(item)}</span>` : escape(item);
      return `<li>${inner}</li>`;
    }).join('');
  }
  renderBullets('cd-included', cfg.included);
  renderBullets('cd-not-included', cfg.notIncluded);

  // ----- 5. Pricing table -----
  const priceBody = document.getElementById('cd-pricing-rows');
  if (priceBody && Array.isArray(cfg.staterooms)) {
    priceBody.innerHTML = cfg.staterooms.map(s => {
      const phClass = isPlaceholder(s.priceFrom) ? ' inline-placeholder' : '';
      const priceCell = isPlaceholder(s.priceFrom)
        ? `<span class="inline-placeholder">${escape(s.priceFrom)}</span>`
        : `<span class="price-from-label">From</span><span class="price-from">${escape(s.priceFrom)}</span>`;
      return `
        <tr>
          <td data-label="Stateroom" class="price-tier">${escape(s.tier)}</td>
          <td data-label="Starting price">${priceCell}</td>
        </tr>
      `;
    }).join('');
  }

  // ----- 6. Cancellation table -----
  const cancelBody = document.getElementById('cd-cancel-rows');
  if (cancelBody && Array.isArray(cfg.cancellation)) {
    cancelBody.innerHTML = cfg.cancellation.map(c => {
      const winCell  = isPlaceholder(c.window)  ? `<span class="inline-placeholder">${escape(c.window)}</span>`  : escape(c.window);
      const penCell  = isPlaceholder(c.penalty) ? `<span class="inline-placeholder">${escape(c.penalty)}</span>` : escape(c.penalty);
      return `
        <tr>
          <td data-label="Days prior to sailing">${winCell}</td>
          <td data-label="Penalty">${penCell}</td>
        </tr>
      `;
    }).join('');
  }

  // ----- 7. FAQ -----
  const faqList = document.getElementById('cd-faq-list');
  if (faqList && Array.isArray(cfg.faq)) {
    const faqItems = cfg.faq.slice();
    // Add conditional events FAQ if enabled
    if (cfg.eventsEnabled) {
      faqItems.push({
        q: "Are there private events or a separate event pass?",
        a: cfg.eventsCopy || "[EVENT_PASS_COPY]"
      });
    }
    faqList.innerHTML = faqItems.map((item, i) => {
      const qIsPh = isPlaceholder(item.q);
      const aIsPh = isPlaceholder(item.a);
      const qHtml = qIsPh ? `<span class="inline-placeholder">${escape(item.q)}</span>` : escape(item.q);
      const aHtml = aIsPh ? `<span class="inline-placeholder">${escape(item.a)}</span>` : escape(item.a);
      return `
        <details class="faq-item"${i === 0 ? ' open' : ''}>
          <summary>${qHtml}</summary>
          <div class="faq-answer">${aHtml}</div>
        </details>
      `;
    }).join('');
  }

  // ----- 8. Countdown (with subtle digit-flash on change) -----
  const target = new Date(cfg.sailDateStartISO || '2027-06-19T00:00:00').getTime();
  function pad(n) { return String(n).padStart(2, '0'); }
  function pad3(n) { return String(n).padStart(3, '0'); }
  function setDigit(el, val) {
    if (!el || el.textContent === val) return;
    el.textContent = val;
    el.classList.remove('flash');
    void el.offsetWidth; // force reflow so flash retriggers
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 380);
  }
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) return;
    const days = Math.floor(diff / 86400000);
    const hrs  = Math.floor((diff / 3600000) % 24);
    const mins = Math.floor((diff / 60000) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    setDigit(document.getElementById('cd-days'), pad3(days));
    setDigit(document.getElementById('cd-hrs'),  pad(hrs));
    setDigit(document.getElementById('cd-mins'), pad(mins));
    setDigit(document.getElementById('cd-secs'), pad(secs));
  }
  tick();
  setInterval(tick, 1000);

  // ----- 8b. Smooth FAQ accordion (animate native <details>) -----
  function setupSmoothFaq() {
    document.querySelectorAll('.faq-item').forEach(detail => {
      const summary = detail.querySelector('summary');
      const content = detail.querySelector('.faq-answer');
      if (!summary || !content) return;

      summary.addEventListener('click', (e) => {
        e.preventDefault();
        if (detail.classList.contains('is-animating')) return;
        const isOpen = detail.open;
        detail.classList.add('is-animating');

        if (isOpen) {
          const startH = content.scrollHeight;
          content.style.maxHeight = startH + 'px';
          content.style.opacity = '1';
          requestAnimationFrame(() => {
            content.style.maxHeight = '0px';
            content.style.opacity = '0';
            content.style.paddingBottom = '0px';
          });
          setTimeout(() => {
            detail.open = false;
            content.style.maxHeight = '';
            content.style.opacity = '';
            content.style.paddingBottom = '';
            detail.classList.remove('is-animating');
          }, 320);
        } else {
          detail.open = true;
          const endH = content.scrollHeight;
          content.style.maxHeight = '0px';
          content.style.opacity = '0';
          content.style.paddingBottom = '0px';
          requestAnimationFrame(() => {
            content.style.maxHeight = endH + 'px';
            content.style.opacity = '1';
            content.style.paddingBottom = '';
          });
          setTimeout(() => {
            content.style.maxHeight = '';
            content.style.opacity = '';
            detail.classList.remove('is-animating');
          }, 320);
        }
      });
    });
  }
  setupSmoothFaq();

  // ----- 8c. Scroll-reveal for cards & sections -----
  if ('IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.card, .amenity, .price-card, .cd-section, .trust-inner, .closing-quote, .section-title, .details-title'
    );
    revealTargets.forEach(el => el.classList.add('reveal'));

    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => revealObs.observe(el));
  }

  // ----- 9. Tab switching -----
  const tabLinks = document.querySelectorAll('.tab-link');
  const panels   = document.querySelectorAll('.tab-panel');

  function activateTab(name, opts) {
    opts = opts || {};
    tabLinks.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    panels.forEach(p => p.classList.toggle('active', p.id === 'tab-' + name));
    if (opts.scroll !== false) window.scrollTo({ top: 0, behavior: 'smooth' });
    if (history.replaceState) history.replaceState(null, '', '#tab=' + name);
  }

  tabLinks.forEach(t => {
    t.addEventListener('click', () => activateTab(t.dataset.tab));
  });
  document.querySelectorAll('[data-tab-link]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      activateTab(el.dataset.tabLink);
    });
  });

  // Switch to details tab when user clicks the #booking anchor from Home
  document.querySelectorAll('a[href="#booking"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      activateTab('details', { scroll: false });
      setTimeout(() => {
        const target = document.getElementById('booking');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    });
  });

  // Hash routing on load (any tab name)
  const tabMatch = location.hash.match(/tab=([a-z-]+)/i);
  if (tabMatch && tabMatch[1]) activateTab(tabMatch[1], { scroll: false });

  // ----- 10. Click tracking -----
  document.querySelectorAll('.cta-track').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-cta') || 'unknown';
      try {
        console.log('[WFTC CTA]', id, new Date().toISOString());
        // Hook in your analytics:
        // window.gtag && gtag('event', 'cta_click', { cta_id: id });
        // window.plausible && plausible('CTA Click', { props: { id } });
      } catch (e) {}
    });
  });

  // ----- 11. Sticky CTA: hide when Booking section visible -----
  const stickyCta = document.querySelector('.sticky-cta');
  const bookingSection = document.getElementById('booking');
  if (stickyCta && bookingSection && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        stickyCta.style.opacity = e.isIntersecting ? '0' : '1';
        stickyCta.style.pointerEvents = e.isIntersecting ? 'none' : 'auto';
      });
    }, { threshold: 0.2 });
    obs.observe(bookingSection);
  }
})();
