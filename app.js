/* ═══════════════════════════════════════════════════
   Nishanthini S — Portfolio v2
   Barba.js · GSAP · Lenis · Split Preloader
   Apple-level page transitions · Full mobile support
═══════════════════════════════════════════════════ */

/* ─── 0. Copy email ─── */
function copyEmail() {
  var email = 'thedesignernisha@gmail.com';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email);
  } else {
    var ta = document.createElement('textarea');
    ta.value = email; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
  }
  var toast = document.getElementById('email-toast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 2400);
  }
}

/* ─── 1. Theme — immediate IIFE ─── */
(function () {
  var saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

/* ─── 2. Globals ─── */
var isTouch        = window.matchMedia('(hover:none)').matches;
var isMobile       = window.innerWidth <= 768;
var reducedMotion  = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var pt             = document.getElementById('pt-main');
var ptLine         = document.getElementById('pt-line');
var nav            = document.getElementById('nav');
var bar            = document.getElementById('scroll-bar');
var preloader      = document.getElementById('preloader');

/* ─── 3. GSAP + Lenis ─── */
gsap.registerPlugin(ScrollTrigger);
var lenis = new Lenis({
  duration: isMobile ? 1.4 : 2.2,
  easing: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); },
  smoothTouch: false,
  syncTouch: false,
});
window.__lenis = lenis;
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
gsap.ticker.lagSmoothing(0);

/* ─── 4. Scroll bar ─── */
function setupScrollBar() {
  if (!bar) return;
  ScrollTrigger.getAll().filter(function (t) { return t._isBarProgress; }).forEach(function (t) { t.kill(); });
  var st = ScrollTrigger.create({
    trigger: 'body', start: 'top top', end: 'bottom bottom',
    onUpdate: function (self) { bar.style.transform = 'scaleX(' + self.progress + ')'; }
  });
  st._isBarProgress = true;
}

/* ─── 5. Nav ─── */
window.addEventListener('scroll', function () {
  if (nav) nav.classList.toggle('nav--scrolled', scrollY > 20);
}, { passive: true });
if (nav) nav.classList.toggle('nav--scrolled', scrollY > 20);

/* ─── 6. Cursor ─── */
(function () {
  if (isTouch) return;
  var dot  = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  var mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    gsap.to(dot, { x: mx, y: my, duration: 0.08, ease: 'none' });
  });
  (function lerpRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();
  document.addEventListener('mouseleave', function () { ring.classList.add('hidden'); dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', function () { ring.classList.remove('hidden'); dot.style.opacity = '1'; });
})();

/* ─── 7. Cursor hovers — re-bound on each page ─── */
function bindCursorHovers() {
  if (isTouch) return;
  var ring = document.getElementById('cursor-ring');
  if (!ring) return;
  document.querySelectorAll('a, button, .project-card, .chat-pill, .skill-tag, .stack-tag, .impact-card, .td-feature, .sp-card, .skill-card').forEach(function (el) {
    el.addEventListener('mouseenter', function () { ring.classList.add('hovering'); });
    el.addEventListener('mouseleave', function () { ring.classList.remove('hovering'); });
  });
}

/* ─── 8. Theme toggle ─── */
var toggleBtn = document.getElementById('theme-toggle');
if (toggleBtn) {
  toggleBtn.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ─── 9. Magnetic buttons — re-bound on each page ─── */
function bindMagnetic() {
  if (isTouch) return;
  document.querySelectorAll('.btn-hero, .btn-primary, .btn-outline, .btn-ghost, .nav-resume').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width / 2) * 0.3,
        y: (e.clientY - r.top  - r.height / 2) * 0.3,
        duration: 0.3, ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', function () {
      gsap.to(btn, { x: 0, y: 0, duration: 0.65, ease: 'expo.out' });
    });
  });
}

/* ─── 10. Anchor scroll ─── */
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[href^="#"]');
  if (!a) return;
  var target = document.querySelector(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset: -72, duration: 1.6 });
  } else {
    window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 72, behavior: 'smooth' });
  }
});

/* ─── 11. Text scramble ─── */
function scramble(el, finalText, duration) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var totalFrames = Math.round((duration || 1800) / 40);
  var frame = 0;
  var timer = setInterval(function () {
    var progress = frame / totalFrames;
    el.textContent = finalText.split('').map(function (ch, i) {
      if (ch === ' ') return ' ';
      if (i < progress * finalText.length) return ch;
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    frame++;
    if (frame > totalFrames) { el.textContent = finalText; clearInterval(timer); }
  }, 40);
}

/* ═══════════════════════════════════════════════════
   12. SPA ROUTER — Zero-network, instant page swap
   No Barba. No XHR. DOM is already there.
   All 3 pages live in index.html as .page-view divs.
═══════════════════════════════════════════════════ */
var currentPage = 'home';
var navTransitioning = false;

function navigateTo(to, pushState) {
  if (to === currentPage || navTransitioning) return;
  if (pushState === undefined) pushState = true;
  navTransitioning = true;

  var isGoingHome = to === 'home';
  var coverDur  = reducedMotion ? 0.01 : (isMobile ? 0.34 : 0.40);
  var exitDur   = reducedMotion ? 0.01 : (isMobile ? (isGoingHome ? 0.48 : 0.46) : (isGoingHome ? 0.58 : 0.54));

  /* Reset scroll bar */
  bar && (bar.style.transform = 'scaleX(0)');

  /* Accent stripe L → R */
  gsap.fromTo(ptLine,
    { scaleX: 0, transformOrigin: 'left center' },
    { scaleX: 1, duration: reducedMotion ? 0.01 : 0.14, ease: 'power4.in' }
  );

  /* Dark curtain rises from bottom */
  gsap.fromTo(pt,
    { yPercent: 100 },
    {
      yPercent: 0, duration: coverDur, ease: 'power4.inOut',
      delay: reducedMotion ? 0 : 0.04,
      onComplete: function () {

        /* ── Swap pages (instant, curtain hides it) ── */
        var oldEl = document.getElementById('page-' + currentPage);
        var newEl = document.getElementById('page-' + to);
        if (oldEl) oldEl.classList.remove('page-view--active');
        if (newEl) newEl.classList.add('page-view--active');

        /* Body class for CS-page specific styles */
        if (isGoingHome) {
          document.body.classList.remove('cs-page');
          if (nav) nav.classList.remove('nav--light');
        } else {
          document.body.classList.add('cs-page');
          if (nav) nav.classList.add('nav--light');
        }

        /* Scroll to top instantly */
        if (lenis) lenis.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);

        /* Update URL hash (works on file:// and GitHub Pages) */
        currentPage = to;
        if (pushState) {
          var hash = to === 'home' ? '' : '#' + to;
          history.pushState({ page: to }, '', window.location.pathname + hash);
        }

        /* Init new page animations */
        initPage(to, newEl);

        /* Curtain exits — direction aware */
        gsap.fromTo(pt,
          { yPercent: 0 },
          {
            yPercent: isGoingHome ? -100 : 100,
            duration: exitDur, ease: 'expo.inOut',
            delay: reducedMotion ? 0 : 0.03,
            onComplete: function () { navTransitioning = false; }
          }
        );

        /* Stripe retreats R */
        gsap.to(ptLine, {
          scaleX: 0, transformOrigin: 'right center',
          duration: 0.18, ease: 'power3.in', delay: 0.22
        });
      }
    }
  );
}

/* ── Click delegation for [data-go] ── */
document.addEventListener('click', function (e) {
  var el = e.target.closest('[data-go]');
  if (!el) return;
  e.preventDefault();
  var to   = el.dataset.go;
  var hash = el.dataset.hash;
  if (to === currentPage) {
    /* Same page — just scroll to hash if present */
    if (hash) {
      var target = document.getElementById(hash);
      if (target && lenis) lenis.scrollTo(target, { offset: -72, duration: 1.6 });
    }
    return;
  }
  if (hash) {
    /* Navigate to page, then scroll after transition */
    navigateTo(to);
    setTimeout(function () {
      var target = document.getElementById(hash);
      if (target && lenis) lenis.scrollTo(target, { offset: -72, duration: 1.4 });
    }, isMobile ? 620 : 680);
  } else {
    navigateTo(to);
  }
});

/* ── Browser back/forward ── */
window.addEventListener('popstate', function (e) {
  var page = (e.state && e.state.page) || 'home';
  navigateTo(page, false);
});

/* ═══════════════════════════════════════════════════
   13. PER-PAGE INIT — called on every navigation
═══════════════════════════════════════════════════ */
function initPage(namespace, container) {
  /* Kill all old scroll triggers */
  ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
  setupScrollBar();

  /* Rebind per-page interactions */
  bindMagnetic();
  bindCursorHovers();

  if (namespace === 'home') {
    initHero();
    initChatbot();
    setupHomeScrollAnimations();
  } else {
    initCSPage(namespace);
    setupCSScrollAnimations(namespace);
  }

  setupCommonScrollAnimations();

  /* Recalculate positions after DOM paint */
  requestAnimationFrame(function () {
    ScrollTrigger.refresh(true);
  });
}

