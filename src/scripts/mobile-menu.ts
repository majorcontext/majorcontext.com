const toggle = document.getElementById('mobile-menu-toggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');

function openSidebar(): void {
  sidebar?.classList.remove('-translate-x-full');
  overlay?.classList.remove('hidden');
  toggle?.setAttribute('aria-expanded', 'true');
  sidebar?.setAttribute('aria-hidden', 'false');
}

function closeSidebar(): void {
  sidebar?.classList.add('-translate-x-full');
  overlay?.classList.add('hidden');
  toggle?.setAttribute('aria-expanded', 'false');
  sidebar?.setAttribute('aria-hidden', 'true');
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
const links = sidebar?.querySelectorAll('a');
links?.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  });
});
