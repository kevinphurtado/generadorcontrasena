import { setCurrentTheme, state } from './state.js';

export function applyTheme(theme) {
  document.body.classList.toggle('dark-mode', theme === 'dark');
  const themeButton = document.getElementById('themeBtn');
  if (themeButton) {
    const icon = themeButton.querySelector('[data-theme-icon]');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    themeButton.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }
  setCurrentTheme(theme);
}

export function toggleTheme() {
  const nextTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
  state.currentTheme = nextTheme;
  applyTheme(nextTheme);
}