/* ─── 14. Hero animations ─── */
function initHero() {
  var words = document.querySelectorAll('.hero-headline .hero-word');
  if (words.length) {
    gsap.fromTo(words,
      { y: 28, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'expo.out',
        delay: reducedMotion ? 0 : 0.14,
        onComplete: function () {
          document.querySelectorAll('.hero-word[data-shimmer]').forEach(function (w, i) {
            setTimeout(function () {
              w.classList.add('shimmer');
              setTimeout(function () { w.classList.remove('shimmer'); }, 600);
            }, i * 120);
          });
          var accent = document.querySelector('.hero-word--accent');
          if (accent) gsap.fromTo(accent, { scale: 1 }, { scale: 1.04, duration: 0.3, ease: 'back.out(2)', yoyo: true, repeat: 1 });
        }
      }
    );
  }

  gsap.fromTo(
    ['.hero-eyebrow', '.hero-sub', '.hero-chat', '.hero-ctas', '.scroll-hint'],
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, stagger: 0.09, ease: 'expo.out', delay: reducedMotion ? 0 : 0.58 }
  );

  document.querySelectorAll('.stat-val[data-count]').forEach(function (el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var obj = { n: 0 };
    gsap.to(obj, {
      n: target * 1.04, duration: 2.2, ease: 'power3.out', delay: 1.4,
      onUpdate: function () { el.textContent = Math.round(obj.n) + suffix; },
      onComplete: function () {
        gsap.to(obj, {
          n: target, duration: 0.45, ease: 'power2.inOut',
          onUpdate: function () { el.textContent = Math.round(obj.n) + suffix; },
          onComplete: function () { el.textContent = Math.round(target) + suffix; }
        });
      }
    });
  });
}

/* ─── 15. CS page hero ─── */
function initCSPage(namespace) {
  var lines = document.querySelectorAll('.cs-title .clip-inner');
  if (lines.length) {
    gsap.fromTo(lines,
      { y: '112%', skewY: 1.2 },
      { y: '0%', skewY: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out', delay: reducedMotion ? 0 : 0.16 }
    );
  }
  gsap.fromTo(
    ['.cs-eyebrow', '.cs-subtitle', '.cs-meta'],
    { y: 32, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.1, stagger: 0.11, ease: 'expo.out', delay: reducedMotion ? 0 : 0.56 }
  );
  if (namespace === 'tokendrift') {
    initTokenDriftDemo();
    initPipelineAnim();
  }
}

/* ─── 16. Home scroll animations ─── */
function setupHomeScrollAnimations() {
  /* Project cards */
  gsap.utils.toArray('.project-card').forEach(function (card, i) {
    gsap.fromTo(card, { y: 70, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: i * 0.06,
      scrollTrigger: { trigger: card, start: 'top 85%', once: true }
    });
  });

  /* Image parallax — desktop only */
  if (!isMobile && !isTouch) {
    gsap.utils.toArray('.project-img-wrap').forEach(function (wrap) {
      var img = wrap.querySelector('img');
      if (!img) return;
      gsap.fromTo(img, { y: 0 }, {
        y: -75, ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: 1.8 }
      });
    });
  }

  /* Working project cards */
  gsap.utils.toArray('.sp-card').forEach(function (card, i) {
    gsap.fromTo(card, { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.0, ease: 'expo.out', delay: i * 0.1,
      scrollTrigger: { trigger: card, start: 'top 88%', once: true }
    });
  });

  /* Skill cards — stagger entrance */
  gsap.utils.toArray('.skill-card').forEach(function (card, i) {
    gsap.fromTo(card, { y: 44, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.75, ease: 'expo.out',
      delay: (i % 3) * 0.07,
      scrollTrigger: { trigger: card, start: 'top 88%', once: true }
    });
  });

  /* Skill cards — 3D tilt (desktop only) */
  if (!isTouch && !isMobile) {
    document.querySelectorAll('.skill-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
        var y = ((e.clientY - r.top)  / r.height - 0.5) * -8;
        gsap.to(card, { rotateY: x, rotateX: y, duration: 0.25, ease: 'power2.out', transformPerspective: 600 });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.65, ease: 'expo.out' });
      });
    });
  }

  /* Project card tilt */
  if (!isTouch && !isMobile) {
    document.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top)  / r.height - 0.5;
        gsap.to(card, { rotateY: x * 4, rotateX: -y * 4, duration: 0.4, ease: 'power2.out', transformPerspective: 1000 });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.9, ease: 'expo.out' });
      });
    });
  }

  /* Process flow — sequential node → connector → text timeline */
  (function () {
    var steps = gsap.utils.toArray('.flow-step');
    if (!steps.length) return;
    var flowTL = gsap.timeline({ paused: true });

    steps.forEach(function (step, idx) {
      var node  = step.querySelector('.flow-node');
      var line  = step.querySelector('.flow-connector-line');
      var texts = step.querySelectorAll('h3, p');
      var off   = idx === 0 ? 0 : '>-0.1';

      if (node) {
        flowTL.fromTo(node, { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(2.4)',
            onComplete: function () {
              gsap.fromTo(node, { boxShadow: '0 0 0 0 var(--accent-dim)' },
                { boxShadow: '0 0 0 14px rgba(255,122,61,0)', duration: 0.8, ease: 'power2.out' });
            }
          }, off);
      }
      if (line) {
        flowTL.fromTo(line, { scaleX: 0 },
          { scaleX: 1, duration: 0.55, ease: 'power2.inOut',
            onComplete: function () { line.classList.add('trail-active'); }
          }, '>-0.05');
      }
      if (texts.length) {
        flowTL.fromTo(texts, { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out' }, '>-0.3');
      }
      if (node && !isTouch) {
        step.addEventListener('mouseenter', function () {
          gsap.to(node, { scale: 1.14, boxShadow: '0 0 0 10px var(--accent-dim)', duration: 0.3, ease: 'back.out(2.5)' });
        });
        step.addEventListener('mouseleave', function () {
          gsap.to(node, { scale: 1, boxShadow: '0 0 0 0 rgba(255,122,61,0)', duration: 0.55, ease: 'elastic.out(1,.55)' });
        });
      }
    });
    ScrollTrigger.create({
      trigger: '.process-flow', start: 'top 78%', once: true,
      onEnter: function () { flowTL.play(); }
    });
  })();

  /* About grid */
  var ag = document.querySelector('.about-grid');
  if (ag) {
    gsap.fromTo(ag, { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: ag, start: 'top 83%', once: true }
    });
  }

  /* About photo card spring entrance */
  var photoCard = document.getElementById('about-photo-card');
  if (photoCard) {
    gsap.set(photoCard, { opacity: 0 });
    ScrollTrigger.create({
      trigger: photoCard, start: 'top 85%', once: true,
      onEnter: function () {
        gsap.fromTo(photoCard,
          { rotation: -7, opacity: 0, y: 30 },
          { rotation: -2.5, opacity: 1, y: 0, duration: 1.0, ease: 'back.out(1.4)' }
        );
      }
    });
  }

  /* Skill tags spring in */
  document.querySelectorAll('.skill-tags').forEach(function (block) {
    gsap.fromTo(block.querySelectorAll('.skill-tag'), { y: 16, opacity: 0, scale: 0.92 }, {
      y: 0, opacity: 1, scale: 1, duration: 0.45, stagger: 0.04, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: block, start: 'top 86%', once: true }
    });
  });

  /* Tool bars fill */
  document.querySelectorAll('.tool-fill').forEach(function (fill) {
    var w = fill.style.width;
    gsap.set(fill, { width: '0%' });
    ScrollTrigger.create({
      trigger: fill, start: 'top 88%', once: true,
      onEnter: function () {
        gsap.to(fill, { width: w, duration: 1.2, ease: 'expo.out' });
      }
    });
  });

  /* Marquee */
  var track = document.querySelector('.marquee-track');
  if (track) {
    var mTween = gsap.to(track, { x: '-50%', duration: 30, ease: 'none', repeat: -1 });
    var mWrap = track.parentElement;
    mWrap.addEventListener('mouseenter', function () { mTween.pause(); });
    mWrap.addEventListener('mouseleave', function () { mTween.resume(); });
  }

  /* Footer headline clip reveal */
  var fh = document.querySelector('.footer-headline');
  if (fh) {
    var flines = fh.querySelectorAll('.clip-inner');
    if (flines.length) {
      gsap.fromTo(flines, { y: '115%' }, {
        y: '0%', duration: 1.1, stagger: 0.1, ease: 'expo.out',
        scrollTrigger: { trigger: fh, start: 'top 86%', once: true }
      });
    }
  }
}

/* ─── 17. CS scroll animations ─── */
function setupCSScrollAnimations(namespace) {
  /* Line reveals */
  document.querySelectorAll('.line-reveal').forEach(function (block) {
    var lines = block.querySelectorAll('.clip-inner');
    if (!lines.length) return;
    gsap.fromTo(lines, { y: '115%' }, {
      y: '0%', duration: 1.1, stagger: 0.1, ease: 'expo.out',
      scrollTrigger: { trigger: block, start: 'top 83%', once: true }
    });
  });

  /* Section h2 word-by-word reveal */
  document.querySelectorAll('.cs-text-inner h2').forEach(function (h2) {
    var words = h2.textContent.split(' ');
    h2.innerHTML = words.map(function (w) {
      return '<span class="word-wrap" style="display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.04em">' +
             '<span class="word-inner" style="display:inline-block">' + w + '&nbsp;</span></span>';
    }).join('');
    gsap.fromTo(h2.querySelectorAll('.word-inner'), { y: '105%', opacity: 0 }, {
      y: '0%', opacity: 1, duration: 0.85, stagger: 0.045, ease: 'expo.out',
      scrollTrigger: { trigger: h2, start: 'top 86%', once: true }
    });
  });

  /* CS insight counters */
  gsap.utils.toArray('.cs-insight-num[data-count]').forEach(function (el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: function () {
        gsap.to({ n: 0 }, {
          n: target, duration: 2, ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.round(this.targets()[0].n) + suffix; }
        });
      }
    });
  });

  /* TokenDrift editor reveal */
  if (namespace === 'tokendrift') {
    var tdEd = document.getElementById('td-editor');
    if (tdEd) {
      ScrollTrigger.create({
        trigger: tdEd, start: 'top 82%', once: true,
        onEnter: function () {
          gsap.fromTo('#td-editor',      { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'expo.out' });
          gsap.fromTo('#td-score-panel', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'expo.out', delay: 0.12 });
        }
      });
    }
  }
}

