
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
      '.branch-line{position:absolute;top:10px;bottom:40px;left:calc(100% - 22px);width:2px;background-color:#e5e7eb;border-radius:999px;transform:none!important;}' +
      '.branch-line:last-child{height:auto!important;}' +
      '.curve-branch{position:absolute;left:-22px;top:0;width:22px;height:28px;border-left:2px solid #e5e7eb;border-bottom:2px solid #e5e7eb;border-bottom-left-radius:14px;background:transparent;z-index:1;transform:none;}';
    document.head.appendChild(connectorStyle);
  }

  /* ── Sidebar menu items ─────────────────────────────────── */
  var menuItems = [
    {
      label: 'Dashboard',
      href: 'dashboard.html',
      iconDefault: 'home-black.svg',
      iconActive: 'home-blue-fill.svg',
      type: 'link',
      relatedPages: ['index.html']
    },
    {
      label: 'Manage Product',
      iconDefault: 'box-black.svg',
      type: 'accordion',
      id: 'acc-product',
      children: [
        { label: 'Categories', href: 'category-list.html', iconDefault: 'bag-grey.svg', iconActive: 'bag-blue-fill.svg', relatedPages: ['category-create.html', 'category-detail.html', 'category-edit.html'] },
        { label: 'Products', href: 'product-list.html', iconDefault: 'bag-grey.svg', iconActive: 'bag-blue-fill.svg', relatedPages: ['product-create.html', 'product-detail.html', 'product-edit.html'] }
      ]
    },
    {
      label: 'Manage Store',
      iconDefault: 'bag-2-black.svg',
      type: 'accordion',
      id: 'acc-store',
      children: [
        { label: 'List Store', href: 'store-list.html', iconDefault: 'shop-grey.svg', iconActive: 'shop-blue-fill.svg', visibleFor: ['admin'], relatedPages: ['store-create.html', 'store-detail.html', 'store-edit.html'] },
        { label: 'My Store', href: 'my-store.html', iconDefault: 'shop-grey.svg', iconActive: 'shop-blue-fill.svg', visibleFor: ['seller'] },
        { label: 'List Transaction', href: 'transaction-list.html', iconDefault: 'stickynote-grey.svg', iconActive: 'stickynote-blue-fill.svg', relatedPages: ['transaction-detail.html'] }
      ]
    },
    {
      label: 'Manage Wallet',
      href: 'manage-wallet.html',
      iconDefault: 'wallet-2-black.svg',
      iconActive: 'wallet-3-blue-fill.svg',
      type: 'link',
      relatedPages: ['store-balance-list.html', 'store-balance-detail.html', 'my-store-balance.html', 'withdrawal-list.html', 'withdrawal-create.html', 'withdrawal-detail.html']
    },
    {
      label: 'Manage Users',
      href: 'manage-users.html',
      iconDefault: 'profile-2user-black.svg',
      iconActive: 'profile-2user-blue-fill.svg',
      type: 'link',
      relatedPages: ['user-list.html']
    },
    {
      label: 'Manage Reviews',
      href: 'manage-reviews.html',
      iconDefault: 'stickynote-grey.svg',
      iconActive: 'stickynote-blue-fill.svg',
      type: 'link'
    },
    {
      label: 'Settings',
      href: 'settings.html',
      iconDefault: 'setting-2-grey.svg',
      iconActive: 'setting-2-grey.svg',
      type: 'link'
    }
  ];

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
    var visibleChildren = item.children.filter(isVisible);
    if (visibleChildren.length === 0) return '';

    var hasActiveChild = visibleChildren.some(isPageActive);
    var isOpen = hasActiveChild;

    var branchLines = visibleChildren.length > 0 ? '<div class="branch-line"></div>' : '';

    var childrenHtml = '';
    visibleChildren.forEach(function (child) {
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
        '<button class="relative flex items-center justify-center size-11 rounded-xl hover:bg-gray-100 transition-300">' +
          svgBell +
          '<span class="absolute top-2 right-2 flex size-2 rounded-full bg-red-500 ring-2 ring-white"></span>' +
        '</button>' +
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

  /* ── Close dropdown on outside click ──────────────────────── */
  document.addEventListener('click', function (e) {
    var dd = document.getElementById('avatar-dropdown');
    var btn = document.getElementById('avatar-btn');
    if (dd && btn && !btn.contains(e.target) && !dd.contains(e.target)) {
      dd.classList.add('hidden');
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
  var dd = document.getElementById('avatar-dropdown');
  if (dd) dd.classList.toggle('hidden');
}
