document.addEventListener('DOMContentLoaded', function () {

  // ── Hero Peek Carousel (Infinite Loop) ──────────────────────────
  (function () {
    var slideshow = document.getElementById('hero-slideshow');
    if (!slideshow) return;

    var clip    = document.getElementById('hero-clip');
    var track   = document.getElementById('hero-track');
    var prevBtn = document.getElementById('hero-prev');
    var nextBtn = document.getElementById('hero-next');
    if (!clip || !track) return;

    var GAP        = 24;
    var origSlides = Array.from(track.children);
    var total      = origSlides.length;

    // Sisipkan klon slide terakhir di depan,
    // dan klon slide pertama di belakang
    // → track: [lastClone, S1, S2, ..., Sn, firstClone]
    var firstClone = origSlides[0].cloneNode(true);
    var lastClone  = origSlides[total - 1].cloneNode(true);
    [firstClone, lastClone].forEach(function (c) {
      c.setAttribute('aria-hidden', 'true');
      c.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
    });
    track.appendChild(firstClone);
    track.insertBefore(lastClone, track.firstChild);

    var allSlides = Array.from(track.children); // total+2 elemen
    var current   = 1;  // mulai di slide asli pertama (index 1)
    var jumping   = false;
    var timer;

    var getPeek = function () {
      return window.innerWidth >= 768 ? 56 : 28;
    };

    var getSW = function () {
      return clip.offsetWidth - getPeek() * 2;
    };

    /* Terapkan posisi — animated: true = pakai transisi, false = instantan */
    var applyTransform = function (animated) {
      var sw     = getSW();
      var peek   = getPeek();
      var offset = peek - current * (sw + GAP);
      // '' → biarkan class Tailwind (transition aktif), 'none' → tanpa transisi
      track.style.transition = animated ? '' : 'none';
      track.style.transform  = 'translateX(' + offset + 'px)';
      if (!animated) { void track.offsetWidth; } // paksa reflow
    };

    /* Atur lebar semua slide (termasuk klon) */
    var applyLayout = function () {
      var sw = getSW();
      allSlides.forEach(function (s) { s.style.width = sw + 'px'; });
      applyTransform(false);
    };

    /* Setelah animasi selesai: jika kita di posisi klon → loncat ke aslinya */
    track.addEventListener('transitionend', function (e) {
      if (e.propertyName !== 'transform' || jumping) return;
      jumping = true;
      if (current <= 0) {
        // Di klon slide terakhir → loncat ke slide terakhir asli
        current = total;
        applyTransform(false);
      } else if (current >= total + 1) {
        // Di klon slide pertama → loncat ke slide pertama asli
        current = 1;
        applyTransform(false);
      }
      jumping = false;
    });

    /* Navigasi */
    var go = function (idx) {
      current = idx;
      applyTransform(true);
    };

    var startTimer = function () {
      clearInterval(timer);
      timer = setInterval(function () { go(current + 1); }, 4000);
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault(); go(current - 1); startTimer();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault(); go(current + 1); startTimer();
      });
    }

    /* Swipe */
    var tx0 = 0;
    slideshow.addEventListener('touchstart', function (e) {
      tx0 = e.changedTouches[0].clientX;
    }, { passive: true });
    slideshow.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - tx0;
      if (Math.abs(dx) > 40) { go(current + (dx < 0 ? 1 : -1)); startTimer(); }
    }, { passive: true });

    window.addEventListener('resize', applyLayout);
    setTimeout(function () { applyLayout(); startTimer(); }, 0);
  })();
  // ────────────────────────────────────────────────────────────────




  var mobileToggle = document.querySelector('[data-mobile-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });
  }

  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) {
      return;
    }

    if (href.toLowerCase() === currentPage.toLowerCase()) {
      link.classList.add('bg-blue-50', 'text-blue-700');
    }
  });

  var categoryShowcase = document.querySelector('[data-category-showcase]');
  if (categoryShowcase) {
    var categories = [
      {
        name: 'Makanan',
        bg: 'bg-gradient-to-br from-amber-50 to-orange-100',
        iconColor: 'text-amber-600',
        icon: '<svg class="h-8 w-8" viewBox="0 0 64 64" fill="none"><path d="M12 40c0-12 6-22 20-22s20 10 20 22" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><ellipse cx="32" cy="40" rx="22" ry="6" stroke="currentColor" stroke-width="3"/><path d="M18 40c1 4 6 7 14 7s13-3 14-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".5"/><path d="M28 22c-2-6 0-12 4-14" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".6"/><path d="M34 20c0-5 3-10 6-12" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".4"/><rect x="10" y="46" width="44" height="6" rx="3" stroke="currentColor" stroke-width="3"/></svg>'
      },
      {
        name: 'Minuman',
        bg: 'bg-gradient-to-br from-sky-50 to-cyan-100',
        iconColor: 'text-cyan-600',
        icon: '<svg class="h-8 w-8" viewBox="0 0 64 64" fill="none"><path d="M20 16h24l-3 36H23L20 16z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M18 16h28" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M26 16V10c0-1.5 1.5-3 6-3s6 1.5 6 3v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".5"/><ellipse cx="32" cy="30" rx="7" ry="3" stroke="currentColor" stroke-width="1.5" opacity=".3"/><path d="M29 24c-.5-2 .5-4 3-4s3.5 2 3 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".4"/><path d="M44 22c4 1 7 4 7 7s-2 5-5 5h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".5"/></svg>'
      },
      {
        name: 'Craft',
        bg: 'bg-gradient-to-br from-violet-50 to-purple-100',
        iconColor: 'text-violet-600',
        icon: '<svg class="h-8 w-8" viewBox="0 0 64 64" fill="none"><path d="M32 8L22 48h20L32 8z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><ellipse cx="32" cy="50" rx="14" ry="5" stroke="currentColor" stroke-width="3"/><path d="M27 48c0-8 2-12 5-18" stroke="currentColor" stroke-width="1.5" opacity=".4"/><path d="M37 48c0-8-2-12-5-18" stroke="currentColor" stroke-width="1.5" opacity=".4"/><circle cx="32" cy="26" r="3" stroke="currentColor" stroke-width="2" opacity=".4"/><path d="M14 34c2-2 5-1 6 1s0 5-2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".5"/><path d="M50 28c-2-2-5-1-6 1s0 5 2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".5"/></svg>'
      },
      {
        name: 'Fashion & Aksesoris',
        bg: 'bg-gradient-to-br from-rose-50 to-pink-100',
        iconColor: 'text-rose-500',
        icon: '<svg class="h-8 w-8" viewBox="0 0 64 64" fill="none"><path d="M22 12h20v6c0 4-4 8-10 8S22 22 22 18v-6z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M22 18L14 56h36L42 18" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M22 12c-4-2-8 0-10 4l6 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M42 12c4-2 8 0 10 4l-6 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="38" r="2" fill="currentColor" opacity=".3"/><circle cx="32" cy="46" r="2" fill="currentColor" opacity=".3"/></svg>'
      },
      {
        name: 'Pertanian',
        bg: 'bg-gradient-to-br from-emerald-50 to-green-100',
        iconColor: 'text-emerald-600',
        icon: '<svg class="h-8 w-8" viewBox="0 0 64 64" fill="none"><path d="M32 56V28" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M32 28c-8-2-14-10-12-18 8 0 14 6 14 14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" fill-opacity=".08"/><path d="M32 36c8-2 16-10 14-20-8 0-16 8-16 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" fill-opacity=".08"/><path d="M24 28c-1-4 0-10 4-14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".4"/><path d="M40 34c2-3 2-8-1-13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".4"/><path d="M12 56h40" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>'
      },
      {
        name: 'Jasa',
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-100',
        iconColor: 'text-blue-600',
        icon: '<svg class="h-8 w-8" viewBox="0 0 64 64" fill="none"><path d="M12 36c0-4 4-8 10-8 4 0 6 2 10 2s6-2 10-2c6 0 10 4 10 8v4c0 2-1 3-3 3H15c-2 0-3-1-3-3v-4z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><circle cx="26" cy="20" r="5" stroke="currentColor" stroke-width="2.5"/><circle cx="38" cy="20" r="5" stroke="currentColor" stroke-width="2.5"/><path d="M20 46v6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M32 44v8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M44 46v6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>'
      }
    ];

    var mobileGrid = categoryShowcase.querySelector('[data-cat-mobile-grid]');
    var desktopTrack = categoryShowcase.querySelector('[data-cat-desktop-track]');
    var prevBtn = categoryShowcase.querySelector('[data-cat-prev]');
    var nextBtn = categoryShowcase.querySelector('[data-cat-next]');
    var pagination = categoryShowcase.querySelector('[data-cat-pagination]');

    var mobileCard = function (item) {
      return (
        '<a href="halaman_kategori.html" class="flex h-[130px] w-[120px] flex-col items-center justify-center gap-3 border-r border-b border-slate-200 p-3 text-center transition hover:bg-slate-50 group">' +
          '<div class="flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ' + item.bg + ' ' + item.iconColor + ' transition group-hover:scale-110 group-hover:shadow-md">' +
            item.icon +
          '</div>' +
          '<p class="text-xs font-semibold text-slate-700 leading-tight">' + item.name + '</p>' +
        '</a>'
      );
    };

    var desktopCard = function (item) {
      return (
        '<a href="halaman_kategori.html" class="flex flex-col items-center justify-center gap-3 py-6 px-4 text-center transition hover:bg-slate-50 group">' +
          '<div class="flex h-[68px] w-[68px] items-center justify-center rounded-2xl shadow-sm ' + item.bg + ' ' + item.iconColor + ' transition duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:-translate-y-1">' +
            item.icon +
          '</div>' +
          '<p class="text-sm font-semibold leading-tight text-slate-700 group-hover:text-slate-900 transition">' + item.name + '</p>' +
        '</a>'
      );
    };

    if (mobileGrid) {
      mobileGrid.style.gridTemplateRows = 'repeat(2, 1fr)';
      mobileGrid.style.gridTemplateColumns = 'repeat(3, 120px)';
      mobileGrid.innerHTML = categories.map(mobileCard).join('');
    }

    if (desktopTrack) {
      desktopTrack.innerHTML =
        '<div class="grid grid-cols-6 divide-x divide-slate-200">' +
          categories.map(desktopCard).join('') +
        '</div>';
    }

    // Sembunyikan pagination & nav buttons (tidak perlu scroll untuk 6 kategori)
    if (pagination) pagination.classList.add('hidden');
    if (prevBtn) { prevBtn.classList.add('hidden'); prevBtn.classList.remove('flex'); }
    if (nextBtn) { nextBtn.classList.add('hidden'); nextBtn.classList.remove('flex'); }
  }

  var mainImage = document.querySelector('[data-main-image]');
  var thumbnails = document.querySelectorAll('[data-thumb]');

  if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach(function (button) {
      button.addEventListener('click', function () {
        var imageUrl = button.dataset.thumb;
        if (imageUrl) {
          mainImage.src = imageUrl;
        }

        thumbnails.forEach(function (item) {
          item.classList.remove('border-blue-500');
          item.classList.add('border-slate-200');
        });

        button.classList.remove('border-slate-200');
        button.classList.add('border-blue-500');
      });
    });
  }

  var qtyInput = document.querySelector('[data-qty-input]');
  var qtyPlus = document.querySelector('[data-qty-plus]');
  var qtyMinus = document.querySelector('[data-qty-minus]');

  if (qtyInput) {
    var normalizeQtyInput = function () {
      var nextValue = parseInt(qtyInput.value, 10);
      if (Number.isNaN(nextValue) || nextValue < 1) {
        nextValue = 1;
      }
      qtyInput.value = String(nextValue);
    };

    qtyPlus && qtyPlus.addEventListener('click', function () {
      normalizeQtyInput();
      qtyInput.value = String(parseInt(qtyInput.value, 10) + 1);
    });

    qtyMinus && qtyMinus.addEventListener('click', function () {
      normalizeQtyInput();
      qtyInput.value = String(Math.max(1, parseInt(qtyInput.value, 10) - 1));
    });

    qtyInput.addEventListener('input', normalizeQtyInput);
  }

  var cartItems = document.querySelectorAll('[data-cart-item]');

  if (cartItems.length > 0) {
    var toRupiah = function (value) {
      return 'Rp ' + new Intl.NumberFormat('id-ID').format(value);
    };

    var recalculateCart = function () {
      var totalItems = 0;
      var subtotal = 0;
      var discount = 600000;

      cartItems.forEach(function (item) {
        var qtyField = item.querySelector('[data-cart-qty]');
        var itemSubtotal = item.querySelector('[data-item-subtotal]');
        var unitPrice = parseInt(item.dataset.price || '0', 10);
        var qty = parseInt(qtyField.value || '1', 10);

        if (Number.isNaN(qty) || qty < 1) {
          qty = 1;
          qtyField.value = '1';
        }

        var lineTotal = unitPrice * qty;
        totalItems += qty;
        subtotal += lineTotal;

        if (itemSubtotal) {
          itemSubtotal.textContent = toRupiah(lineTotal);
        }
      });

      var tax = Math.round(subtotal * 0.11);
      var grandTotal = Math.max(0, subtotal + tax - discount);

      var summaryItems = document.querySelector('[data-summary-items]');
      var summarySubtotal = document.querySelector('[data-summary-subtotal]');
      var summaryTax = document.querySelector('[data-summary-tax]');
      var summaryTotal = document.querySelector('[data-summary-total]');

      if (summaryItems) {
        summaryItems.textContent = String(totalItems);
      }

      if (summarySubtotal) {
        summarySubtotal.textContent = toRupiah(subtotal);
      }

      if (summaryTax) {
        summaryTax.textContent = toRupiah(tax);
      }

      if (summaryTotal) {
        summaryTotal.textContent = toRupiah(grandTotal);
      }
    };

    cartItems.forEach(function (item) {
      var qtyField = item.querySelector('[data-cart-qty]');
      var plusButton = item.querySelector('[data-cart-plus]');
      var minusButton = item.querySelector('[data-cart-minus]');

      plusButton && plusButton.addEventListener('click', function () {
        var nextValue = parseInt(qtyField.value || '1', 10) + 1;
        qtyField.value = String(nextValue);
        recalculateCart();
      });

      minusButton && minusButton.addEventListener('click', function () {
        var currentValue = parseInt(qtyField.value || '1', 10);
        qtyField.value = String(Math.max(1, currentValue - 1));
        recalculateCart();
      });

      qtyField && qtyField.addEventListener('input', recalculateCart);
    });

    recalculateCart();
  }
});