/* ─── 18. Common scroll animations (all pages) ─── */
function setupCommonScrollAnimations() {
  ['.cs-img-card', '.impact-card', '.td-feature', '.cs-stack-tags',
   '.cs-insight', '.cs-list', '.tool-item', '.cs-retrospect'].forEach(function (sel) {
    gsap.utils.toArray(sel).forEach(function (el) {
      gsap.fromTo(el, { y: 36, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.95, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 87%', once: true }
      });
    });
  });

  gsap.utils.toArray('.section-label').forEach(function (el) {
    gsap.fromTo(el, { opacity: 0, x: -14 }, {
      opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });

  document.querySelectorAll('.flow-node').forEach(function (node) {
    ScrollTrigger.create({
      trigger: node, start: 'top 80%', once: true,
      onEnter: function () {
        node.classList.add('is-pulsing');
        setTimeout(function () { node.classList.remove('is-pulsing'); }, 4500);
      }
    });
  });
}

/* ═══════════════════════════════════════════════════
   19. PRELOADER — split panel reveal
═══════════════════════════════════════════════════ */
function runPreloader(onDone) {
  var pWords    = preloader.querySelectorAll('.pre-word');
  var pLogo     = preloader.querySelector('.pre-logo');
  var panelTop  = preloader.querySelector('.pre-panel--top');
  var panelBtm  = preloader.querySelector('.pre-panel--btm');

  var ptl = gsap.timeline();

  /* Phase 1 — words cycle (thin, uppercase, editorial) */
  pWords.forEach(function (w) {
    ptl.fromTo(w,
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.34, ease: 'power3.out' }
    ).to(w,
      { y: -28, opacity: 0, duration: 0.22, ease: 'power2.in', delay: 0.14 }
    );
  });

  /* Phase 2 — N. logo springs into center, large and bold */
  if (pLogo) {
    ptl.fromTo(pLogo,
      { opacity: 0, scale: 0.68, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'back.out(2.4)' },
      '+=0.06'
    );
    /* Subtle breath — shows it's alive */
    ptl.to(pLogo,
      { scale: 1.05, duration: 0.38, ease: 'power1.inOut', yoyo: true, repeat: 1 },
      '+=0.2'
    );
  }

  /* Phase 3 — SPLIT: top panel flies UP, bottom panel falls DOWN */
  /* Both panels animate simultaneously — curtain opens like a stage */
  if (panelTop && panelBtm) {
    ptl.to(panelTop, { yPercent: -100, duration: 1.05, ease: 'expo.inOut' }, '+=0.24');
    ptl.to(panelBtm, {
      yPercent: 100, duration: 1.05, ease: 'expo.inOut',
      onComplete: function () {
        preloader.style.display = 'none';
        onDone();
      }
    }, '<');
    /* N. logo dissolves as panels split */
    if (pLogo) {
      ptl.to(pLogo, { opacity: 0, scale: 0.86, duration: 0.48, ease: 'power2.in' }, '<0.18');
    }
  } else {
    /* Fallback */
    ptl.to(preloader, { opacity: 0, duration: 0.4, onComplete: function () {
      preloader.style.display = 'none';
      onDone();
    }});
  }
}

/* ═══════════════════════════════════════════════════
   20. CHATBOT — Professional KB · Scoring Engine · Context Memory
   85+ entries · topic-tagged · longest-key wins
═══════════════════════════════════════════════════ */

/* Context memory */
var chatCtx = { topic: null, count: 0 };

/* DOM refs — re-queried on each home enter via initChatbot() */
var chatMessages, chatPillsWrap, chatInput, chatSendBtn;

var chatKB = [

  /* ══ GREETINGS ══ */
  { topic:'greeting', keys:['hello','hi there','hey there','good morning','good afternoon','good evening','greetings','howdy','hiya','namaste','what\'s up','wassup'],
    answer:"Hey! 👋 I'm Nishanthini's portfolio bot. I know her work, process, and availability inside-out. What would you like to know?" },
  { topic:'greeting', keys:['hi','hey','yo','sup','helo','hii'],
    answer:"Hey! Welcome. Ask me anything about Nishanthini — projects, skills, availability, or what makes her different." },
  { topic:'greeting', keys:['how are you','how are you doing','how\'s it going','you good','how\'s everything'],
    answer:"Running smooth! I'm here to tell you about Nishanthini. Where do you want to start — her projects, her process, or her availability?" },
  { topic:'greeting', keys:['nice to meet','good to meet','pleased to meet','great to meet'],
    answer:"Likewise! I can walk you through Nishanthini's work, her thinking, or just tell you whether she's open to opportunities right now." },

  /* ══ IDENTITY ══ */
  { topic:'identity', keys:['who is nishanthini','who is nisha','about nishanthini','about nisha','tell me about her','tell me about nishanthini','introduce yourself','introduce her','who she is','who are you'],
    answer:"Nishanthini S is a product designer at the seam of design and engineering.\n\nKnown for:\n• Giottus Futures — 4 crore CVD users unlocked, 102s → 34s task time\n• TokenDrift — VS Code extension enforcing design systems across 40+ devs\n• Chennai Metro — 500K+ daily commuters, 5-second comprehension\n• Sanchar Saathi — Gov of India portal, 35% faster task completion\n\nCurrently pursuing B.Des at HITS Chennai, graduating 2027." },
  { topic:'identity', keys:['what does nisha do','what does she do','what she does','what nisha does','what does nishanthini do','her role','what is her job','what she is about'],
    answer:"Nishanthini is a product designer who specialises in:\n• FinTech UX (crypto trading, financial platforms)\n• Accessibility — WCAG 2.1 AA + IS 17802:2021\n• Design Systems — Figma to production\n• AI Interface Design — LLM UX, agent flows\n• Developer Tooling — TypeScript, VS Code extensions\n\nResearch-first, ships clean, measures every outcome." },
  { topic:'current', keys:['what is she currently doing','what is she doing now','what nisha is doing','what is nisha doing','currently working on','what is she working on now','what is she up to','what is she focused on','current work','current projects','right now today'],
    answer:"Right now Nishanthini is:\n• Deep in AI interface design — trustworthy UX for LLM-powered products\n• Refining the Chennai Metro accessibility system\n• Monitoring WCAG 3.0 developments closely\n\nAnd actively open to the right opportunity in FinTech, AI products, or design systems." },
  { topic:'background', keys:['her background','her story','how did she start','why design','what got her into design','her journey','her origin','her path','how she became a designer'],
    answer:"Nishanthini got into design because she was frustrated by software that was technically functional but humanly broken.\n\nThat frustration became a career: Giottus locked out 4 crore users nobody noticed. Government portals that rural users couldn't navigate. Design systems that engineers ignored the moment they were under deadline.\n\nShe designs for the users nobody else thought to include." },
  { topic:'education', keys:['education','college','university','degree','where she studied','hits','hindustan','bdes','b.des','graduating','qualification','academic background','where did she go to college'],
    answer:"Pursuing B.Des (Product Design) at Hindustan Institute of Technology and Science (HITS), Chennai — graduating 2027.\n\nHer real education has been shipping products. Giottus and TokenDrift taught her what no classroom teaches — how to defend a decision under pressure, measure an outcome in production, and start over when research proves you wrong." },
  { topic:'philosophy', keys:['her philosophy','design philosophy','her approach','what drives her','her thinking','her mindset','how she thinks about design','her values','her design values'],
    answer:"Design is problem architecture, not decoration.\n\nNishanthini's process always starts with: who is excluded? Then: what's the right structure before any visual? Then: what does 'better' look like as a metric?\n\nEvery project — from a VS Code extension to a government portal — runs through that same filter." },
  { topic:'personality', keys:['her personality','interests','hobbies','outside work','what she likes','beyond design','who she is as a person'],
    answer:"Systems thinker on and off the clock. Fascinated by how complex things fail — and how small structural changes prevent it.\n\nInto typography, programming languages as design decisions, and cities as UX systems. That last one is why Chennai Metro hit different." },
  { topic:'goals', keys:['goals','ambition','vision','career goal','where does she want to go','what she wants to build','long term','her dream'],
    answer:"Build systems that outlast her involvement. Work on products where design decisions have real stakes — not 'change a button colour' decisions, but 'this architecture includes or excludes 4 crore people' level decisions.\n\nThat's the work she's looking for more of." },

  /* ══ PROJECTS OVERVIEW ══ */
  { topic:'projects', keys:['all her projects','all her work','everything she has built','everything she built','her work','her works','her portfolio','her projects','her case studies','what has she built','what has she designed','list her projects','her body of work','show me everything','show all work'],
    answer:"Nishanthini's full body of work:\n\n① Giottus Futures — Crypto trading redesign. 4 crore CVD users unlocked. Task time 102s → 34s (67% faster).\n\n② TokenDrift — VS Code extension. 40+ devs, 12 products, 500+ design values enforced at the PR level.\n\n③ Chennai Metro — 500K+ daily commuters. 5-second comprehension. Zero instructions needed.\n\n④ Sanchar Saathi (Gov. of India) — 35% faster task completion. 42% better findability.\n\nAsk me about any one in depth!" },
  { topic:'projects', keys:['best project','most impressive','flagship','strongest project','most impactful','highlight','her best work','what is her best','show me her best'],
    answer:"Giottus Futures is the flagship.\n\nIt started as a navigation fix. It ended up unlocking 4 crore CVD users no Indian fintech had ever reached — a market exclusion problem nobody had noticed.\n\nTask time: 102s → 34s. Order abandonment: 0% post-launch. WCAG 2.1 AA + IS 17802:2021. That's the story." },
  { topic:'projects', keys:['show me work','see work','see projects','case study','her portfolio work','view projects','scroll down'],
    answer:"Scroll down ↓ — Giottus Futures and TokenDrift are full case studies with research, decisions, and outcomes documented. Chennai Metro and Sanchar Saathi are in the Working Projects section.\n\nEverything is documented — not just 'here's what it looks like'." },

  /* ══ GIOTTUS FUTURES ══ */
  { topic:'giottus', keys:['tell me about giottus','giottus overview','giottus project','giottus futures'],
    answer:"Giottus Futures: Nishanthini's most complex project.\n\nA crypto futures trading platform with a fragmented 3-tab interface — users juggled positions, P&L, and order forms across tabs simultaneously. She unified it into a single view.\n\nTask time: 102s → 34s (67% reduction). Then the unexpected: the IA fix made colour-reliance redundant, unlocking 4 crore CVD users. First Indian fintech to do it.\n\nWCAG 2.1 AA + IS 17802:2021. Order abandonment: 0%." },
  { topic:'giottus', keys:['giottus problem','what was the problem with giottus','why redesign giottus','giottus challenge','giottus pain point','giottus issue','what problem did giottus have'],
    answer:"Two problems — one known, one discovered during research.\n\nKnown: the 3-tab layout forced traders to hold too much in working memory. Under volatile conditions, that fragmentation caused real financial errors.\n\nDiscovered: 40% of the users they were losing had colour vision deficiency. The platform was built on colour-coded P&L — for CVD users, it was unusable.\n\nTwo problems. One architectural fix solved both." },
  { topic:'giottus', keys:['giottus solution','giottus redesign','what she built for giottus','giottus approach','how she solved giottus','giottus design','giottus ui'],
    answer:"The fix: one unified view — positions, P&L, order form, and market data on a single surface. Cognitive load from 7 simultaneous elements to 3.\n\nThen a 3-mode accessibility system: Default, Colorblind, and Greyscale — all via a single CSS custom property. One Figma system, three WCAG-compliant colour treatments.\n\nNo band-aid overlays. No separate 'colorblind version'. Architecture, not accommodation." },
  { topic:'giottus', keys:['giottus results','giottus metrics','giottus outcome','giottus numbers','giottus impact','102 seconds','34 seconds','67 percent','4 crore','order abandonment','giottus data'],
    answer:"Giottus results:\n\n• Task completion: 102s → 34s (67% faster)\n• Order abandonment: 0% post-launch (was non-trivial before)\n• 4 crore CVD users newly served — first in Indian fintech\n• Validated with 24 real traders over 5 days\n• WCAG 2.1 AA + IS 17802:2021 compliant\n• No support ticket spike after launch (rare after major redesigns)" },
  { topic:'giottus', keys:['giottus accessibility','giottus colorblind','giottus cvd','colorblind trading','cvd fintech','color vision deficiency','wcag fintech','accessibility in trading','4 crore cvd'],
    answer:"The accessibility story is the one nobody expected.\n\nNishanthini wasn't hired to fix CVD accessibility — she was hired to fix navigation. But research showed colour was load-bearing: red/green P&L, colour-coded positions. For CVD users: completely unusable.\n\nThe IA unification made colour decorative instead of structural. That's when she added the 3-mode system. First Indian fintech at WCAG 2.1 AA. Zero engineering custom paths — just CSS custom properties." },
  { topic:'giottus', keys:['giottus research','giottus process','how she researched giottus','giottus timeline','how long did giottus take','giottus user interviews','giottus testing'],
    answer:"One week of pure research before any wireframe.\n\n• Competitive audit of 12 trading platforms\n• 8 user interviews — casual traders to institutional\n• Heuristic audit against WCAG 2.1\n\nKey insight that changed everything: traders were screenshotting the UI to reference data while simultaneously placing orders. That's the failure state — a product so fragmented that users invented their own workaround." },

  /* ══ TOKENDRIFT ══ */
  { topic:'tokendrift', keys:['tokendrift','token drift','tell me about tokendrift','tokendrift overview','tokendrift project','the vs code extension','token drift extension'],
    answer:"TokenDrift: a VS Code extension Nishanthini built in TypeScript.\n\nProblem: 40+ developers across 12 products were writing hard-coded values (#2563eb, 16px) instead of design tokens. 500+ inconsistent values in production.\n\nTokenDrift detects drift in real-time, maps values to tokens, suggests replacements in one keystroke, and gates PRs in CI.\n\nOpen source. W3C DTCG standard. Runs under 200ms per file." },
  { topic:'tokendrift', keys:['tokendrift problem','why build tokendrift','what problem does tokendrift solve','design drift','design token problem','why tokens matter','what is design drift'],
    answer:"The problem: every modern design system has tokens. Engineers ignore them under deadline pressure.\n\nThey write #2563eb instead of var(--color-primary). Each instance is small. Compounded across 40 devs and 12 products over months: 500+ inconsistent values. The design system becomes technically live but practically irrelevant.\n\nNishanthini's diagnosis: not a people problem — a systems problem. No feedback loop existed. TokenDrift is the feedback loop." },
  { topic:'tokendrift', keys:['tokendrift how it works','tokendrift solution','tokendrift features','yellow underline','blue underline','tokendrift ci gate','tokendrift dashboard','how does tokendrift work'],
    answer:"Three layers of enforcement:\n\n① Yellow underline — hard-coded value matches an existing token. Hover to see which. Ctrl+. to replace.\n\n② Blue underline — value appears 3+ times but has no token yet. Suggests creating one, auto-generates the DTCG entry.\n\n③ CI gate — GitHub Actions step runs the same analysis on every PR. Fail above a drift score threshold or post a comment. Design compliance becomes a hard gate.\n\n+ Live dashboard: drift score 0–100, most-violated tokens, file breakdown." },
  { topic:'tokendrift', keys:['tokendrift results','tokendrift impact','tokendrift metrics','40 developers','12 products','500 values','design system compliance','tokendrift numbers','tokendrift outcome'],
    answer:"Context: 40+ developers, 12 products, 500+ inconsistent design values before TokenDrift.\n\nThe shift: enforcement moved from 'hope a designer catches it in review' to 'the editor catches it as you type, and CI blocks it if it slips through'.\n\nThe drift score (0–100) gave teams a shared definition of 'good' across design and engineering — for the first time, both teams were measuring the same thing." },
  { topic:'tokendrift', keys:['tokendrift tech','tokendrift typescript','vscode api','language server','lsp protocol','dtcg format','w3c token format','tokendrift stack','how was tokendrift built','typescript extension'],
    answer:"Tech stack:\n• TypeScript\n• VS Code Extension API\n• VS Code Language Server Protocol (LSP)\n• GitHub Actions (CI gate)\n• DTCG W3C Format (token file standard)\n• Node.js + Jest (unit tests)\n\nDTCG format was a deliberate choice — W3C standard means it works natively with Figma Tokens, Style Dictionary, and Theo. Build on standards, not lock-in. Analysis runs under 200ms on 500+ token codebases." },
  { topic:'tokendrift', keys:['tokendrift github','tokendrift open source','tokendrift code','where is tokendrift','find tokendrift','tokendrift repo'],
    answer:"Open source on GitHub: github.com/Designer-nisha/tokendrift\n\nThe TypeScript, LSP implementation, CI workflow, and dashboard are all public. Nishanthini builds in public. The code is part of the portfolio — not just the screenshots." },

  /* ══ CHENNAI METRO ══ */
  { topic:'metro', keys:['tell me about chennai metro','chennai metro project','metro overview','metro redesign','cmrl design','metro ux','metro','chennai metro'],
    answer:"Chennai Metro: redesigned the CMRL platform for 500K+ daily commuters.\n\nCore feature: a colour-coded train occupancy system (green/amber/red) so commuters can make platform decisions before the train arrives.\n\n7 of 8 test participants understood it within 5 seconds. Zero confusion. Zero instruction needed. Works across all literacy levels and language groups." },
  { topic:'metro', keys:['metro problem','chennai metro challenge','metro pain point','metro ux problem','metro issue','what was the problem with metro'],
    answer:"Commuters had no occupancy data for platform decisions — where to stand, which car to board. They defaulted to crowding the same doors, causing uneven platform congestion.\n\nThe design challenge: surface real-time occupancy in a way that works for someone with 4 seconds of attention, in Tamil or English, literate or not, on a 3G connection in peak hour." },
  { topic:'metro', keys:['metro solution','metro how it works','metro design solution','metro color system','occupancy system','metro approach','how she solved metro'],
    answer:"Colour-coded occupancy rings per car (green/amber/red), visible at a glance.\n\nNo numbers, no text required — just colour + icon. Built for visual literacy, not reading literacy. Used Figma + Gemini AI for rapid iteration across 12+ icon variants.\n\nFinal system: 3 states, 2 icons, zero instructions needed. Works for every user in the CMRL network." },
  { topic:'metro', keys:['metro results','metro testing','metro outcome','metro impact','5 seconds','metro user testing','500k commuters','7 of 8'],
    answer:"Testing results:\n• 7 of 8 participants grasped the system in under 5 seconds — without any instruction\n• The 1 edge case: hesitated on green vs amber distinction → fixed with icon reinforcement in the next iteration\n• Zero confusion across literacy levels and language groups\n\nScale: 500K+ daily commuters across the CMRL network." },

  /* ══ SANCHAR SAATHI ══ */
  { topic:'sanchar', keys:['tell me about sanchar saathi','sanchar saathi overview','sanchar saathi project','dot portal','government design','govt portal','sanchar'],
    answer:"Sanchar Saathi (DoT, Government of India): redesigned the national telecom consumer portal.\n\nResults: Task completion 35% faster. Findability improved 42% across the 20 most-used flows. IS 17802:2021 compliant.\n\nValidated across 5 distinct personas — from urban tech-savvy users to low-literacy rural users. The cleaner IA inadvertently eliminated cognitive overload across all segments." },
  { topic:'sanchar', keys:['sanchar problem','dot problem','government portal problem','sanchar issue','what was wrong with sanchar','gov portal ux','gov portal challenge'],
    answer:"The portal had 4+ navigation paths to the same task — users didn't know which was right.\n\nCritical tasks like blocking a stolen SIM or reporting cyber fraud were buried 4 levels deep. For low-literacy rural users — the primary audience — the portal was effectively unusable despite being their most critical government service.\n\nCognitive overload was the headline problem. Structural ambiguity was the root cause." },
  { topic:'sanchar', keys:['sanchar results','sanchar metrics','sanchar outcome','sanchar numbers','35 percent faster','42 percent findability','sanchar impact','dot portal results'],
    answer:"Sanchar Saathi results:\n\n• Task completion: 35% faster\n• Findability: 42% better across top 20 user flows\n• IS 17802:2021 compliant\n• Zero support ticket increase post-launch\n\nUnexpected win: cognitive load reduction meant users started completing tasks they'd previously abandoned entirely — no tutorial, no support call, just a cleaner IA." },
  { topic:'sanchar', keys:['sanchar process','sanchar research','sanchar personas','how she researched sanchar','gov portal research','sanchar user testing','sanchar design process'],
    answer:"Validated across 5 distinct user personas:\n• Urban professional (task-focused, fast)\n• Semi-urban user (moderate digital literacy)\n• Rural first-time user (low literacy, mobile-only)\n• Elderly user (accessibility-first)\n• Low-literacy user (visual navigation dependent)\n\nEach had a different mental model. The redesign had to work for all five without customisation — universal design, not segmented experience." },

  /* ══ PROCESS & METHODOLOGY ══ */
  { topic:'process', keys:['process','her process','design process','how she works','her workflow','her methodology','how does she approach design','how she designs','her design process','walk me through her process'],
    answer:"Research → Architecture → System → Polish. In that order, always.\n\nNishanthini doesn't open Figma until she understands who's excluded and why the current structure fails them.\n\nGiottus: 1 week of research before a single wireframe. TokenDrift: 5 engineer interviews before writing a line of TypeScript.\n\nArchitecture first. Visuals follow." },
  { topic:'research', keys:['how she does research','her research process','user research','user interviews','research methodology','research skills','does she do user research','how she validates','her research'],
    answer:"Research stack:\n• Structured user interviews (45 min minimum)\n• Competitive audits\n• Heuristic evaluations\n• Analytics triage\n• Field observation where accessible\n\nShe synthesises into an insight strip — not generic personas, but specific failure states: 'User cannot complete X because Y'. Every design decision maps back to a named failure. No floating 'user pain points'." },
  { topic:'handoff', keys:['engineering handoff','dev handoff','working with developers','working with engineers','developer collaboration','design to dev','how she works with devs','design handoff','engineer collaboration'],
    answer:"Handoff is not 'throw Figma at engineers'.\n\nNishanthini writes specs, annotates edge cases, documents every component state, and — when it matters — writes TypeScript.\n\nTokenDrift exists because she saw the gap between design intent and engineering execution and built the tool to close it herself. She speaks both languages. That's a rare combination." },
  { topic:'metrics', keys:['how she measures success','measuring success','outcome focus','how she tracks impact','design metrics','success metrics','kpis','does she measure outcomes'],
    answer:"Every project has a before/after metric. That's non-negotiable.\n\n• Giottus: 102s → 34s task time, 0% order abandonment\n• Sanchar Saathi: 35% faster, 42% better findability\n• Chennai Metro: 7/8 users, 5-second comprehension\n• TokenDrift: drift score 0–100 as a team benchmark\n\nShe doesn't ship without knowing what 'better' looks like in a number." },
  { topic:'accessibility', keys:['accessibility process','how she approaches accessibility','wcag process','how she does accessibility','inclusive design process','a11y expertise','accessibility skills','her a11y work'],
    answer:"Accessibility isn't a checklist at the end — it's an architectural constraint from day one.\n\n• Giottus: colour couldn't be load-bearing (CVD users)\n• Sanchar Saathi: literacy couldn't be assumed\n• Chennai Metro: language couldn't be required\n\nThe result: products that pass WCAG not because they were patched, but because the structure was designed to not need colour, literacy, or language to function." },
  { topic:'systems', keys:['systems thinking','how she thinks about systems','information architecture','ia design','structural thinking','systems design approach','her systems approach'],
    answer:"Systems thinking is Nishanthini's core advantage.\n\nThe question she always asks: if I fix this, what else changes?\n\n• Giottus: fixing navigation accidentally fixed accessibility for 4 crore users\n• Sanchar Saathi: fixing IA accidentally reduced cognitive load for every persona\n• TokenDrift: fixing design handoff accidentally enforced standards across 12 products\n\nThe structural fix compounds. That's what systems thinking produces." },
  { topic:'iteration', keys:['how she iterates','iteration process','usability testing','how she tests designs','how she validates designs','prototyping process','testing process','user testing process'],
    answer:"Test early, test rough.\n\nNishanthini tests lo-fi before hi-fi — changing a Figma structure is fast, changing an engineered one is not.\n\n• Giottus: 24 users, 5 days, 3 rounds\n• Chennai Metro: 8 participants, 3 iterations\n\nShe looks for failure states, not approval. Designs that pass user testing without surfacing any failures haven't been tested hard enough." },

  /* ══ SKILLS ══ */
  { topic:'skills', keys:['skill','skills','her skills','what are her skills','core skills','capabilities','her strengths','what is she good at','her skillset','what she specialises in','list her skills','what can she do'],
    answer:"Core skills:\n• FinTech UX (crypto, financial platforms)\n• Accessibility — WCAG 2.1 AA + IS 17802:2021\n• Design Systems — Figma component libraries to production\n• AI Interface Design — LLM UX, agent flows, trust signals\n• Developer Tooling — TypeScript, VS Code API\n• User Research — interviews, heuristic audits, analytics\n• Visual & Interaction Design\n\nMay be the only designer in your shortlist who can pass a WCAG audit, build a TypeScript extension, and ship a production Figma system — in the same sprint." },
  { topic:'fintech', keys:['fintech skills','fintech expertise','financial ux','fintech design','crypto design','trading ux','financial platform design','fintech experience'],
    answer:"FinTech is her deepest domain.\n\nShe understands the cognitive stakes of financial interfaces — wrong decisions cost real money. Data density, information hierarchy, error states, and trust signals are all mission-critical.\n\nGiottus Futures is the proof: a redesign that reduced cognitive errors, hit WCAG 2.1 AA, and served a previously excluded segment — simultaneously." },
  { topic:'designsystems', keys:['design system skills','her design system work','component library skills','figma system','design token expertise','how she builds design systems','design systems experience'],
    answer:"Design systems are where Nishanthini goes deep.\n\nGiottus: one Figma system with 3 WCAG-compliant colour treatments, engineering-ready specs, switching via a single CSS custom property.\n\nTokenDrift: VS Code extension enforcing the system at the code layer — not just building the system, but protecting it.\n\nTwo sides of the same problem: create the system (design), enforce the system (tooling)." },
  { topic:'coding', keys:['can she code','does she code','her coding skills','technical skills','typescript skills','how technical is she','is she technical','can she program','programming skills','her dev skills'],
    answer:"She codes when the problem demands it.\n\n• TypeScript for TokenDrift (VS Code Extension API, Language Server Protocol, GitHub Actions CI, Jest unit tests)\n• GSAP + Lenis + vanilla JS for this portfolio\n\nNot a full-stack engineer — but fluent enough to build production tooling and prototype in code. That fluency changes the quality of her handoff work fundamentally." },
  { topic:'aiux', keys:['ai ux skills','ai interface design','llm ux','conversational ui design','ai design skills','ai product design','designing for ai','agent ux design','her ai work'],
    answer:"AI UX is her current frontier.\n\nCore challenge: making model behaviour legible to non-technical users — when is the AI confident? What happens when it's wrong? How do you design feedback loops for outputs that can't be fully verified?\n\nShe's building UX patterns specifically for trust, transparency, and graceful failure in LLM-powered products." },
  { topic:'research', keys:['research skills','her research skills','how good at research','does she do user research','research experience','ux research'],
    answer:"Research-first is not a phrase for her CV — it's a constraint she enforces on herself.\n\nSanchar Saathi: 5 distinct user personas with different literacy and language profiles, each validated separately. Giottus: 1 week of research before a wireframe. TokenDrift: 5 engineer interviews before code.\n\nShe treats research as architecture validation, not user approval-seeking." },
  { topic:'visual', keys:['visual design skills','ui design skills','visual skills','how good at visual design','is she good at ui','her aesthetic','her visual style','graphic design'],
    answer:"Strong visual craft — but it serves the architecture, not the other way around.\n\nHer design is systematic: complete Figma component libraries with every state documented, typography systems with hierarchy rationale, colour systems with accessibility baked in.\n\nThe visual layer is where systems meet users. It has to be both beautiful and correct." },
  { topic:'figma', keys:['figma skills','how good at figma','figma expertise','figma level','does she use figma','figma make skills'],
    answer:"Expert-level Figma.\n\nComponent libraries, auto-layout systems, design tokens, interactive prototypes, FigJam facilitation, Figma Make for AI-assisted iteration.\n\nHer Figma files are production specs — engineers can act on them without a walkthrough. That's the standard she holds herself to." },

  /* ══ AI & CURRENT WORK ══ */
  { topic:'ai', keys:['ai work','artificial intelligence','llm','gpt','generative ai','ai ux','machine learning','chatgpt','ai interaction design','conversational interface'],
    answer:"AI UX is Nishanthini's biggest current investment.\n\nHardest problem of the next 5 years: making AI output legible and trustworthy to non-technical users. When is the model confident? What does graceful failure look like? How do you design accountability into AI interfaces?\n\nShe's already designing for it — not waiting for the industry to figure it out." },
  { topic:'current', keys:['working on','what\'s new','latest work','side project','recent work','what is she working','what has she been doing'],
    answer:"Currently:\n• Building AI interface patterns for LLM-powered products\n• Refining the Chennai Metro accessibility system\n• Monitoring WCAG 3.0 for structural changes\n\nAlways open to the right opportunity — especially FinTech, AI products, or design systems leadership." },
  { topic:'ai', keys:['figma make','figma ai','generative design','ai assisted design'],
    answer:"Yes — Nishanthini uses Figma Make and AI-assisted design flows actively.\n\nHer take: AI should compress iteration cycles, not replace the research and strategy that makes design meaningful. The thinking still has to be yours." },

  /* ══ CTO / HIRING MANAGER QUESTIONS ══ */
  { topic:'cto', keys:['can she work at scale','enterprise experience','large team','can she handle scale','large codebase','does she understand engineering constraints','engineering collaboration at scale'],
    answer:"Evidence:\n\nTokenDrift: built solo — TypeScript, Language Server Protocol, CI pipeline, unit tests, open sourced. She didn't ask an engineer to build it. She built it.\n\nGiottus: coordinated WCAG audit, Figma system architecture, and engineering handoff simultaneously across a production fintech platform.\n\nShe produces deliverables engineering can act on without a translator." },
  { topic:'cto', keys:['what makes her different from other designers','how is she different','designer who codes','her edge over other designers','what separates her from other designers'],
    answer:"Most designers hand off and hope.\n\nNishanthini built a VS Code extension to enforce what she designed. That's the difference.\n\nShe understands that a beautiful Figma file ignored by engineering is a failed design. She works across the full span — from user interview to merged PR. Very few designers operate at that width." },
  { topic:'cto', keys:['can she lead','ownership','can she take ownership','is she a lead designer','can she work independently','self directed','leadership','initiative'],
    answer:"TokenDrift is the answer: sole designer, developer, researcher, and product owner. She defined the problem, wrote the TypeScript, shipped the extension, and open-sourced it.\n\nGiottus: led research strategy, owned design system architecture, managed engineering handoff.\n\nShe works with autonomy and delivers with accountability." },
  { topic:'weakness', keys:['weakness','weaknesses','what she can\'t do','her limitation','what she struggles with','honest about weaknesses','what is she not good at','her gaps'],
    answer:"Honest answer: she sometimes defaults to building before fully validating.\n\nTokenDrift's threshold defaults (3× repetition) were intuition-based. After shipping, she found they were too aggressive — engineers saw blue suggestions on values they had good reasons to not tokenize. The noise eroded trust fast.\n\nThe fix was a settings key. The lesson was: 5 engineer interviews before the first line of TypeScript would have calibrated it correctly. That kind of over-engineering-before-validation is the pattern she watches for in herself now." },
  { topic:'fit', keys:['what kind of company suits her','right company','good fit','ideal role','ideal company','what she is looking for','best environment for her','what type of work'],
    answer:"Best fit:\n\n• Products where design decisions have real stakes — not 'pick a colour' decisions, but 'this architecture includes or excludes a user segment' decisions\n• Teams that respect research before wireframes\n• FinTech, AI products, enterprise platforms, government systems\n• Engineering culture that values design input at the architecture stage — not just the visual stage\n\nShe's strongest at companies where design and engineering share a vocabulary." },

  /* ══ AVAILABILITY & HIRING ══ */
  { topic:'available', keys:['is she available','is she open to work','available for hire','open to opportunities','looking for work','is nisha available','her availability','open to work','can i hire her','is she hiring'],
    answer:"Yes — actively open.\n\nFull-time product designer roles and select freelance. Sweet spot: FinTech, AI products, enterprise platforms, design systems.\n\nIndia-based (Chennai, IST). Fully remote-ready across all time zones.\n\nEmail: thedesignernisha@gmail.com" },
  { topic:'available', keys:['full time','full-time role','permanent role','full time position','full time job','permanent position'],
    answer:"Open to full-time roles.\n\nLooking for: a team where design decisions have real stakes, not execution-only work. FinTech, AI, enterprise, or design systems leadership are the strongest fits.\n\nEmail thedesignernisha@gmail.com to start a conversation." },
  { topic:'available', keys:['freelance','contract work','contract role','consulting work','freelance work','part time work'],
    answer:"Open to select freelance and contract — design systems builds, accessibility audits, FinTech UX, and early-stage AI product design are the strongest fits.\n\nEmail thedesignernisha@gmail.com with a brief description of what you're building." },
  { topic:'available', keys:['when can she start','notice period','start date','how soon can she start','joining timeline','how quickly can she join'],
    answer:"Available fairly quickly. Right fit moves fast — timelines can be confirmed in one email.\n\nthedesignernisha@gmail.com" },
  { topic:'available', keys:['what roles suit her','what positions','what job titles','role fit','what kind of designer','type of role'],
    answer:"Best fit roles:\n• Product Designer / Senior Product Designer\n• UX Lead / Design Lead\n• Design Systems Lead\n• FinTech Designer\n• AI UX Designer\n• Accessibility Lead\n\nShe's strongest where research, systems architecture, and engineering overlap." },
  { topic:'available', keys:['remote work','can she work remotely','onsite','hybrid','location flexibility','can she relocate','work from home'],
    answer:"Fully remote-ready. Chennai, India (IST / UTC+5:30).\n\nExperienced with async-first workflows and cross-timezone collaboration. Open to discussing onsite for the right opportunity." },
  { topic:'available', keys:['schedule interview','schedule a call','interview her','book a call','can i talk to her','video call with her','set up a meeting'],
    answer:"Yes — email thedesignernisha@gmail.com with a note about what you're building.\n\nShe's responsive and keeps time open for strong conversations." },
  { topic:'compensation', keys:['salary','rate','pay','compensation','ctc','cost','how much does she charge','budget','package','what does she charge'],
    answer:"Let's understand what you're building first — scope shapes everything.\n\nEmail thedesignernisha@gmail.com with context on the role and she'll respond with expectations." },

  /* ══ WHY NISHANTHINI ══ */
  { topic:'whynisha', keys:['why nisha','why nishanthini','why hire her','what makes her unique','why hire nishanthini','make a case for nisha','why should i hire her','what makes her stand out'],
    answer:"① She built a VS Code extension to close the design-engineering gap — most designers don't go there.\n\n② She unlocked 4 crore users no Indian fintech had reached — by fixing IA, not adding features.\n\n③ WCAG 2.1 AA + IS 17802:2021 on multiple shipped products — accessibility by architecture.\n\n④ 102s → 34s. 35% faster. 42% better findability. Numbers on every project.\n\nThe receipts exist. The case studies are below." },
  { topic:'whynisha', keys:['her edge','her superpower','what she does best','her strongest suit','what she excels at','her competitive advantage'],
    answer:"The seam between design and engineering — where most design intent dies.\n\nShe's fluent in both languages, which means her designs survive contact with real engineering. They don't get 'interpreted'.\n\nTokenDrift is the product of that fluency: she saw the gap, understood it deeply enough to write TypeScript, and closed it." },
  { topic:'whynisha', keys:['is she good','how good is she','is she experienced','her level','how experienced is she','is she senior','is she ready'],
    answer:"Early-career designer with production impact at a level that's uncommon.\n\n4 crore CVD users. A government portal. A public transit system. A VS Code extension. All at the B.Des level.\n\nThe quality of the work and the depth of documentation are what you'd evaluate. Everything is in the case studies — not just 'what it looked like' but why every decision was made and what it produced." },

  /* ══ CONTACT & RESOURCES ══ */
  { topic:'contact', keys:['how to contact','contact her','email her','reach out','get in touch','connect with her','say hello','her email address','email nisha'],
    answer:"thedesignernisha@gmail.com\n\nShe replies within 24 hours. Or use the Contact link in the nav bar. LinkedIn is in the footer." },
  { topic:'contact', keys:['resume','cv','download resume','her resume','see her cv','pdf resume','her cv'],
    answer:"Hit the Resume button in the nav bar — downloads directly. Outcome-focused, one page, no fluff." },
  { topic:'contact', keys:['linkedin','her linkedin profile','find her on linkedin','linkedin profile'],
    answer:"LinkedIn is in the footer. Best first contact: thedesignernisha@gmail.com — she's most responsive there." },
  { topic:'contact', keys:['github','her github','open source code','her code','where is her code','public repositories'],
    answer:"github.com/Designer-nisha — TokenDrift is open source there.\n\nThe code quality is part of the portfolio — not just the screenshots." },

  /* ══ META / SMALL TALK ══ */
  { topic:'meta', keys:['are you a bot','are you real','are you human','is this ai','is this a chatbot','am i talking to a bot','am i talking to a human','are you automated'],
    answer:"Honest answer: keyword-scoring chatbot — no LLM. No magic, just careful indexing.\n\nBut everything I say is 100% accurate about Nishanthini. Think of me as her well-briefed representative.\n\nWhat can I help you with?" },
  { topic:'meta', keys:['test','testing','ping','is this working','hello world','check check','can you hear me'],
    answer:"Loud and clear! Try: 'Tell me about Giottus', 'Is she available?', or 'What makes her different?'" },
  { topic:'meta', keys:['how was this portfolio built','how was this site made','what tech did you use','tech stack of this site','vanilla','built with gsap','how was this made'],
    answer:"Vanilla HTML, CSS, JavaScript — no frameworks.\n\n• Single-file SPA with instant page transitions (zero network)\n• GSAP 3 for all animations + scroll-triggered reveals\n• Lenis for smooth scroll\n• Bricolage Grotesque + Space Grotesk + Instrument Serif\n• Custom cursor with lerp\n• Split preloader reveal\n• This keyword-scoring chatbot\n\nEvery element handcrafted. The constraint was intentional: fundamentals first, no abstraction magic." },
  { topic:'meta', keys:['joke','funny','make me laugh','humor','tell me a joke','something funny'],
    answer:"An engineer and a designer ship the same feature.\n\nEngineer: 'It works.'\nDesigner: 'But does it work for someone who can't see colour, has a 2G connection, and is placing a trade under market pressure?'\n\nBoth were right. That tension is Nishanthini's entire career. 😄" },
  { topic:'meta', keys:['that is impressive','wow','interesting','really','no way','that is a lot','that is amazing','seriously','that is great'],
    answer:"The numbers are real — 4 crore CVD users, 67% task time reduction, a government portal, a public transit system.\n\nWant to go deeper on any of these? Or ask about whether Nishanthini's available?" },
  { topic:'meta', keys:['great portfolio','nice portfolio','love this portfolio','impressive portfolio','beautiful portfolio','amazing site','love your work','this looks amazing'],
    answer:"Thank you — that means a lot!\n\nThis portfolio is itself a design artefact: built with the same obsession Nishanthini brings to client work. Every animation, every scroll interaction, every word is deliberate.\n\nWant to explore any of the projects, or ask about what she's looking for next?" },
  { topic:'meta', keys:['thank you','thanks','appreciate it','cheers','thank u','ty','thx','thanks a lot','many thanks'],
    answer:"Of course! Anything else you'd like to know?\n\nAnd if you're evaluating — thedesignernisha@gmail.com is the move. 🙌" },
  { topic:'meta', keys:['bye','goodbye','see you','later','cya','take care','good night','signing off','ttyl'],
    answer:"Take care! If you're ever building something that needs a designer who bridges design and engineering — you know where to find Nishanthini. 👋" }
];

/* ── Scroll helper ── */
function chatScrollToBottom() {
  if (!chatMessages) return;
  requestAnimationFrame(function () { chatMessages.scrollTop = chatMessages.scrollHeight; });
}

/* ── Add message bubble ── */
function chatAddMsg(text, type) {
  if (!chatMessages) return;
  chatMessages.classList.add('is-visible');
  var msg = document.createElement('div');
  msg.className = 'chat-msg chat-msg--' + type;
  var bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  if (type === 'bot') {
    bubble.innerHTML = text
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\n/g,'<br>');
  } else {
    bubble.textContent = text;
  }
  msg.appendChild(bubble);
  chatMessages.appendChild(msg);
  gsap.fromTo(msg,    { opacity:0, y:10, x: type==='bot'?-14:14 }, { opacity:1, y:0, x:0, duration:0.4, ease:'expo.out' });
  gsap.fromTo(bubble, { scale:0.9 },                                { scale:1, duration:0.45, ease:'back.out(1.8)', delay:0.05 });
  chatScrollToBottom();
}

