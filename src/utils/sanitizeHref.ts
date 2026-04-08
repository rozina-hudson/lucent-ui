/**
 * Returns the href unchanged if it uses a safe protocol (http, https, mailto, tel,
 * or relative path), otherwise returns `undefined` to prevent navigation.
 *
 * Blocks `javascript:`, `data:`, `vbscript:`, and any other executable protocol
 * that could be used for XSS via href injection.
 */
export function sanitizeHref(href: string | undefined): string | undefined {
  if (href === undefined) return undefined;

  const trimmed = href.replace(/[\s\u0000-\u001F]+/g, '').toLowerCase();

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('?') ||
    trimmed.startsWith('.')
  ) {
    return href;
  }

  // Block anything with an explicit protocol we don't recognise
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return undefined;
  }

  // Bare relative path (e.g. "about", "page/2")
  return href;
}
