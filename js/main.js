import { renderGeneratorView } from './generator.js';
import { renderVerifierView } from './verifier.js';
import { setupModalTriggers } from './modals.js';
import { applyTheme, toggleTheme } from './theme.js';
import { applyTranslations, setLanguage } from './i18n.js';
import { hydrateState, setCurrentApp, setCurrentLang, state } from './state.js';

let appContainer;
let appToggle;
let themeButton;
let translateButton;

async function switchApp(appName) {
  setCurrentApp(appName);
  appToggle.checked = appName === 'verifier';
  if (appName === 'generator') {
    renderGeneratorView(appContainer);
  } else {
    renderVerifierView(appContainer);
  }
  applyTranslations(document);
  setupModalTriggers();
}

async function handleLanguageToggle() {
  const nextLang = state.currentLang === 'es' ? 'en' : 'es';
  setCurrentLang(nextLang);
  await setLanguage(nextLang);
  await switchApp(state.currentApp);
}

function setupEventListeners() {
  appToggle.addEventListener('change', () => {
    switchApp(appToggle.checked ? 'verifier' : 'generator');
  });
  themeButton.addEventListener('click', () => {
    toggleTheme();
  });
  translateButton.addEventListener('click', handleLanguageToggle);
}

document.addEventListener('DOMContentLoaded', async () => {
  hydrateState();
  appContainer = document.getElementById('app-container');
  appToggle = document.getElementById('appToggle');
  themeButton = document.getElementById('themeBtn');
  translateButton = document.getElementById('translateBtn');

  applyTheme(state.currentTheme);
  await setLanguage(state.currentLang);
  setupEventListeners();
  await switchApp(state.currentApp || 'generator');
  setupModalTriggers();
});