/* ── Suggestion chips ── */
function chatAddSuggestions(sugs) {
  if (!chatMessages || !sugs || !sugs.length) return;
  var row = document.createElement('div');
  row.className = 'chat-suggestions';
  sugs.forEach(function (s) {
    var btn = document.createElement('button');
    btn.className = 'chat-sug-pill';
    btn.textContent = s;
    btn.addEventListener('click', function () { chatSend(s); });
    row.appendChild(btn);
  });
  chatMessages.appendChild(row);
  chatScrollToBottom();
  gsap.fromTo(row, { opacity:0, y:8 }, { opacity:1, y:0, duration:0.35, ease:'expo.out', delay:0.15 });
}

/* ── Typing indicator ── */
function chatShowTyping() {
  if (!chatMessages) return null;
  chatMessages.classList.add('is-visible');
  var t = document.createElement('div');
  t.className = 'chat-msg chat-msg--bot';
  t.innerHTML = '<div class="chat-typing"><span class="chat-dot"></span><span class="chat-dot"></span><span class="chat-dot"></span></div>';
  chatMessages.appendChild(t);
  gsap.fromTo(t, { opacity:0, x:-10 }, { opacity:1, x:0, duration:0.3, ease:'power2.out' });
  chatScrollToBottom();
  return t;
}

