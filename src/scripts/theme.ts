export type Theme = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'theme';

/** Returns the user's stored preference, defaulting to 'system'. */
export function getTheme(): Theme {
  if (typeof localStorage === 'undefined') return 'system';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

/** Resolves 'system' to the actual light/dark value based on OS preference. */
export function getResolvedTheme(theme?: Theme): 'light' | 'dark' {
  const t = theme ?? getTheme();
  if (t === 'light' || t === 'dark') return t;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Applies the given theme: persists to localStorage and toggles the `dark` class on <html>. */
export function applyTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme);
  const resolved = getResolvedTheme(theme);
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

/** Listens for OS color-scheme changes and re-applies when in system mode. */
export function initThemeListener(): void {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getTheme() === 'system') {
      applyTheme('system');
    }
  });
}
