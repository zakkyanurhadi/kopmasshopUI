document.addEventListener('DOMContentLoaded', async function () {
  const headerHost = document.querySelector('[data-shared-header]');
  const footerHost = document.querySelector('[data-shared-footer]');

  if (!headerHost && !footerHost) return;

  try {
    var isSubFolder = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/seller/');
    const response = await fetch(isSubFolder ? '../index.html' : 'index.html');
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const header = doc.querySelector('#navbar-wrapper');
    const footer = doc.querySelector('footer');

    if (headerHost && header) {
      headerHost.innerHTML = header.outerHTML;
    }

    if (footerHost && footer) {
      footerHost.innerHTML = footer.outerHTML;
    }

    remapPrototypeLinks();
    adjustRelativePaths();
    initNavbarBehavior();
  } catch (error) {
    console.error('Failed to load shared layout:', error);
  }
});

function remapPrototypeLinks() {
  const linkMap = {
    'halaman_kategori.html': 'halaman_kategori.html',
    'halaman_product_detail.html': 'halaman_product_detail.html',
    'halaman_store_detail.html': 'halaman_store_detail.html',
    'halaman_cart.html': 'halaman_cart.html',
    'halaman_checkout.html': 'halaman_checkout.html'
  };

  document.querySelectorAll('[data-shared-header] a, [data-shared-footer] a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href) return;

    const rewritten = linkMap[href] || linkMap[href.replace('./', '')];
    if (!rewritten) return;

    if (href.startsWith('./')) {
      link.setAttribute('href', `./${rewritten}`);
      return;
    }

    link.setAttribute('href', rewritten);
  });
}

function adjustRelativePaths() {
  var isSubFolder = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/seller/');
  if (!isSubFolder) return;

  document.querySelectorAll('[data-shared-header] a, [data-shared-footer] a, [data-shared-header] img, [data-shared-footer] img').forEach(function (el) {
    const attr = el.tagName.toLowerCase() === 'img' ? 'src' : 'href';
    const value = el.getAttribute(attr);

    if (!value || /^([a-z]+:|#|\/|\/\/|mailto:|tel:|javascript:|data:)/i.test(value)) {
      return;
    }

    const normalized = value.startsWith('./') ? value.slice(2) : value;
    if (!normalized.startsWith('../')) {
      el.setAttribute(attr, `../${normalized}`);
    }
  });
}

function initNavbarBehavior() {
  const navbar = document.getElementById('navbar-wrapper');
  if (!navbar) return;

  const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const navSecondary = document.querySelector('.navbar-secondary');
  let lastScroll = 0;

  window.addEventListener('scroll', function () {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (navSecondary) {
      if (currentScroll > lastScroll && currentScroll > 100) {
        navSecondary.classList.add('sec-hidden');
      } else {
        navSecondary.classList.remove('sec-hidden');
      }
    }

    lastScroll = currentScroll;
  });

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function () {
      if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
      }
    });
  }

  document.querySelectorAll('[data-mobile-menu] a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (mobileMenu) {
        mobileMenu.classList.add('hidden');
      }
    });
  });
}
