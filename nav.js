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
      { name: 'Elektronik', image: './assets/images/thumbnails/macbook.png' },
      { name: 'Komputer & Aksesoris', image: './assets/images/thumbnails/macbook-pro-m2.png' },
      { name: 'Handphone & Aksesoris', image: './assets/images/thumbnails/iphone-2.png' },
      { name: 'Pakaian Pria', image: './assets/images/thumbnails/backpack-1.png' },
      { name: 'Sepatu Pria', image: './assets/images/thumbnails/th-1.svg' },
      { name: 'Tas Pria', image: './assets/images/thumbnails/backpack-2.png' },
      { name: 'Aksesoris Fashion', image: './assets/images/thumbnails/th-2.svg' },
      { name: 'Jam Tangan', image: './assets/images/thumbnails/th-3.svg' },
      { name: 'Kesehatan', image: './assets/images/thumbnails/th-4.svg' },
      { name: 'Hobi & Koleksi', image: './assets/images/thumbnails/th-5.svg' },
      { name: 'Makanan & Minuman', image: './assets/images/thumbnails/headphone-beige.png' },
      { name: 'Perawatan & Kecantikan', image: './assets/images/thumbnails/headphone-pink.png' },
      { name: 'Perlengkapan Rumah', image: './assets/images/thumbnails/proof.png' },
      { name: 'Pakaian Wanita', image: './assets/images/thumbnails/backpack-3.png' },
      { name: 'Fashion Muslim', image: './assets/images/thumbnails/th-6.svg' },
      { name: 'Fashion Bayi & Anak', image: './assets/images/thumbnails/th-7.svg' },
      { name: 'Ibu & Bayi', image: './assets/images/thumbnails/ip-pink.png' },
      { name: 'Sepatu Wanita', image: './assets/images/thumbnails/iphone.png' },
      { name: 'Tas Wanita', image: './assets/images/thumbnails/backpack-4.png' },
      { name: 'Otomotif', image: './assets/images/thumbnails/xiaomi.png' },
      { name: 'Gaming', image: './assets/images/thumbnails/samsung.png' },
      { name: 'Audio & Musik', image: './assets/images/thumbnails/airpod.png' },
      { name: 'Aksesoris HP', image: './assets/images/thumbnails/ip-green.png' },
      { name: 'Smart Home', image: './assets/images/thumbnails/apple.png' }
    ];

    var cols = 10; // jumlah kolom yang tampil
    var totalCols = Math.ceil(categories.length / 2); // jumlah kolom total (2 baris)

    var mobileGrid = categoryShowcase.querySelector('[data-cat-mobile-grid]');
    var desktopTrack = categoryShowcase.querySelector('[data-cat-desktop-track]');
    var prevBtn = categoryShowcase.querySelector('[data-cat-prev]');
    var nextBtn = categoryShowcase.querySelector('[data-cat-next]');
    var pagination = categoryShowcase.querySelector('[data-cat-pagination]');

    var mobileCard = function (item) {
      return (
        '<a href="halaman_kategori.html" class="flex h-[150px] w-[140px] flex-col items-center justify-center gap-2 border-r border-b border-slate-200 p-2 text-center">' +
          '<div class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">' +
            '<img src="' + item.image + '" alt="' + item.name + '" class="h-11 w-11 object-contain">' +
          '</div>' +
          '<p class="text-sm font-medium text-slate-800 leading-tight">' + item.name + '</p>' +
        '</a>'
      );
    };

    var desktopCard = function (item) {
      return (
        '<a href="halaman_kategori.html" class="flex h-[150px] flex-col items-center justify-center gap-2 border-r border-b border-slate-200 p-2 text-center">' +
          '<div class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">' +
            '<img src="' + item.image + '" alt="' + item.name + '" class="h-11 w-11 object-contain">' +
          '</div>' +
          '<p class="text-sm font-medium leading-tight text-slate-800">' + item.name + '</p>' +
        '</a>'
      );
    };

    if (mobileGrid) {
      mobileGrid.innerHTML = categories.map(mobileCard).join('');
    }

    if (desktopTrack) {
      // Render semua kategori dalam 1 grid panjang (flow by column, 2 rows)
      var cells = categories.map(desktopCard).join('');
      // Hitung filler agar grid genap 2 baris
      var fillerCount = (totalCols * 2) - categories.length;
      for (var fill = 0; fill < fillerCount; fill++) {
        cells += '<div class="h-[150px] border-r border-b border-slate-200"></div>';
      }
      // Buat inner grid dengan id agar bisa di-update lebar kolomnya
      desktopTrack.innerHTML =
        '<div id="cat-grid" class="grid grid-rows-2 grid-flow-col">' +
          cells +
        '</div>';
    }

    // Sembunyikan pagination dots
    if (pagination) {
      pagination.classList.add('hidden');
    }

    // Wrapper scroll container (parent dari desktopTrack)
    var scrollContainer = desktopTrack ? desktopTrack.parentElement : null;
    var catGrid = document.getElementById('cat-grid');

    var applyColWidth = function () {
      if (!scrollContainer || !catGrid) return;
      var colWidth = Math.floor(scrollContainer.offsetWidth / cols);
      catGrid.style.gridTemplateColumns = 'repeat(' + totalCols + ', ' + colWidth + 'px)';
    };

    var getColWidth = function () {
      if (!scrollContainer) return 0;
      return Math.floor(scrollContainer.offsetWidth / cols);
    };

    var updateButtons = function () {
      if (!scrollContainer) return;
      var scrollLeft = Math.round(scrollContainer.scrollLeft);
      var maxScroll = scrollContainer.scrollWidth - scrollContainer.offsetWidth;
      if (prevBtn) {
        if (scrollLeft <= 0) {
          prevBtn.classList.add('hidden');
          prevBtn.classList.remove('flex');
        } else {
          prevBtn.classList.remove('hidden');
          prevBtn.classList.add('flex');
        }
      }
      if (nextBtn) {
        if (maxScroll <= 0 || scrollLeft >= maxScroll - 1) {
          nextBtn.classList.add('hidden');
          nextBtn.classList.remove('flex');
        } else {
          nextBtn.classList.remove('hidden');
          nextBtn.classList.add('flex');
        }
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateButtons);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (scrollContainer) {
          scrollContainer.scrollBy({ left: -getColWidth(), behavior: 'smooth' });
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (scrollContainer) {
          scrollContainer.scrollBy({ left: getColWidth(), behavior: 'smooth' });
        }
      });
    }

    // Terapkan kolom width setelah layout render, lalu update tombol
    setTimeout(function () {
      applyColWidth();
      updateButtons();
    }, 0);

    window.addEventListener('resize', function () {
      applyColWidth();
      updateButtons();
    });
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


