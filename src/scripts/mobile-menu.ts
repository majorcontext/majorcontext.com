const toggle = document.getElementById('mobile-menu-toggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
const sidebarLinks = sidebar ? Array.from(sidebar.querySelectorAll('a')) : [];

// The sidebar is only actually off-screen (hidden) below the md breakpoint
// while closed -- at md+ `md:translate-x-0` keeps it permanently visible.
const desktopQuery = window.matchMedia('(min-width: 768px)');

function isOpen(): boolean {
  return !sidebar?.classList.contains('-translate-x-full');
}

/**
 * Keeps aria-hidden and focusability of the sidebar's nav links in sync with
 * whether it's actually visible. Without this, the sidebar was aria-hidden
 * unconditionally while its links stayed in the tab order -- a WCAG
 * aria-hidden-focus violation -- and remained wrong at md+ where the
 * sidebar is always visible.
 */
function syncSidebarAccessibility(): void {
  const hidden = !desktopQuery.matches && !isOpen();
  sidebar?.setAttribute('aria-hidden', String(hidden));
  sidebarLinks.forEach((link) => {
    if (hidden) {
      link.setAttribute('tabindex', '-1');
    } else {
      link.removeAttribute('tabindex');
    }
  });
}

function openSidebar(): void {
  sidebar?.classList.remove('-translate-x-full');
  overlay?.classList.remove('hidden');
  toggle?.setAttribute('aria-expanded', 'true');
  syncSidebarAccessibility();
}

function closeSidebar(): void {
  sidebar?.classList.add('-translate-x-full');
  overlay?.classList.add('hidden');
  toggle?.setAttribute('aria-expanded', 'false');
  syncSidebarAccessibility();
}

toggle?.addEventListener('click', () => {
  if (sidebar?.classList.contains('-translate-x-full')) {
    openSidebar();
  } else {
    closeSidebar();
  }
});

overlay?.addEventListener('click', closeSidebar);

// Close sidebar on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !sidebar?.classList.contains('-translate-x-full')) {
    closeSidebar();
  }
});

// Close sidebar on navigation (mobile only)
sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  });
});

syncSidebarAccessibility();
desktopQuery.addEventListener('change', syncSidebarAccessibility);
