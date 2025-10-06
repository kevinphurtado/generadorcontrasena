import { state } from './state.js';
import { t } from './i18n.js';

let copyTimeoutId = null;

export function showCopyMessage() {
  const message = document.getElementById('copyMessage');
  if (!message) return;
  message.textContent = t('copied_message');
  message.classList.add('show');
  message.setAttribute('aria-hidden', 'false');
  clearTimeout(copyTimeoutId);
  copyTimeoutId = setTimeout(() => {
    message.classList.remove('show');
    message.setAttribute('aria-hidden', 'true');
  }, state.copyNotificationDuration);
}
