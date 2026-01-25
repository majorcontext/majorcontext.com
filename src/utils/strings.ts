/**
 * Convert a string to title case (capitalize first letter of each word)
 * @param str - String to convert (e.g., "getting-started" or "getting_started")
 * @returns Title cased string (e.g., "Getting Started")
 */
export function titleCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert a filename to a URL-friendly slug
 * Removes number prefixes and .md extension
 * @param filename - Filename to convert (e.g., "01-introduction.md")
 * @returns Slug without prefix or extension (e.g., "introduction")
 */
export function slugify(filename: string): string {
  return filename.replace(/^\d+-/, '').replace(/\.md$/, '');
}
