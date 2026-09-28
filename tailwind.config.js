import plugin from 'tailwindcss/plugin';
import typography from '@tailwindcss/typography';

// Design tokens. Each value is an "R G B" channel triple so Tailwind's
// opacity modifiers (e.g. bg-paper/50) keep working.
//
// Neutrals swap under the `dark` class on <html>. The accent swaps per
// product via a `data-product` attribute, which can sit on <html> (docs
// pages) or on any element (homepage rows), so the same `text-accent`
// class renders each product's color.
const neutrals = {
  light: {
    '--paper': '245 245 244', // stone-100: page background
    '--surface': '231 229 228', // stone-200: sidebar, inline code
    '--raised': '245 245 244', // stone-100: menus
    '--raised-hover': '231 229 228', // stone-200
    '--rule': '214 211 209', // stone-300: borders, dividers
    '--ink': '41 37 36', // stone-800: primary text
    '--ink-strong': '28 25 23', // stone-900: hover on primary text
    '--muted': '87 83 78', // stone-600: secondary text
    '--subtle': '120 113 108', // stone-500: labels
  },
  dark: {
    '--paper': '28 25 23', // stone-900
    '--surface': '41 37 36', // stone-800
    '--raised': '41 37 36', // stone-800
    '--raised-hover': '68 64 60', // stone-700
    '--rule': '68 64 60', // stone-700
    '--ink': '214 211 209', // stone-300
    '--ink-strong': '231 229 228', // stone-200
    '--muted': '168 162 158', // stone-400
    '--subtle': '120 113 108', // stone-500
  },
};

// accent: links and active states; strong: hover; soft: badge backgrounds.
const accents = {
  moat: {
    light: { '--accent': '3 105 161', '--accent-strong': '7 89 133', '--accent-soft': '224 242 254' }, // sky 700/800/100
    dark: { '--accent': '56 189 248', '--accent-strong': '125 211 252', '--accent-soft': '12 74 110' }, // sky 400/300/900
  },
  keep: {
    light: { '--accent': '180 83 9', '--accent-strong': '146 64 14', '--accent-soft': '254 243 199' }, // amber
    dark: { '--accent': '251 191 36', '--accent-strong': '252 211 77', '--accent-soft': '120 53 15' },
  },
  gatekeeper: {
    light: { '--accent': '4 120 87', '--accent-strong': '6 95 70', '--accent-soft': '209 250 229' }, // emerald
    dark: { '--accent': '52 211 153', '--accent-strong': '110 231 183', '--accent-soft': '6 78 59' },
  },
  harness: {
    light: { '--accent': '109 40 217', '--accent-strong': '91 33 182', '--accent-soft': '237 233 254' }, // violet
    dark: { '--accent': '167 139 250', '--accent-strong': '196 181 253', '--accent-soft': '76 29 149' },
  },
};

const tokens = plugin(({ addBase }) => {
  // Moat's sky is the site-wide default accent.
  addBase({
    ':root': { ...neutrals.light, ...accents.moat.light },
    '.dark': { ...neutrals.dark, ...accents.moat.dark },
  });
  for (const [id, { light, dark }] of Object.entries(accents)) {
    addBase({
      [`[data-product="${id}"]`]: light,
      [`.dark [data-product="${id}"], .dark[data-product="${id}"]`]: dark,
    });
  }
});

const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

// Point @tailwindcss/typography's palette at the tokens. Tokens already carry
// their dark values, so `.prose` needs no color modifier or `dark:prose-invert`.
const proseColors = {
  body: 'ink',
  headings: 'ink-strong',
  lead: 'muted',
  links: 'accent',
  bold: 'ink',
  counters: 'subtle',
  bullets: 'rule',
  hr: 'rule',
  quotes: 'ink-strong',
  'quote-borders': 'rule',
  captions: 'subtle',
  kbd: 'ink',
  code: 'ink',
  'th-borders': 'rule',
  'td-borders': 'rule',
};
const proseTokens = Object.fromEntries(
  Object.entries(proseColors).flatMap(([key, name]) => [
    [`--tw-prose-${key}`, `rgb(var(--${name}))`],
    [`--tw-prose-invert-${key}`, `rgb(var(--${name}))`],
  ]),
);

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: token('paper'),
        surface: token('surface'),
        raised: { DEFAULT: token('raised'), hover: token('raised-hover') },
        rule: token('rule'),
        ink: { DEFAULT: token('ink'), strong: token('ink-strong') },
        muted: token('muted'),
        subtle: token('subtle'),
        accent: { DEFAULT: token('accent'), strong: token('accent-strong'), soft: token('accent-soft') },
      },
      typography: {
        DEFAULT: { css: proseTokens },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'widest': '0.2em',
      },
      fontSize: {
        '2xs': '0.6875rem', // 11px
      },
    },
  },
  plugins: [typography, tokens],
}
