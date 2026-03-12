
document.addEventListener('DOMContentLoaded', function () {
  var app = document.getElementById('admin-app');
  if (!app) return;

  var pageTitle = app.getAttribute('data-page-title') || 'Dashboard';
  var role = app.getAttribute('data-role') || 'admin';
  var mainContent = app.innerHTML;
  var basePath = '../';
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';

  var connectorStyleId = 'sidebar-connector-fix-style';
  if (!document.getElementById(connectorStyleId)) {
    var connectorStyle = document.createElement('style');
    connectorStyle.id = connectorStyleId;
    connectorStyle.textContent = '' +
      '.branch-line{position:absolute;top:10px;bottom:40px;left:calc(100% - 22px);width:1px;background-color:#e5e7eb;border-radius:999px;transform:none!important;}' +
      '.branch-line:last-child{height:auto!important;}' +
      '.curve-branch{position:absolute;left:-22px;top:0;width:22px;height:28px;border-left:2px solid #e5e7eb;border-bottom:2px solid #e5e7eb;border-bottom-left-radius:14px;background:transparent;z-index:1;transform:none;}';
    document.head.appendChild(connectorStyle);
  }

  /* ── Sidebar menu items ─────────────────────────────────── */
  //
  // visibleFor: array of roles yang boleh lihat item ini.
  //   ['admin']          → hanya admin
  //   ['seller']         → hanya seller
  //   ['admin','seller'] → keduanya
  // Jika TIDAK ada visibleFor → tampil untuk semua role.
  //
  var menuItems = [
    // ── Dashboard ───────────────────────────────────────────────
    {
      label: 'Dashboard',
      href: 'dashboard.html',
      iconDefault: 'home-black.svg',
      iconActive: 'home-blue-fill.svg',
      type: 'link',
      visibleFor: ['admin', 'seller'],
      relatedPages: ['index.html']
    },

    // ── Manage Store ─────────────────────────────────────────────
    {
      label: 'Manage Store',
      iconDefault: 'bag-2-black.svg',
      type: 'accordion',
      id: 'acc-store',
      children: [
        // === Admin children ===
        {
          label: 'List Store',
          href: 'store-list.html',
          iconDefault: 'shop-grey.svg',
          iconActive: 'shop-blue-fill.svg',
          visibleFor: ['admin'],
          relatedPages: ['store-create.html', 'store-detail.html', 'store-edit.html']
        },
        {
          label: 'List Transaction',
          href: 'transaction-list.html',
          iconDefault: 'stickynote-grey.svg',
          iconActive: 'stickynote-blue-fill.svg',
          visibleFor: ['admin'],
          relatedPages: ['transaction-detail.html']
        },

        // === Seller children ===
        {
          label: 'Profile',
          href: 'store-profile.html',
          iconDefault: 'shop-grey.svg',
          iconActive: 'shop-blue-fill.svg',
          visibleFor: ['seller'],
          relatedPages: ['store-profile-edit.html']
        },
        {
          label: 'Alamat Toko',
          href: 'store-address.html',
          iconDefault: 'shop-grey.svg',
          iconActive: 'shop-blue-fill.svg',
          visibleFor: ['seller']
        },
        {
          label: 'Payment',
          href: 'store-payment-method.html',
          iconDefault: 'wallet-grey.svg',
          iconActive: 'wallet-blue-fill.svg',
          visibleFor: ['seller']
        }
      ]
    },

    // ── Manage Product ───────────────────────────────────────────
    {
      label: 'Manage Product',
      iconDefault: 'box-black.svg',
      type: 'accordion',
      id: 'acc-product',
      children: [
        {
          label: 'Categories',
          href: 'category-list.html',
          iconDefault: 'bag-grey.svg',
          iconActive: 'bag-blue-fill.svg',
          visibleFor: ['admin'],
          relatedPages: ['category-create.html', 'category-detail.html', 'category-edit.html']
        },
        {
          label: 'Products',
          href: 'product-list.html',
          iconDefault: 'bag-grey.svg',
          iconActive: 'bag-blue-fill.svg',
          visibleFor: ['admin', 'seller'],
          relatedPages: ['product-create.html', 'product-detail.html', 'product-edit.html']
        }
      ]
    },

    // ── Manage Orders (seller) ───────────────────────────────────
    {
      label: 'Manage Orders',
      href: 'manage-orders.html',
      iconDefault: 'stickynote-grey.svg',
      iconActive: 'stickynote-blue-fill.svg',
      type: 'link',
      visibleFor: ['seller'],
      relatedPages: ['order-detail.html']
    },

    // ── Sales Report (seller) ────────────────────────────────────
    {
      label: 'Sales Report',
      href: 'sales-report.html',
      iconDefault: 'presention-chart-grey.svg',
      iconActive: 'presention-chart-blue.svg',
      type: 'link',
      visibleFor: ['seller']
    },

    // ── Manage Wallet ────────────────────────────────────────────
    {
      label: 'Manage Wallet',
      href: 'manage-wallet.html',
      iconDefault: 'wallet-2-black.svg',
      iconActive: 'wallet-3-blue-fill.svg',
      type: 'link',
      visibleFor: ['admin'],
      relatedPages: [
        'store-balance-list.html', 'store-balance-detail.html',
        'my-store-balance.html', 'withdrawal-list.html',
        'withdrawal-create.html', 'withdrawal-detail.html'
      ]
    },

    // ── Manage Users (admin only) ────────────────────────────────
    {
      label: 'Manage Users',
      href: 'manage-users.html',
      iconDefault: 'profile-2user-black.svg',
      iconActive: 'profile-2user-blue-fill.svg',
      type: 'link',
      visibleFor: ['admin'],
      relatedPages: ['user-list.html']
    },

    // ── Manage Reviews (admin only) ──────────────────────────────
    {
      label: 'Manage Reviews',
      href: 'manage-reviews.html',
      iconDefault: 'stickynote-grey.svg',
      iconActive: 'stickynote-blue-fill.svg',
      type: 'link',
      visibleFor: ['admin']
    },

    // ── Settings ─────────────────────────────────────────────────
    {
      label: 'Settings',
      href: 'settings.html',
      iconDefault: 'setting-2-grey.svg',
      iconActive: 'setting-2-grey.svg',
      type: 'link',
      visibleFor: ['admin']
    }
  ];

  /* ── Build nested sub-group (Payment, dll) ────────────── */
  function buildNestedGroup(group) {
    var visibleItems = (group.children || []).filter(isVisible);
    if (visibleItems.length === 0) return '';

    var gId = group.id;
    var hasActive = visibleItems.some(isPageActive);

    var itemsHtml = '';
    visibleItems.forEach(function (child) {
      var active = isPageActive(child);
      itemsHtml += '<li class="relative">' +
        '<div class="curve-branch"></div>' +
        '<a href="' + child.href + '" class="sidebar-item' + (active ? ' active' : '') +
          ' flex items-center w-full min-h-[44px] gap-3 rounded-xl overflow-hidden py-2 pl-4 pr-3 transition-300 hover:bg-gray-50">' +
          '<div class="relative flex size-[18px] shrink-0">' +
            '<img src="' + iconPath(child.iconDefault) + '" class="icon-default size-[18px] absolute opacity-100 transition-300" alt="">' +
            '<img src="' + iconPath(child.iconActive) + '" class="icon-active size-[18px] absolute opacity-0 transition-300" alt="">' +
          '</div>' +
          '<p class="sidebar-label font-medium text-[13px] text-custom-grey transition-300 w-full">' + child.label + '</p>' +
          '<div class="active-bar w-[3px] h-7 shrink-0 rounded-l-lg bg-custom-blue hidden transition-300"></div>' +
        '</a>' +
      '</li>';
    });

    return '<li class="relative">' +
      '<div class="curve-branch"></div>' +
      '<button onclick="toggleAccordion(\'' + gId + '\')" ' +
        'class="flex items-center w-full min-h-[44px] gap-3 rounded-xl overflow-hidden py-2 pl-4 pr-3 transition-300 hover:bg-gray-50">' +
        '<div class="relative flex size-[18px] shrink-0">' +
          '<img src="' + iconPath(group.iconDefault) + '" class="size-[18px]" alt="">' +
        '</div>' +
        '<p class="font-medium text-[13px] text-custom-grey text-left w-full">' + group.label + '</p>' +
        '<svg id="' + gId + '-arrow" class="size-4 shrink-0 mr-1 transition-300 text-gray-400' + (hasActive ? ' rotate-90' : '') + '" ' +
          'fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">' +
          '<path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/>' +
        '</svg>' +
      '</button>' +
      '<div id="' + gId + '"' + (hasActive ? '' : ' class="hidden"') + '>' +
        '<div class="flex">' +
          '<div class="flex w-[44px] shrink-0 justify-end items-start relative">' +
            '<div class="branch-line"></div>' +
          '</div>' +
          '<ul class="flex flex-col gap-1 w-full">' + itemsHtml + '</ul>' +
        '</div>' +
      '</div>' +
    '</li>';
  }

  /* ── Helpers ─────────────────────────────────────────────── */
  function isPageActive(item) {
    if (item.href === currentPage) return true;
    if (item.relatedPages && item.relatedPages.indexOf(currentPage) !== -1) return true;
    return false;
  }

  function isVisible(item) {
    if (!item.visibleFor) return true;
    return item.visibleFor.indexOf(role) !== -1;
  }

  function iconPath(name) {
    return basePath + 'assets/images/icons/' + name;
  }

  /* ── Build sidebar items ─────────────────────────────────── */
  function buildSidebarItem(item) {
    var active = isPageActive(item);
    return '<li>' +
      '<a href="' + item.href + '" class="sidebar-item' + (active ? ' active' : '') + ' flex items-center w-full min-h-[50px] gap-4 rounded-xl overflow-hidden py-3 pl-5 pr-3 transition-300 hover:bg-gray-50">' +
        '<div class="relative flex size-[22px] shrink-0">' +
          '<img src="' + iconPath(item.iconDefault) + '" class="icon-default size-[22px] absolute opacity-100 transition-300" alt="">' +
          '<img src="' + iconPath(item.iconActive) + '" class="icon-active size-[22px] absolute opacity-0 transition-300" alt="">' +
        '</div>' +
        '<p class="sidebar-label font-medium text-[15px] transition-300 w-full">' + item.label + '</p>' +
        '<div class="active-bar w-[3px] h-9 shrink-0 rounded-l-lg bg-custom-blue hidden transition-300"></div>' +
      '</a>' +
    '</li>';
  }

  function buildAccordion(item) {
    // Filter children berdasarkan visibleFor (flat items & groups)
    var visibleChildren = (item.children || []).filter(function(child) {
      if (child.type === 'group') return isVisible(child);
      return isVisible(child);
    });
    if (visibleChildren.length === 0) return '';

    var hasActiveChild = visibleChildren.some(function(child) {
      if (child.type === 'group') return (child.children || []).some(isPageActive);
      return isPageActive(child);
    });
    var isOpen = hasActiveChild;

    var branchLines = '<div class="branch-line"></div>';

    var childrenHtml = '';
    visibleChildren.forEach(function (child) {
      // Sub-group (nested accordion)
      if (child.type === 'group') {
        childrenHtml += buildNestedGroup(child);
        return;
      }
      // Regular child link
      var active = isPageActive(child);
      childrenHtml += '<li class="relative">' +
        '<div class="curve-branch"></div>' +
        '<a href="' + child.href + '" class="sidebar-item' + (active ? ' active' : '') + ' flex items-center w-full min-h-[50px] gap-4 rounded-xl overflow-hidden py-3 pl-5 pr-3 transition-300 hover:bg-gray-50">' +
          '<div class="relative flex size-[22px] shrink-0">' +
            '<img src="' + iconPath(child.iconDefault) + '" class="icon-default size-[22px] absolute opacity-100 transition-300" alt="">' +
            '<img src="' + iconPath(child.iconActive) + '" class="icon-active size-[22px] absolute opacity-0 transition-300" alt="">' +
          '</div>' +
          '<p class="sidebar-label font-medium text-[15px] text-custom-grey transition-300 w-full">' + child.label + '</p>' +
          '<div class="active-bar w-[3px] h-9 shrink-0 rounded-l-lg bg-custom-blue hidden transition-300"></div>' +
        '</a>' +
      '</li>';
    });

    return '<li class="flex flex-col">' +
      '<button onclick="toggleAccordion(\'' + item.id + '\')" class="flex items-center w-full min-h-[50px] gap-4 rounded-xl overflow-hidden py-3 pl-5 pr-3 transition-300 hover:bg-gray-50">' +
        '<div class="relative flex size-[22px] shrink-0">' +
          '<img src="' + iconPath(item.iconDefault) + '" class="size-[22px]" alt="">' +
        '</div>' +
        '<p class="font-medium text-[15px] transition-300 w-full text-left">' + item.label + '</p>' +
        '<svg id="' + item.id + '-arrow" class="size-5 shrink-0 mr-1 transition-300 text-gray-400' + (isOpen ? ' rotate-90' : '') + '" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/></svg>' +
      '</button>' +
      '<div id="' + item.id + '"' + (isOpen ? '' : ' class="hidden"') + '>' +
        '<div class="flex">' +
          '<div class="flex w-[52px] shrink-0 justify-end items-start relative">' + branchLines + '</div>' +
          '<ul class="flex flex-col gap-1 w-full">' + childrenHtml + '</ul>' +
        '</div>' +
      '</div>' +
    '</li>';
  }

  /* ── Build sidebar menu ──────────────────────────────────── */
  var sidebarMenuHtml = '';
  menuItems.forEach(function (item) {
    if (!isVisible(item)) return;
    if (item.type === 'link') {
      sidebarMenuHtml += buildSidebarItem(item);
    } else if (item.type === 'accordion') {
      sidebarMenuHtml += buildAccordion(item);
    }
  });

  var roleName = role === 'admin' ? 'Admin' : 'Seller';
  var userName = role === 'admin' ? 'Admin User' : 'Seller User';

  /* ── Inline SVG icons for the navbar ─────────────────────── */
  var svgHamburger = '<svg class="size-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>';
  var svgBell = '<svg class="size-[22px] text-gray-500" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
  var svgGlobe = '<svg class="size-[22px] text-gray-500" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>';
  var svgSun = '<svg class="size-[22px] text-gray-500" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  var svgGrid = '<svg class="size-[22px] text-gray-500" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>';
  var svgChevron = '<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7"/></svg>';
  var svgUser = '<svg class="size-[18px] text-gray-500" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  var svgSettings = '<svg class="size-[18px] text-gray-500" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
  var svgLogout = '<svg class="size-[18px] text-gray-500" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';
  var svgClose = '<svg class="size-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M18 6 6 18M6 6l12 12"/></svg>';
  var svgCollapseLeft = '<svg class="size-4" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6"/></svg>';

  /* ── LAYOUT HTML ─────────────────────────────────────────── */
  var layoutHtml = '' +

  /* Overlay for mobile sidebar */
  '<div id="sidebar-overlay" class="fixed inset-0 bg-black/40 z-40 hidden lg:hidden transition-300" onclick="closeSidebar()"></div>' +

  /* SIDEBAR */
  '<aside id="sidebar" class="fixed top-0 left-0 z-50 flex flex-col w-[280px] h-screen bg-white border-r border-gray-100 transition-300 -translate-x-full lg:translate-x-0 lg:z-30">' +
    /* Logo area */
    '<div class="flex items-center justify-between h-[76px] px-6 shrink-0">' +
      '<a href="../index.html" class="flex items-center gap-2">' +
        '<img src="' + basePath + 'assets/images/logos/logokopmas.png" class="h-12 w-auto" alt="Kopmas Shop">' +
      '</a>' +
      /* Close button (mobile) */
      '<button onclick="closeSidebar()" class="lg:hidden flex items-center justify-center size-9 rounded-full hover:bg-gray-100 transition-300 text-gray-500">' + svgClose + '</button>' +
    '</div>' +
    /* Menu */
    '<div class="flex flex-col flex-1 overflow-y-auto hide-scrollbar px-5 py-6">' +
      '<p class="text-[11px] font-bold uppercase tracking-widest text-custom-grey/60 mb-4 pl-5">Main Menu</p>' +
      '<ul class="flex flex-col gap-[6px]">' + sidebarMenuHtml + '</ul>' +
    '</div>' +
  '</aside>' +

  /* MAIN WRAPPER (pushed right by sidebar on desktop) */
  '<div id="main-wrapper" class="flex flex-col flex-1 min-w-0 lg:ml-[280px] transition-300">' +

    /* FLOATING TOP NAVBAR */
    '<div class="sticky top-0 z-30 px-4 lg:px-6 pt-4 lg:pt-5 pb-2 bg-[#f3f5f9]">' +
    '<header id="top-navbar" class="flex items-center h-[64px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl px-4 lg:px-6 gap-4">' +
      /* Hamburger (mobile) */
      '<button id="btn-hamburger" onclick="openSidebar()" class="lg:hidden flex items-center justify-center size-11 rounded-xl hover:bg-gray-100 transition-300 text-gray-600 shrink-0">' + svgHamburger + '</button>' +
      '<div class="flex-1 min-w-0 flex items-center gap-3">' +
        '<div class="min-w-0 hidden sm:flex flex-col">' +
          '<p class="text-[11px] tracking-wide uppercase text-custom-grey">Current Page</p>' +
          '<p class="text-[15px] font-semibold text-custom-black truncate">' + pageTitle + '</p>' +
        '</div>' +
      '</div>' +
      /* Navbar icons */
      '<div class="flex items-center gap-2 sm:gap-3">' +
        '<div class="relative">' +
          '<button id="notif-btn" onclick="toggleNotificationDropdown(event)" class="relative flex items-center justify-center size-11 rounded-xl hover:bg-gray-100 transition-300">' +
            svgBell +
            '<span id="notif-badge" class="absolute top-2 right-2 flex size-2 rounded-full bg-red-500 ring-2 ring-white"></span>' +
          '</button>' +
          '<div id="notif-dropdown" class="hidden absolute right-0 top-full mt-3 w-[calc(100vw-2rem)] sm:w-[380px] bg-white rounded-xl shadow-xl ring-1 ring-gray-100 overflow-hidden z-50">' +
            '<div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">' +
              '<div class="flex items-center gap-2">' +
                '<img src="' + iconPath('notification-black.svg') + '" class="size-5" alt="Notifikasi">' +
                '<p class="font-semibold text-[15px] text-custom-black">Notifikasi</p>' +
              '</div>' +
              '<button onclick="clearNotifications(event)" class="text-[12px] font-semibold text-custom-blue hover:underline">Hapus Semua</button>' +
            '</div>' +
            '<p id="notif-count" class="px-4 pt-2 pb-3 text-xs text-custom-grey">4 notifikasi terbaru</p>' +
            '<div class="max-h-[360px] overflow-y-auto hide-scrollbar px-3 pb-3 flex flex-col gap-2 bg-[#fafbfc]">' +
              '<article data-notif-item class="rounded-xl bg-white border border-gray-100 p-3">' +
                '<div class="flex items-start gap-3">' +
                  '<div class="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50">' +
                    '<img src="' + iconPath('stickynote-blue-fill.svg') + '" class="size-4" alt="Order">' +
                  '</div>' +
                  '<div class="min-w-0 flex-1">' +
                    '<p class="font-semibold text-[13px] text-custom-black">Pesanan baru #INV-2024-00157</p>' +
                    '<p class="text-xs text-custom-grey mt-1">Segera proses pesanan dari Rina Pratama.</p>' +
                    '<p class="text-[11px] text-custom-grey/80 mt-2">2 menit lalu</p>' +
                  '</div>' +
                  '<button onclick="removeNotification(this, event)" class="flex size-7 items-center justify-center rounded-full hover:bg-red-50 transition-300" aria-label="Hapus notifikasi">' +
                    '<img src="' + iconPath('note-remove-grey.svg') + '" class="size-4" alt="Hapus">' +
                  '</button>' +
                '</div>' +
              '</article>' +
              '<article data-notif-item class="rounded-xl bg-white border border-gray-100 p-3">' +
                '<div class="flex items-start gap-3">' +
                  '<div class="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-50">' +
                    '<img src="' + iconPath('wallet-2-blue-fill.svg') + '" class="size-4" alt="Pembayaran">' +
                  '</div>' +
                  '<div class="min-w-0 flex-1">' +
                    '<p class="font-semibold text-[13px] text-custom-black">Pembayaran berhasil diterima</p>' +
                    '<p class="text-xs text-custom-grey mt-1">Dana Rp 1.750.000 dari #INV-2024-00155 sudah masuk.</p>' +
                    '<p class="text-[11px] text-custom-grey/80 mt-2">15 menit lalu</p>' +
                  '</div>' +
                  '<button onclick="removeNotification(this, event)" class="flex size-7 items-center justify-center rounded-full hover:bg-red-50 transition-300" aria-label="Hapus notifikasi">' +
                    '<img src="' + iconPath('note-remove-grey.svg') + '" class="size-4" alt="Hapus">' +
                  '</button>' +
                '</div>' +
              '</article>' +
              '<article data-notif-item class="rounded-xl bg-white border border-gray-100 p-3">' +
                '<div class="flex items-start gap-3">' +
                  '<div class="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-50">' +
                    '<img src="' + iconPath('car-delivery-black.svg') + '" class="size-4" alt="Pengiriman">' +
                  '</div>' +
                  '<div class="min-w-0 flex-1">' +
                    '<p class="font-semibold text-[13px] text-custom-black">Pesanan siap dikirim</p>' +
                    '<p class="text-xs text-custom-grey mt-1">Jadwalkan pengiriman untuk 3 pesanan hari ini.</p>' +
                    '<p class="text-[11px] text-custom-grey/80 mt-2">1 jam lalu</p>' +
                  '</div>' +
                  '<button onclick="removeNotification(this, event)" class="flex size-7 items-center justify-center rounded-full hover:bg-red-50 transition-300" aria-label="Hapus notifikasi">' +
                    '<img src="' + iconPath('note-remove-grey.svg') + '" class="size-4" alt="Hapus">' +
                  '</button>' +
                '</div>' +
              '</article>' +
              '<article data-notif-item class="rounded-xl bg-white border border-gray-100 p-3">' +
                '<div class="flex items-start gap-3">' +
                  '<div class="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-50">' +
                    '<img src="' + iconPath('card-send-orange-fill.svg') + '" class="size-4" alt="Saldo">' +
                  '</div>' +
                  '<div class="min-w-0 flex-1">' +
                    '<p class="font-semibold text-[13px] text-custom-black">Saldo toko diperbarui</p>' +
                    '<p class="text-xs text-custom-grey mt-1">Saldo Anda sekarang Rp 12.450.000.</p>' +
                    '<p class="text-[11px] text-custom-grey/80 mt-2">3 jam lalu</p>' +
                  '</div>' +
                  '<button onclick="removeNotification(this, event)" class="flex size-7 items-center justify-center rounded-full hover:bg-red-50 transition-300" aria-label="Hapus notifikasi">' +
                    '<img src="' + iconPath('note-remove-grey.svg') + '" class="size-4" alt="Hapus">' +
                  '</button>' +
                '</div>' +
              '</article>' +
              '<div id="notif-empty" class="hidden rounded-xl bg-white border border-dashed border-gray-200 p-4 text-center">' +
                '<p class="text-sm font-semibold text-custom-black">Tidak ada notifikasi</p>' +
                '<p class="text-xs text-custom-grey mt-1">Semua notifikasi sudah dibersihkan</p>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        /* Avatar + dropdown trigger */
        '<div class="relative ml-2">' +
          '<button id="avatar-btn" onclick="toggleAvatarDropdown()" class="flex items-center gap-2.5 rounded-full hover:bg-gray-50 p-1 transition-300">' +
            '<div class="relative">' +
              '<img src="' + iconPath('photo-profile-default.svg') + '" class="size-[42px] rounded-full object-cover ring-2 ring-gray-200" alt="avatar">' +
              '<span class="absolute bottom-0.5 right-0.5 size-[10px] rounded-full bg-green-500 ring-2 ring-white"></span>' +
            '</div>' +
          '</button>' +
          /* Dropdown */
          '<div id="avatar-dropdown" class="hidden absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-xl ring-1 ring-gray-100 py-2 z-50">' +
            '<div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100">' +
              '<img src="' + iconPath('photo-profile-default.svg') + '" class="size-11 rounded-full object-cover" alt="">' +
              '<div class="flex flex-col">' +
                '<p class="font-semibold text-[15px]">' + userName + '</p>' +
                '<p class="text-sm text-custom-grey">' + roleName + '</p>' +
              '</div>' +
            '</div>' +
            '<div class="py-1">' +
              '<a href="#" class="flex items-center gap-3 px-5 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-300">' + svgUser + ' My Profile</a>' +
              '<a href="#" class="flex items-center gap-3 px-5 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-300">' + svgSettings + ' Settings</a>' +
            '</div>' +
            '<div class="border-t border-gray-100 pt-1">' +
              '<a href="../login.html" class="flex items-center gap-3 px-5 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-300">' + svgLogout + ' Log Out</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</header>' +
    '</div>' +

    /* PAGE CONTENT */
    '<div class="flex flex-col flex-1 p-5 lg:p-8 min-w-0">' +
      /* Mobile page title */
      '<h1 class="lg:hidden font-bold text-xl text-custom-black capitalize mb-5">' + pageTitle + '</h1>' +
      '<main class="flex flex-col gap-6 flex-1">' + mainContent + '</main>' +
    '</div>' +

  '</div>';

  app.innerHTML = layoutHtml;
  updateNotificationUI();

  /* ── Close dropdown on outside click ──────────────────────── */
  document.addEventListener('click', function (e) {
    var dd = document.getElementById('avatar-dropdown');
    var btn = document.getElementById('avatar-btn');
    var notif = document.getElementById('notif-dropdown');
    var notifBtn = document.getElementById('notif-btn');
    if (dd && btn && !btn.contains(e.target) && !dd.contains(e.target)) {
      dd.classList.add('hidden');
    }
    if (notif && notifBtn && !notifBtn.contains(e.target) && !notif.contains(e.target)) {
      notif.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeNotificationDropdown();
    }
  });
});