/* ── Scoring engine ──
   1. PRIMARY  — key is substring of input. Score = key.length × 2.
   2. SECONDARY — shared word count. Score = matches × 5.
── */
function chatScore(lq, entry) {
  var lqWords = lq.split(/\s+/).filter(function(w){ return w.length > 2; });
  var best = 0;
  for (var i = 0; i < entry.keys.length; i++) {
    var k = entry.keys[i];
    if (lq.indexOf(k) !== -1) { var s = k.length * 2; if (s > best) best = s; continue; }
    var kWords = k.split(/\s+/);
    var shared = 0;
    for (var w = 0; w < lqWords.length; w++) { if (kWords.indexOf(lqWords[w]) !== -1) shared++; }
    if (shared > 0) { var ws = shared * 5; if (ws > best) best = ws; }
  }
  return best;
}

var chatSugMap = {
  project:  ['Tell me about Giottus', 'Tell me about TokenDrift', 'All her projects'],
  skills:   ['Her skills', 'Can she code?', 'Her accessibility expertise'],
  hiring:   ['Is she available?', 'What roles suit her?', 'How to contact her'],
  process:  ['Her design process', 'How she does research', 'How she works with engineers'],
  default:  ['Her best project', 'Is she available?', 'What makes her different?']
};

function chatSmartSuggestions(lq) {
  if (/project|work|built|design|case|giottus|token|metro|sanchar/.test(lq)) return chatSugMap.project;
  if (/skill|can she|good at|expertise|code|figma|tool/.test(lq)) return chatSugMap.skills;
  if (/hire|available|job|role|freelance|contact|email|salary|start/.test(lq)) return chatSugMap.hiring;
  if (/process|how|research|method|approach|iterate/.test(lq)) return chatSugMap.process;
  return chatSugMap.default;
}

