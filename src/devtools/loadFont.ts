/**
 * Dynamically loads a Google Font by injecting a <link> into <head>.
 * Deduplicates — calling with the same family twice is a no-op.
 */

const loaded = new Set<string>();

const GOOGLE_FONTS_MAP: Record<string, string> = {
  'Inter': 'Inter:wght@300;400;500;600;700',
  'Geist': 'Geist:wght@300;400;500;600;700',
  'Plus Jakarta Sans': 'Plus+Jakarta+Sans:wght@300;400;500;600;700',
  'Outfit': 'Outfit:wght@300;400;500;600;700',
  'Sora': 'Sora:wght@300;400;500;600;700',
  'Space Grotesk': 'Space+Grotesk:wght@400;500;600;700',
  'Lora': 'Lora:wght@400;500;600;700',
  'Merriweather': 'Merriweather:wght@300;400;700',
  'Playfair Display': 'Playfair+Display:wght@400;500;600;700',
  'JetBrains Mono': 'JetBrains+Mono:wght@400;500;600;700',
  'Fira Code': 'Fira+Code:wght@400;500;600;700',
  'DM Sans': 'DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700',
  'DM Mono': 'DM+Mono:wght@400;500',
  'Georama': 'Georama:wght@400;500;600;700',
};

export function loadFont(familyString: string): void {
  // Extract the first quoted font name from a CSS font-family string
  const match = familyString.match(/"([^"]+)"/);
  const name = match ? match[1] : familyString.split(',')[0]?.trim();
  if (!name || loaded.has(name)) return;

  const googleParam = GOOGLE_FONTS_MAP[name];
  if (!googleParam) return; // Not a Google Font we know about

  loaded.add(name);

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${googleParam}&display=swap`;
  document.head.appendChild(link);
}