/* ── Global functions ─────────────────────────────────────────── */
function toggleAccordion(id) {
  var el = document.getElementById(id);
  var arrow = document.getElementById(id + '-arrow');
  if (!el) return;
  if (el.classList.contains('hidden')) {
    el.classList.remove('hidden');
    if (arrow) arrow.classList.add('rotate-90');
  } else {
    el.classList.add('hidden');
    if (arrow) arrow.classList.remove('rotate-90');
  }
}

function openSidebar() {
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('-translate-x-full');
  if (overlay) overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.add('-translate-x-full');
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

function toggleSidebarCollapse() {
  var sidebar = document.getElementById('sidebar');
  var mainWrapper = document.getElementById('main-wrapper');
  if (!sidebar || !mainWrapper) return;
  if (sidebar.classList.contains('-translate-x-full')) {
    sidebar.classList.remove('-translate-x-full');
    mainWrapper.classList.remove('lg:ml-0');
    mainWrapper.classList.add('lg:ml-[280px]');
  } else {
    sidebar.classList.add('-translate-x-full');
    mainWrapper.classList.remove('lg:ml-[280px]');
    mainWrapper.classList.add('lg:ml-0');
  }
}

function toggleAvatarDropdown() {
  closeNotificationDropdown();
  var dd = document.getElementById('avatar-dropdown');
  if (dd) dd.classList.toggle('hidden');
}

function toggleNotificationDropdown(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  var dd = document.getElementById('notif-dropdown');
  if (!dd) return;

  var avatarDropdown = document.getElementById('avatar-dropdown');
  if (avatarDropdown) avatarDropdown.classList.add('hidden');
  dd.classList.toggle('hidden');
}

function closeNotificationDropdown() {
  var dd = document.getElementById('notif-dropdown');
  if (dd) dd.classList.add('hidden');
}

function removeNotification(btn, e) {
  if (e && e.stopPropagation) e.stopPropagation();
  var item = btn && btn.closest ? btn.closest('[data-notif-item]') : null;
  if (item) item.remove();
  updateNotificationUI();
}

function clearNotifications(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  var dropdown = document.getElementById('notif-dropdown');
  if (!dropdown) return;
  var items = dropdown.querySelectorAll('[data-notif-item]');
  items.forEach(function (item) { item.remove(); });
  updateNotificationUI();
}

function updateNotificationUI() {
  var dropdown = document.getElementById('notif-dropdown');
  var countEl = document.getElementById('notif-count');
  var badgeEl = document.getElementById('notif-badge');
  var emptyEl = document.getElementById('notif-empty');
  if (!dropdown) return;

  var count = dropdown.querySelectorAll('[data-notif-item]').length;
  if (countEl) {
    countEl.textContent = count > 0 ? count + ' notifikasi terbaru' : 'Tidak ada notifikasi baru';
  }
  if (badgeEl) {
    if (count > 0) badgeEl.classList.remove('hidden');
    else badgeEl.classList.add('hidden');
  }
  if (emptyEl) {
    if (count > 0) emptyEl.classList.add('hidden');
    else emptyEl.classList.remove('hidden');
  }
}