function chatGetAnswer(q) {
  var lq = q.toLowerCase().trim().replace(/[?!.,;]/g,'').replace(/\s+/g,' ');
  if (!lq) return { text: "Ask me anything about Nishanthini — projects, process, skills, or availability.", sug: chatSugMap.default };
  var best = null, bestScore = 0;
  for (var i = 0; i < chatKB.length; i++) {
    var s = chatScore(lq, chatKB[i]);
    if (s > bestScore) { bestScore = s; best = chatKB[i]; }
  }
  if (best) {
    chatCtx.topic = best.topic; chatCtx.count++;
    return { text: best.answer, sug: null };
  }
  return { text: "I couldn't find an exact match — but Nishanthini can answer directly: thedesignernisha@gmail.com\n\nOr try one of these:", sug: chatSmartSuggestions(lq) };
}

/* ── Stream bot reply word by word ── */
function chatStreamBot(text, onDone) {
  if (!chatMessages) return;
  chatMessages.classList.add('is-visible');
  var msg    = document.createElement('div');
  msg.className = 'chat-msg chat-msg--bot';
  var bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  msg.appendChild(bubble);
  chatMessages.appendChild(msg);
  gsap.fromTo(msg,    { opacity:0, y:10, x:-14 }, { opacity:1, y:0, x:0, duration:0.4, ease:'expo.out' });
  gsap.fromTo(bubble, { scale:0.9 },               { scale:1, duration:0.45, ease:'back.out(1.8)', delay:0.05 });

  var safe = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  var rawTokens = safe.split(/(\n)/);
  var words = [];
  rawTokens.forEach(function(tok) {
    if (tok === '\n') { words.push('\n'); }
    else { var parts = tok.split(' '); parts.forEach(function(p,i){ if(p!=='') words.push(p+(i<parts.length-1?' ':'')); }); }
  });
  var cursor = document.createElement('span');
  cursor.className = 'chat-cursor';
  bubble.appendChild(cursor);
  var idx = 0;
  function writeNext() {
    if (idx >= words.length) { cursor.remove(); if (typeof onDone === 'function') onDone(); return; }
    var w = words[idx++];
    if (w === '\n') { bubble.insertBefore(document.createElement('br'), cursor); }
    else { var span = document.createElement('span'); span.innerHTML = w; bubble.insertBefore(span, cursor); }
    chatScrollToBottom();
    setTimeout(writeNext, 28 + Math.random() * 22);
  }
  setTimeout(writeNext, 60);
}

