const storageAvailable = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function readJSON(key, fallback) {
  if (!storageAvailable) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`No se pudo leer ${key} de localStorage`, error);
    return fallback;
  }
}

function writeJSON(key, value) {
  if (!storageAvailable) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`No se pudo guardar ${key} en localStorage`, error);
  }
}

function readString(key, fallback) {
  if (!storageAvailable) return fallback;
  const value = window.localStorage.getItem(key);
  return value || fallback;
}

export const state = {
  currentApp: 'generator',
  currentLang: 'es',
  currentTheme: 'light',
  copyNotificationDuration: 2000,
  passwordHistory: [],
  verifier: {
    exposureCheckTimeout: null,
    exposureCheckCount: 0,
    isPasswordExposed: false,
    exposureCount: 0,
    hasUserOptedExposure: false
  },
  generator: {
    currentGenerationType: 'random'
  }
};

export function hydrateState() {
  state.currentLang = readString('language', state.currentLang);
  state.currentTheme = readString('theme', state.currentTheme);
  state.copyNotificationDuration = Number(readString('copyNotificationDuration', String(state.copyNotificationDuration)));
  if (Number.isNaN(state.copyNotificationDuration) || state.copyNotificationDuration <= 0) {
    state.copyNotificationDuration = 2000;
  }
  state.passwordHistory = readJSON('passwordHistory', []);
  state.verifier.hasUserOptedExposure = readString('verifierExposureOptIn', 'false') === 'true';
}

export function setCurrentApp(appName) {
  state.currentApp = appName;
}

export function setCurrentLang(lang) {
  state.currentLang = lang;
  if (storageAvailable) window.localStorage.setItem('language', lang);
}

export function setCurrentTheme(theme) {
  state.currentTheme = theme;
  if (storageAvailable) window.localStorage.setItem('theme', theme);
}

export function setCopyNotificationDuration(milliseconds) {
  state.copyNotificationDuration = milliseconds;
  if (storageAvailable) window.localStorage.setItem('copyNotificationDuration', String(milliseconds));
}

export function setExposureOptIn(value) {
  state.verifier.hasUserOptedExposure = value;
  if (storageAvailable) window.localStorage.setItem('verifierExposureOptIn', value ? 'true' : 'false');
}

export function addPasswordToHistory(password) {
  if (!password) return;
  if (state.passwordHistory.some(item => item.password === password)) return;
  state.passwordHistory.unshift({ id: Date.now(), password });
  if (state.passwordHistory.length > 50) {
    state.passwordHistory.length = 50;
  }
  writeJSON('passwordHistory', state.passwordHistory);
}

export function removePasswordFromHistory(id) {
  state.passwordHistory = state.passwordHistory.filter(item => item.id !== id);
  writeJSON('passwordHistory', state.passwordHistory);
}

export function clearHistory() {
  state.passwordHistory = [];
  if (storageAvailable) window.localStorage.removeItem('passwordHistory');
}
