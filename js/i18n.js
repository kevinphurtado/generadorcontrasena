const cache = new Map();
let currentTranslations = {};
let currentLanguage = 'es';

async function fetchTranslations(lang) {
  if (cache.has(lang)) return cache.get(lang);
  const response = await fetch(`./translations/${lang}.json`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`No se pudieron cargar las traducciones para ${lang}`);
  }
  const data = await response.json();
  cache.set(lang, data);
  return data;
}

export async function setLanguage(lang) {
  try {
    currentTranslations = await fetchTranslations(lang);
    currentLanguage = lang;
    document.documentElement.setAttribute('lang', lang);
    applyTranslations();
  } catch (error) {
    console.error(error);
    if (!Object.keys(currentTranslations).length && lang !== 'es') {
      await setLanguage('es');
    }
  }
}

export function getCurrentLanguage() {
  return currentLanguage;
}

export function t(key, replacements = {}) {
  const value = currentTranslations[key];
  if (!value) return key;
  return Object.entries(replacements).reduce((acc, [token, replacement]) => acc.replaceAll(`{{${token}}}`, replacement), value);
}

export function applyTranslations(root = document) {
  root.querySelectorAll('[data-translate-key]').forEach(element => {
    const key = element.getAttribute('data-translate-key');
    const translated = t(key);
    if (translated && element instanceof HTMLInputElement) {
      element.setAttribute('placeholder', translated);
    } else if (translated) {
      element.textContent = translated;
    }
  });

  root.querySelectorAll('[data-translate-attrs]').forEach(element => {
    const entries = element.getAttribute('data-translate-attrs');
    if (!entries) return;
    entries.split(',').forEach(pair => {
      const [attr, key] = pair.split(':').map(item => item.trim());
      if (!attr || !key) return;
      const translated = t(key);
      if (translated) {
        element.setAttribute(attr, translated);
      }
    });
  });
}