/* ── Send ── */
function chatSend(q) {
  if (!q || !q.trim()) return;
  if (chatPillsWrap && chatPillsWrap.style.display !== 'none') {
    gsap.to(chatPillsWrap, { opacity:0, y:-6, duration:0.25, ease:'power2.in', onComplete:function(){ chatPillsWrap.style.display='none'; }});
  }
  chatAddMsg(q, 'user');
  var sendBtn  = document.getElementById('chat-send');
  var heroChat = document.querySelector('.hero-chat');
  if (sendBtn) gsap.fromTo(sendBtn, { scale:0.82 }, { scale:1, duration:0.45, ease:'back.out(3)' });
  if (heroChat) heroChat.classList.add('is-thinking');
  var typing = chatShowTyping();
  setTimeout(function() {
    if (typing) gsap.to(typing, { opacity:0, duration:0.15, onComplete:function(){ typing.remove(); }});
    setTimeout(function() {
      var result = chatGetAnswer(q);
      chatStreamBot(result.text, function() {
        if (heroChat) heroChat.classList.remove('is-thinking');
        if (result.sug) chatAddSuggestions(result.sug);
      });
    }, 80);
  }, 900 + Math.random() * 500);
}

/* ── initChatbot — re-called on each home enter ── */
function initChatbot() {
  chatMessages  = document.getElementById('hero-chat-messages');
  chatPillsWrap = document.getElementById('chat-pills');
  chatInput     = document.getElementById('chat-input');
  chatSendBtn   = document.getElementById('chat-send');
  if (!chatMessages) return;

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', function() { var q=chatInput.value.trim(); chatInput.value=''; chatSend(q); });
  }
  if (chatInput) {
    chatInput.addEventListener('keydown', function(e) { if(e.key==='Enter'){var q=chatInput.value.trim();chatInput.value='';chatSend(q);} });
    chatInput.addEventListener('focus', function() { var w=chatInput.closest('.hero-chat-input-wrap'); if(w) gsap.to(w,{scale:1.012,duration:0.3,ease:'power2.out'}); });
    chatInput.addEventListener('blur', function()  { var w=chatInput.closest('.hero-chat-input-wrap'); if(w) gsap.to(w,{scale:1,duration:0.4,ease:'expo.out'}); });
  }
  if (chatPillsWrap) {
    chatPillsWrap.querySelectorAll('.chat-pill').forEach(function(pill, idx) {
      gsap.fromTo(pill, { opacity:0, y:12 }, { opacity:1, y:0, duration:0.4, ease:'expo.out', delay: 2.0 + idx * 0.08 });
      pill.addEventListener('click', function() { chatSend(pill.dataset.q || pill.textContent.trim()); });
    });
  }
  setTimeout(function() {
    chatAddMsg("Hey 👋 I'm Nishanthini's portfolio bot.\n\nAsk me about her work, process, skills, or whether she's open to new opportunities — I've got the full picture.", 'bot');
  }, 1800);
}

