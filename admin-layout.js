/**
 * Admin Sidebar Layout – shared across all admin & seller pages.
 *
 * Usage: include in admin/seller HTML pages:
 *   <div id="admin-app"></div>
 *   <script src="../admin-layout.js" defer></script>
 *
 * Set data attributes on #admin-app:
 *   data-page-title="Dashboard"
 *   data-role="admin"  (or "seller")
 */
document.addEventListener('DOMContentLoaded', function () {
  var app = document.getElementById('admin-app');
  if (!app) return;

  var pageTitle = app.getAttribute('data-page-title') || 'Dashboard';
  var role = app.getAttribute('data-role') || 'admin';
  var mainContent = app.innerHTML;
  var basePath = '../';
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Sidebar menu items
  var menuItems = [
    {
      label: 'Overview',
      href: 'dashboard.html',
      iconDefault: 'home-black.svg',
      iconActive: 'home-blue-fill.svg',
      type: 'link',
      relatedPages: ['index.html']
    },
    {
      label: 'My Transactions',
      href: 'my-transaction.html',
      iconDefault: 'stickynote-grey.svg',
      iconActive: 'stickynote-blue-fill.svg',
      type: 'link',
      visibleFor: ['admin', 'seller']
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
      iconDefault: 'wallet-2-black.svg',
      type: 'accordion',
      id: 'acc-wallet',
      children: [
        { label: 'Store Wallet', href: 'store-balance-list.html', iconDefault: 'empty-wallet-grey.svg', iconActive: 'wallet-3-blue-fill.svg', visibleFor: ['admin'], relatedPages: ['store-balance-detail.html'] },
        { label: 'My Wallet', href: 'my-store-balance.html', iconDefault: 'empty-wallet-grey.svg', iconActive: 'wallet-3-blue-fill.svg', visibleFor: ['seller'] },
        { label: 'Withdrawal', href: 'withdrawal-list.html', iconDefault: 'empty-wallet-grey.svg', iconActive: 'wallet-3-blue-fill.svg', relatedPages: ['withdrawal-create.html', 'withdrawal-detail.html'] }
      ]
    },
    {
      label: 'Manage Users',
      href: 'user-list.html',
      iconDefault: 'profile-2user-black.svg',
      iconActive: 'profile-2user-blue-fill.svg',
      type: 'link',
      visibleFor: ['admin']
    }
  ];

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

  function buildSidebarItem(item) {
    var active = isPageActive(item);
    return '<li>' +
      '<a href="' + item.href + '" class="sidebar-item' + (active ? ' active' : '') + ' flex items-center w-full min-h-14 gap-2 rounded-2xl overflow-hidden py-[10px] pl-4 transition-300">' +
        '<div class="relative flex size-6 shrink-0">' +
          '<img src="' + iconPath(item.iconDefault) + '" class="icon-default size-6 absolute opacity-100 transition-300" alt="icon">' +
          '<img src="' + iconPath(item.iconActive) + '" class="icon-active size-6 absolute opacity-0 transition-300" alt="icon">' +
        '</div>' +
        '<p class="sidebar-label font-medium transition-300 w-full">' + item.label + '</p>' +
        '<div class="active-bar w-2 h-9 shrink-0 rounded-l-xl bg-custom-blue hidden transition-300"></div>' +
      '</a>' +
    '</li>';
  }

  function buildAccordion(item) {
    var visibleChildren = item.children.filter(isVisible);
    if (visibleChildren.length === 0) return '';

    var hasActiveChild = visibleChildren.some(isPageActive);
    var isOpen = hasActiveChild;

    var branchLines = '';
    for (var b = 0; b < Math.max(0, visibleChildren.length - 1); b++) {
      branchLines += '<div class="branch-line"></div>';
    }

    var childrenHtml = '';
    visibleChildren.forEach(function(child) {
      var active = isPageActive(child);
      childrenHtml += '<li class="relative">' +
        '<div class="curve-branch"></div>' +
        '<a href="' + child.href + '" class="sidebar-item' + (active ? ' active' : '') + ' flex items-center w-full min-h-14 gap-2 rounded-2xl overflow-hidden py-[10px] pl-4 transition-300">' +
          '<div class="relative flex size-6 shrink-0">' +
            '<img src="' + iconPath(child.iconDefault) + '" class="icon-default size-6 absolute opacity-100 transition-300" alt="icon">' +
            '<img src="' + iconPath(child.iconActive) + '" class="icon-active size-6 absolute opacity-0 transition-300" alt="icon">' +
          '</div>' +
          '<p class="sidebar-label font-medium text-custom-grey transition-300 w-full">' + child.label + '</p>' +
          '<div class="active-bar w-2 h-9 shrink-0 rounded-l-xl bg-custom-blue hidden transition-300"></div>' +
        '</a>' +
      '</li>';
    });

    return '<li class="flex flex-col">' +
      '<button onclick="toggleAccordion(\'' + item.id + '\')" class="flex items-center w-full min-h-14 gap-2 rounded-2xl overflow-hidden py-[10px] pl-4 transition-300">' +
        '<div class="relative flex size-6 shrink-0">' +
          '<img src="' + iconPath(item.iconDefault) + '" class="size-6" alt="icon">' +
        '</div>' +
        '<p class="font-medium transition-300 w-full text-left">' + item.label + '</p>' +
        '<img src="' + iconPath('arrow-circle-up-black.svg') + '" id="' + item.id + '-arrow" class="size-6 shrink-0 transition-300' + (isOpen ? '' : ' rotate-180') + '" alt="icon">' +
      '</button>' +
      '<div id="' + item.id + '"' + (isOpen ? '' : ' class="hidden"') + '>' +
        '<div class="flex">' +
          '<div class="flex w-[56px] shrink-0 justify-end items-start relative">' + branchLines + '</div>' +
          '<ul class="flex flex-col gap-1 w-full">' + childrenHtml + '</ul>' +
        '</div>' +
      '</div>' +
    '</li>';
  }

  // Build sidebar HTML
  var sidebarMenuHtml = '';
  menuItems.forEach(function(item) {
    if (!isVisible(item)) return;
    if (item.type === 'link') {
      sidebarMenuHtml += buildSidebarItem(item);
    } else if (item.type === 'accordion') {
      sidebarMenuHtml += buildAccordion(item);
    }
  });

  var roleName = role === 'admin' ? 'admin' : 'seller';
  var userName = role === 'admin' ? 'Admin User' : 'Seller User';

  var layoutHtml = '' +
  '<div id="main-container" class="flex flex-1 min-w-0">' +
    '<!-- SIDEBAR -->' +
    '<aside class="relative flex h-auto w-[280px] shrink-0 bg-white">' +
      '<div class="flex flex-col fixed top-0 w-[280px] shrink-0 h-screen pt-[30px] px-4 gap-[30px] bg-white">' +
        '<a href="../index.html"><img src="' + basePath + 'assets/images/logos/logokopmas.png" class="h-8 w-fit" alt="logo"></a>' +
        '<div class="flex flex-col gap-5 overflow-y-scroll hide-scrollbar h-full overscroll-contain">' +
          '<nav class="flex flex-col gap-4">' +
            '<p class="font-medium text-custom-grey">Main Menu</p>' +
            '<ul class="flex flex-col gap-2">' + sidebarMenuHtml + '</ul>' +
          '</nav>' +
        '</div>' +
      '</div>' +
    '</aside>' +
    '<!-- CONTENT -->' +
    '<div id="Content" class="flex flex-col flex-1 p-6 pt-0 min-w-0">' +
      '<div id="Top-Bar" class="flex items-center w-full gap-6 mt-[30px] mb-6">' +
        '<div class="flex items-center gap-6 h-[102px] bg-white w-full rounded-3xl p-[18px]">' +
          '<div class="flex flex-col gap-2 w-full">' +
            '<h1 class="font-bold text-2xl capitalize">' + pageTitle + '</h1>' +
            '<p class="flex items-center gap-1 font-semibold text-custom-grey leading-none">View Your Dashboard</p>' +
          '</div>' +
          '<div class="flex items-center flex-nowrap gap-3">' +
            '<a href="#"><div class="flex size-14 rounded-full bg-custom-icon-background items-center justify-center overflow-hidden"><img src="' + iconPath('search-normal-black.svg') + '" class="size-6" alt="icon"></div></a>' +
            '<a href="#"><div class="flex size-14 rounded-full bg-custom-icon-background items-center justify-center overflow-hidden"><img src="' + iconPath('notification-black.svg') + '" class="size-6" alt="icon"></div></a>' +
          '</div>' +
        '</div>' +
        '<div class="flex items-center gap-3 h-[102px] bg-white w-fit rounded-3xl p-[18px]">' +
          '<div class="flex rounded-full overflow-hidden size-14">' +
            '<img src="' + iconPath('photo-profile-default.svg') + '" class="size-full object-cover" alt="photo">' +
          '</div>' +
          '<div class="flex flex-col gap-[6px] min-w-[155px] w-fit">' +
            '<p class="font-semibold text-lg leading-tight">' + userName + '</p>' +
            '<p class="flex items-center gap-1 font-semibold text-custom-grey text-lg leading-none">' +
              '<img src="' + iconPath('user-grey.svg') + '" class="size-[18px]" alt="icon">' +
              roleName +
            '</p>' +
          '</div>' +
          '<a href="../login.html" class="flex w-6"><img src="' + iconPath('logout.svg') + '" class="flex size-6 shrink-0" alt="icon"></a>' +
        '</div>' +
      '</div>' +
      '<main class="flex flex-col gap-5 flex-1">' + mainContent + '</main>' +
    '</div>' +
  '</div>';

  app.innerHTML = layoutHtml;
});

function toggleAccordion(id) {
  var el = document.getElementById(id);
  var arrow = document.getElementById(id + '-arrow');
  if (!el) return;
  if (el.classList.contains('hidden')) {
    el.classList.remove('hidden');
    if (arrow) arrow.classList.remove('rotate-180');
  } else {
    el.classList.add('hidden');
    if (arrow) arrow.classList.add('rotate-180');
  }
}
