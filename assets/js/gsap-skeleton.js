/* ============================================================
   GSAP + Skeleton Loading – Buyer Pages Only
   ============================================================
   - All skeleton HTML uses ONLY inline styles (no Tailwind)
   - CSS classes prefixed with kms-skel- to avoid conflicts
   - Scoped under [data-skeleton-active] attribute
   - JS-managed elements (carousel, categories) use OVERLAY
     instead of innerHTML replacement
   ============================================================ */

(function () {
  'use strict';

  /* ──────────── helpers ──────────── */
  function skel(w, h, extra) {
    extra = extra || '';
    var s = 'min-height:1rem;';
    if (w) s += 'width:' + w + ';';
    if (h) s += 'height:' + h + ';';
    return '<div class="kms-skel ' + extra + '" style="' + s + '">&nbsp;</div>';
  }

  /* ─── Skeleton Generators ── */
  var S = {

    heroCarousel: function () {
      return '<div style="display:flex;gap:24px;overflow:hidden">' +
        '<div class="kms-skel" style="flex-shrink:0;width:100%;aspect-ratio:773/360;border-radius:1.5rem;min-height:12rem"></div>' +
      '</div>';
    },

    categoryGrid: function () {
      var isDesktop = window.matchMedia('(min-width: 768px)').matches;
      var h = '';
      if (isDesktop) {
        h = '<div style="border-radius:1rem;border:1px solid #e2e8f0;background:#fff">';
        h += '<div style="display:grid;grid-template-columns:repeat(6,1fr)">';
        for (var i = 0; i < 6; i++) {
          h += '<div class="kms-skel-category">' +
            skel('4.25rem', '4.25rem') +
            skel('4rem', '0.75rem') +
          '</div>';
        }
        h += '</div></div>';
      } else {
        h = '<div style="border-radius:1rem;border:1px solid #e2e8f0;background:#fff">';
        h += '<div style="display:grid;grid-template-columns:repeat(3,120px);grid-template-rows:repeat(2,1fr);overflow-x:auto">';
        for (var j = 0; j < 6; j++) {
          h += '<div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;padding:1rem;height:130px;justify-content:center">' +
            skel('3.5rem', '3.5rem') +
            skel('3rem', '0.625rem') +
          '</div>';
        }
        h += '</div></div>';
      }
      return h;
    },

    productCard: function () {
      return '<div class="kms-skel-card">' +
        '<div class="kms-skel-card-img"></div>' +
        '<div class="kms-skel-card-body">' +
          skel('90%', '0.75rem') +
          skel('55%', '0.875rem') +
          skel('40%', '0.625rem') +
          skel('60%', '0.5rem') +
        '</div>' +
      '</div>';
    },

    productGrid: function (n) {
      n = n || 6;
      var h = '<div style="display:grid;gap:0.75rem;grid-template-columns:repeat(2,1fr)">';
      for (var i = 0; i < n; i++) h += S.productCard();
      h += '</div>';
      return h;
    },

    productDetailImage: function () {
      return '<div style="display:flex;flex-direction:column;gap:1rem">' +
        skel('100%', '24rem') +
        '<div style="display:flex;gap:0.75rem">' +
          skel('5rem', '5rem') +
          skel('5rem', '5rem') +
          skel('5rem', '5rem') +
          skel('5rem', '5rem') +
        '</div>' +
      '</div>';
    },

    productDetailInfo: function () {
      return '<div style="display:flex;flex-direction:column;gap:1rem">' +
        skel('30%', '1.5rem') +
        skel('80%', '2rem') +
        skel('50%', '1rem') +
        '<div style="margin-top:0.5rem">' + skel('45%', '2.25rem') + '</div>' +
        '<div style="display:flex;gap:0.5rem;margin-top:0.75rem">' +
          skel('6rem', '2.5rem') +
          skel('4rem', '2.5rem') +
          skel('4rem', '2.5rem') +
        '</div>' +
        '<div style="display:flex;gap:0.75rem;margin-top:auto;padding-top:1.5rem">' +
          skel('50%', '3rem') +
          skel('50%', '3rem') +
        '</div>' +
      '</div>';
    },

    cartItem: function () {
      return '<div class="kms-skel-cart">' +
        '<div class="kms-skel kms-skel-cart-thumb"></div>' +
        '<div class="kms-skel-cart-info">' +
          skel('65%', '0.875rem') +
          skel('35%', '0.625rem') +
          skel('40%', '1.25rem') +
          '<div style="display:flex;justify-content:space-between;margin-top:auto">' +
            skel('6rem', '2.25rem') +
            skel('7rem', '0.875rem') +
          '</div>' +
        '</div>' +
      '</div>';
    },

    orderSummary: function () {
      return '<div style="border-radius:1rem;border:1px solid #e2e8f0;background:#fff;padding:1.25rem;display:flex;flex-direction:column;gap:1rem">' +
        skel('50%', '1.25rem') +
        skel('100%', '2.75rem') +
        skel('100%', '0.875rem') +
        skel('100%', '0.875rem') +
        skel('100%', '0.875rem') +
        '<hr style="border-color:#e2e8f0">' +
        skel('100%', '1rem') +
        skel('100%', '3rem') +
        skel('100%', '2.75rem') +
      '</div>';
    },

    transactionCard: function () {
      return '<div class="kms-skel-transaction">' +
        '<div class="kms-skel-row">' +
          skel('2.75rem', '2.75rem', 'kms-skel-circle') +
          '<div style="flex:1;display:flex;flex-direction:column;gap:0.375rem">' +
            skel('40%', '0.875rem') +
            skel('55%', '0.625rem') +
          '</div>' +
          skel('5rem', '1.5rem') +
        '</div>' +
        '<hr style="border-color:#f1f5f9">' +
        '<div class="kms-skel-row">' +
          skel('3.5rem', '3.5rem') +
          '<div style="flex:1;display:flex;flex-direction:column;gap:0.375rem">' +
            skel('50%', '0.875rem') +
            skel('40%', '0.625rem') +
          '</div>' +
          skel('6rem', '1rem') +
        '</div>' +
      '</div>';
    },

    storeHeader: function () {
      return '<div class="kms-skel-store">' +
        '<div class="kms-skel" style="height:10rem;border-radius:0"></div>' +
        '<div style="padding:1.25rem 2rem;display:flex;gap:1rem;align-items:flex-end;margin-top:-3rem;position:relative">' +
          skel('6rem', '6rem') +
          '<div style="flex:1;display:flex;flex-direction:column;gap:0.5rem">' +
            skel('40%', '1.5rem') +
            skel('30%', '0.75rem') +
          '</div>' +
        '</div>' +
        '<div style="padding:0 2rem 1.5rem;display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem">' +
          skel('100%', '4.5rem') +
          skel('100%', '4.5rem') +
          skel('100%', '4.5rem') +
          skel('100%', '4.5rem') +
        '</div>' +
      '</div>';
    },

    checkoutForm: function () {
      return '<div style="border-radius:1rem;border:1px solid #e2e8f0;background:#fff;padding:1.25rem 1.5rem;display:flex;flex-direction:column;gap:1rem">' +
        skel('45%', '1.25rem') +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">' +
          skel('100%', '2.75rem') +
          skel('100%', '2.75rem') +
        '</div>' +
        skel('100%', '2.75rem') +
        skel('100%', '6rem') +
      '</div>';
    },

    checkoutShipping: function () {
      return '<div style="border-radius:1rem;border:1px solid #e2e8f0;background:#fff;padding:1.25rem 1.5rem;display:flex;flex-direction:column;gap:1rem">' +
        skel('40%', '1.25rem') +
        skel('100%', '4rem') +
        skel('100%', '4rem') +
      '</div>';
    }
  };

  /* ──────────── Page detection ──────────── */
  function getPageType() {
    var path = window.location.pathname.toLowerCase();
    var filename = path.split('/').pop() || 'index.html';
    if (path.indexOf('/admin/') !== -1 || path.indexOf('/seller/') !== -1) return null;
    if (filename === 'index.html' || filename === '') return 'home';
    if (filename === 'halaman_kategori.html') return 'kategori';
    if (filename === 'halaman_product_detail.html') return 'product_detail';
    if (filename === 'halaman_cart.html') return 'cart';
    if (filename === 'halaman_checkout.html') return 'checkout';
    if (filename === 'halaman_my_transaction.html') return 'transaction';
    if (filename === 'halaman_store_detail.html') return 'store_detail';
    return null;
  }

  /* ──────────── OVERLAY skeletons (for JS-managed elements) ──────────── */
  // These DON'T replace innerHTML — they add an overlay on top
  function createOverlay(targetEl, skeletonHtml) {
    var overlay = document.createElement('div');
    overlay.setAttribute('data-skeleton-active', '');
    overlay.setAttribute('data-skel-overlay', '');
    overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:20;background:#f8fafc;border-radius:inherit;';
    overlay.innerHTML = skeletonHtml;

    // Make parent relative if not already
    var pos = window.getComputedStyle(targetEl).position;
    if (pos === 'static') targetEl.style.position = 'relative';

    targetEl.appendChild(overlay);
    return overlay;
  }

  function removeOverlay(overlay) {
    if (!overlay || !overlay.parentNode) return;
    if (typeof gsap !== 'undefined') {
      gsap.to(overlay, {
        opacity: 0, duration: 0.4, ease: 'power2.out',
        onComplete: function () {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }
      });
    } else {
      overlay.parentNode.removeChild(overlay);
    }
  }

  /* ──────────── REPLACE skeletons (for static HTML elements) ──────────── */
  function getTargets(pageType) {
    var t = {};
    switch (pageType) {
      // Home: NO innerHTML replace — hero & category use overlay
      case 'home':
        break;
      case 'kategori':
        break;
      case 'product_detail':
        t['section.grid.gap-8'] = '<div style="display:grid;gap:2rem;border-radius:1.5rem;border:1px solid #e2e8f0;background:#fff;padding:1.25rem 2rem;grid-template-columns:1fr 1fr">' +
          S.productDetailImage() + S.productDetailInfo() + '</div>';
        break;
      case 'cart':
        t['section.space-y-4'] = S.cartItem() + '<div style="margin-top:1rem"></div>' + S.cartItem() + '<div style="margin-top:1rem"></div>' + S.cartItem();
        break;
      case 'checkout':
        t['section.space-y-6'] = S.checkoutForm() + '<div style="margin-top:1.5rem">' + S.checkoutShipping() + '</div>';
        break;
      case 'transaction':
        t['section.flex.flex-col.gap-5'] = S.transactionCard() + '<div style="margin-top:1.25rem"></div>' + S.transactionCard() + '<div style="margin-top:1.25rem"></div>' + S.transactionCard();
        break;
      case 'store_detail':
        t['section.rounded-3xl'] = S.storeHeader();
        break;
    }
    return t;
  }

  /* ──────────── Overlay targets (JS-managed elements) ──────────── */
  function getOverlayTargets(pageType) {
    var o = {};
    if (pageType === 'home') {
      o['#hero-slideshow'] = S.heroCarousel();
      o['[data-category-showcase]'] = S.categoryGrid();
    }
    return o;
  }

  /* ──────────── MAIN ──────────── */
  var pageType = getPageType();
  if (!pageType) return;

  document.addEventListener('DOMContentLoaded', function () {
    var targets = getTargets(pageType);
    var overlayTargets = getOverlayTargets(pageType);
    var saved = {};
    var overlays = [];

    // 1A — Inject REPLACEMENT skeletons (static HTML)
    Object.keys(targets).forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      saved[sel] = el.innerHTML;
      el.setAttribute('data-skeleton-active', '');
      el.innerHTML = targets[sel];
    });

    // 1B — Inject OVERLAY skeletons (JS-managed elements)
    Object.keys(overlayTargets).forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      var ov = createOverlay(el, overlayTargets[sel]);
      overlays.push(ov);
    });

    // 2 — After delay, swap back & remove overlays
    var delay = 800 + Math.random() * 500;
    setTimeout(function () {

      // Restore replaced content
      Object.keys(saved).forEach(function (sel) {
        var el = document.querySelector(sel);
        if (!el) return;
        el.innerHTML = saved[sel];
        el.removeAttribute('data-skeleton-active');

        if (typeof gsap !== 'undefined' && el.children.length > 0) {
          gsap.fromTo(el.children,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06, clearProps: 'all' }
          );
        }
      });

      // Remove overlays (with fade-out)
      overlays.forEach(function (ov) {
        removeOverlay(ov);
      });

      // Run entrance animations
      runGSAP();
    }, delay);
  });

  /* ──────────── GSAP Animations ──────────── */
  function runGSAP() {
    if (typeof gsap === 'undefined') return;
    var hasST = typeof ScrollTrigger !== 'undefined';
    if (hasST) gsap.registerPlugin(ScrollTrigger);

    // Navbar
    var nav = document.getElementById('navbar-wrapper');
    if (nav) {
      gsap.fromTo(nav,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
      );
    }

    // Section headings
    document.querySelectorAll('main h1, main h2').forEach(function (h) {
      var opts = { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' };
      if (hasST) opts.scrollTrigger = { trigger: h, start: 'top 92%', toggleActions: 'play none none none' };
      gsap.fromTo(h, { opacity: 0, x: -24 }, opts);
    });

    // Cards
    ['main .grid > a', 'section.flex.flex-col.gap-5 > div'].forEach(function (sel) {
      var cards = document.querySelectorAll(sel);
      if (!cards.length) return;
      var opts = {
        opacity: 1, y: 0, scale: 1,
        duration: 0.45, ease: 'back.out(1.3)', stagger: 0.05, clearProps: 'all'
      };
      if (hasST) opts.scrollTrigger = { trigger: cards[0].parentElement, start: 'top 88%', toggleActions: 'play none none none' };
      gsap.fromTo(cards, { opacity: 0, y: 32, scale: 0.96 }, opts);
    });

    // Hero - just opacity, NO scale/transform (carousel has its own transform)
    var hero = document.getElementById('hero-slideshow');
    if (hero) {
      gsap.fromTo(hero,
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out' }
      );
    }

    // Footer
    var footer = document.querySelector('footer');
    if (footer && hasST) {
      gsap.fromTo(footer, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: footer, start: 'top 95%', toggleActions: 'play none none none' }
      });
    }

    // WhatsApp widget
    var wa = document.querySelector('.fixed.bottom-8.right-8');
    if (wa) gsap.fromTo(wa, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)', delay: 0.4 });

    // CTA hover
    document.querySelectorAll('a.bg-blue-600, button.bg-blue-600').forEach(function (btn) {
      btn.addEventListener('mouseenter', function () { gsap.to(btn, { scale: 1.04, duration: 0.2, ease: 'power1.out' }); });
      btn.addEventListener('mouseleave', function () { gsap.to(btn, { scale: 1, duration: 0.25, ease: 'elastic.out(1, 0.5)' }); });
    });

    // Partners
    var logos = document.querySelectorAll('#partners img');
    if (logos.length && hasST) {
      gsap.fromTo(logos, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: { trigger: '#partners', start: 'top 88%', toggleActions: 'play none none none' }
      });
    }
  }

})();