/* ═══════════════════════════════════════════════════
   21. TOKENDRIFT INTERACTIVE DEMO
═══════════════════════════════════════════════════ */
function initTokenDriftDemo() {
  if (!document.getElementById('td1')) return;

  var CIRCUMFERENCE = 251.3;
  var drifts = {
    td1: { type:'yellow', msg:'Exact match in token file.', fix:'var(--color-primary)', issue:'ti1', orig:'#2563eb' },
    td2: { type:'yellow', msg:'Exact match in token file.', fix:'var(--spacing-md)',    issue:'ti2', orig:'16px'    },
    td3: { type:'yellow', msg:'Exact match in token file.', fix:'var(--spacing-lg)',    issue:'ti3', orig:'24px'    },
    td4: { type:'blue',   msg:'Appears 4× — suggest creating a token.', fix:'var(--radius-sm)', issue:'ti4', orig:'8px' },
    td5: { type:'yellow', msg:'Exact match in token file.', fix:'var(--color-white)',   issue:'ti5', orig:'#ffffff' }
  };
  var scores  = [42, 34, 26, 18, 10, 0];
  var fixed   = {};
  var hideTimer = null;
  var tooltip   = document.getElementById('td-tooltip');
  var scoreNum  = document.getElementById('td-score-num');
  var ringFill  = document.getElementById('td-ring-fill');
  var cleanMsg  = document.getElementById('td-clean');

  function setScore(n) {
    var s = scores[Math.min(n, scores.length - 1)];
    ringFill.style.strokeDashoffset = CIRCUMFERENCE - (s / 100) * CIRCUMFERENCE;
    scoreNum.textContent = s;
    var col = s < 15 ? '#4EC9B0' : '#F8C555';
    ringFill.style.stroke = col;
    scoreNum.style.color  = col;
    if (s === 0) cleanMsg.classList.add('show');
  }

  function positionTooltip(el) {
    var r  = el.getBoundingClientRect();
    var th = tooltip.offsetHeight || 130;
    var tw = tooltip.offsetWidth  || 230;
    var top = r.bottom + 8;
    if (top + th > window.innerHeight - 12) top = r.top - th - 8;
    var left = r.left;
    if (left + tw > window.innerWidth - 12) left = window.innerWidth - tw - 12;
    if (left < 8) left = 8;
    tooltip.style.top  = top  + 'px';
    tooltip.style.left = left + 'px';
  }

  function showTooltip(el, id) {
    clearTimeout(hideTimer);
    var d     = drifts[id];
    var label = d.type === 'yellow' ? 'Token match — quick fix available' : 'New token suggestion';
    tooltip.innerHTML =
      '<div class="td-tip-type ' + d.type + '">' + label + '</div>' +
      '<p>' + d.msg + '</p>' +
      '<code class="td-tip-arrow">→ ' + d.fix + '</code>' +
      '<button class="td-tip-fix">⚡ Quick Fix</button>';
    tooltip.style.display = 'block';
    positionTooltip(el);
    tooltip.querySelector('.td-tip-fix').addEventListener('click', function () {
      applyFix(id); tooltip.style.display = 'none';
    });
  }

  function scheduleHide() {
    hideTimer = setTimeout(function () { tooltip.style.display = 'none'; }, 120);
  }

  function applyFix(id) {
    if (fixed[id]) return;
    fixed[id] = true;
    var el = document.getElementById(id);
    el.className = 'td-fixed'; el.textContent = drifts[id].fix; el.style.pointerEvents = 'none';
    var li = document.getElementById(drifts[id].issue);
    if (li) li.classList.add('fixed');
    setScore(Object.keys(fixed).length);
  }

  function resetDemo() {
    fixed = {}; cleanMsg.classList.remove('show');
    Object.keys(drifts).forEach(function (id) {
      var d = drifts[id]; var el = document.getElementById(id);
      el.className = 'td-drift ' + d.type; el.textContent = d.orig; el.style.pointerEvents = '';
      var li = document.getElementById(d.issue); if (li) li.classList.remove('fixed');
    });
    setScore(0);
  }

  Object.keys(drifts).forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('mouseenter', function () { showTooltip(el, id); });
    el.addEventListener('mouseleave', scheduleHide);
    el.addEventListener('click', function (e) { e.stopPropagation(); showTooltip(el, id); });
  });

  tooltip.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
  tooltip.addEventListener('mouseleave', scheduleHide);
  document.addEventListener('click', function (e) { if (!tooltip.contains(e.target)) tooltip.style.display = 'none'; });

  var resetBtn = document.getElementById('td-reset');
  if (resetBtn) resetBtn.addEventListener('click', resetDemo);
}

/* ═══════════════════════════════════════════════════
   22. PIPELINE ANIMATION — sequential draw
═══════════════════════════════════════════════════ */
function initPipelineAnim() {
  var pipeline = document.getElementById('td-pipeline');
  if (!pipeline) return;

  var arrows = [
    { path:'#pa1 .td-arrow-path', head:'#pa1h', len:54 },
    { path:'#pa2 .td-arrow-path', head:'#pa2h', len:54 },
    { path:'#pa3 .td-arrow-path', head:'#pa3h', len:42 },
    { path:'#pa4 .td-arrow-path', head:'#pa4h', len:42 },
    { path:'#pa5 .td-arrow-path', head:'#pa5h', len:42 },
    { path:'#pa6 .td-arrow-path', head:'#pa6h', len:42 }
  ];

  var tl = gsap.timeline({ paused: true });
  arrows.forEach(function (a, i) {
    var el = document.querySelector(a.path);
    var hd = document.querySelector(a.head);
    if (!el) return;
    tl.to(el, { strokeDashoffset:0, duration:0.5, ease:'power2.inOut' }, i < 3 ? '>-0.1' : '>-0.3');
    if (hd) tl.to(hd, { opacity:1, duration:0.2 }, '>-0.1');
  });

  var boxes = pipeline.querySelectorAll('.td-pipe-box');
  tl.fromTo(boxes, { y:18, opacity:0 }, { y:0, opacity:1, duration:0.5, stagger:0.07, ease:'expo.out' }, 0);

  ScrollTrigger.create({
    trigger: pipeline, start: 'top 80%', once: true,
    onEnter: function () { tl.play(); }
  });
}

/* ═══════════════════════════════════════════════════
   23. BOOT — initial page load
   Single HTML file — always starts on home.
═══════════════════════════════════════════════════ */
(function boot() {
  setupScrollBar();
  bindMagnetic();
  bindCursorHovers();

  var homeEl = document.getElementById('page-home');
  history.replaceState({ page: 'home' }, '');

  if (preloader && !sessionStorage.getItem('portfolioLoaded')) {
    /* First visit — show preloader, then init home */
    sessionStorage.setItem('portfolioLoaded', '1');
    runPreloader(function () { initPage('home', homeEl); });
  } else {
    /* Return visit — skip preloader */
    if (preloader) preloader.style.display = 'none';
    initPage('home', homeEl);
  }
})();
