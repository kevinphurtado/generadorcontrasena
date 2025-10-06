import { generatorTemplate } from './templates.js';
import {
  addPasswordToHistory,
  clearHistory,
  removePasswordFromHistory,
  setCopyNotificationDuration,
  state
} from './state.js';
import { applyTranslations, t } from './i18n.js';
import {
  estimateStrength,
  generateMemorablePassword,
  generatePin,
  generateRandomPassword,
  memorableWords
} from './lib/passwordGenerator.js';
import { showCopyMessage } from './notifications.js';

export function renderGeneratorView(container) {
  container.innerHTML = generatorTemplate();
  applyTranslations(container);
  initGeneratorLogic(container);
}

function initGeneratorLogic(container) {
  const elements = {
    passwordOutput: container.querySelector('#passwordOutput'),
    regenerateBtn: container.querySelector('#regenerateBtn'),
    copyBtn: container.querySelector('#copyBtn'),
    strengthBar: container.querySelector('#strengthBar'),
    complexityValue: container.querySelector('#complexityValue'),
    feedback: container.querySelector('#generatorFeedback'),
    passwordDisplay: container.querySelector('#passwordDisplay'),
    typeButtons: {
      random: container.querySelector('#randomTypeBtn'),
      memorable: container.querySelector('#memorableTypeBtn'),
      pin: container.querySelector('#pinTypeBtn')
    },
    panels: {
      random: container.querySelector('#random-options'),
      memorable: container.querySelector('#memorable-options'),
      pin: container.querySelector('#pin-options')
    },
    random: {
      lengthInput: container.querySelector('#passwordLength'),
      lengthValue: container.querySelector('#lengthValue'),
      uppercase: container.querySelector('#uppercase'),
      lowercase: container.querySelector('#lowercase'),
      numbers: container.querySelector('#numbers'),
      symbols: container.querySelector('#symbols')
    },
    memorable: {
      wordCount: container.querySelector('#wordCount'),
      wordCountValue: container.querySelector('#wordCountValue'),
      capitalize: container.querySelector('#memorableCapitalize'),
      numbers: container.querySelector('#memorableNumbers'),
      symbols: container.querySelector('#memorableSymbols'),
      separator: container.querySelector('#separator')
    },
    pin: {
      length: container.querySelector('#pinLength'),
      lengthValue: container.querySelector('#pinLengthValue')
    },
    history: {
      list: container.querySelector('#passwordHistoryList'),
      emptyMessage: container.querySelector('.no-history-message'),
      exportBtn: container.querySelector('#exportCsvBtn'),
      clearBtn: container.querySelector('#clearHistoryBtn')
    },
    notificationDuration: container.querySelector('#notificationDuration')
  };

  elements.notificationDuration.value = (state.copyNotificationDuration / 1000).toString();
  elements.notificationDuration.addEventListener('change', () => {
    const seconds = Number(elements.notificationDuration.value);
    const clamped = Math.max(1, Math.min(seconds, 10));
    elements.notificationDuration.value = clamped.toString();
    setCopyNotificationDuration(clamped * 1000);
  });

  Object.entries(elements.typeButtons).forEach(([type, button]) => {
    button.addEventListener('click', () => switchType(type, elements));
  });

  elements.random.lengthInput.addEventListener('input', () => {
    elements.random.lengthValue.textContent = elements.random.lengthInput.value;
    generatePassword(elements);
  });

  ['uppercase', 'lowercase', 'numbers', 'symbols'].forEach(key => {
    elements.random[key].addEventListener('change', () => generatePassword(elements));
  });

  elements.memorable.wordCount.addEventListener('input', () => {
    elements.memorable.wordCountValue.textContent = elements.memorable.wordCount.value;
    generatePassword(elements);
  });
  elements.memorable.capitalize.addEventListener('change', () => generatePassword(elements));
  elements.memorable.numbers.addEventListener('change', () => generatePassword(elements));
  elements.memorable.symbols.addEventListener('change', () => generatePassword(elements));
  elements.memorable.separator.addEventListener('change', () => generatePassword(elements));

  elements.pin.length.addEventListener('input', () => {
    elements.pin.lengthValue.textContent = elements.pin.length.value;
    generatePassword(elements);
  });

  elements.regenerateBtn.addEventListener('click', () => {
    generatePassword(elements, { animate: true });
  });

  elements.copyBtn.addEventListener('click', async () => {
    const password = elements.passwordOutput.value;
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      addPasswordToHistory(password);
      renderHistory(elements);
      elements.passwordDisplay.classList.add('copied');
      setTimeout(() => elements.passwordDisplay.classList.remove('copied'), 600);
      showCopyMessage();
    } catch (error) {
      console.error('Clipboard error', error);
    }
  });

  elements.history.exportBtn.addEventListener('click', () => exportHistoryToCsv());
  elements.history.clearBtn.addEventListener('click', () => {
    clearHistory();
    renderHistory(elements);
  });

  setupFaq(container);
  renderHistory(elements);
  switchType(state.generator.currentGenerationType || 'random', elements);
}

function setupFaq(container) {
  container.querySelectorAll('.faq-item').forEach(item => {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      answer.hidden = expanded;
      item.classList.toggle('active', !expanded);
    });
  });
}

function switchType(type, elements) {
  state.generator.currentGenerationType = type;
  Object.entries(elements.typeButtons).forEach(([key, button]) => {
    const isActive = key === type;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  Object.entries(elements.panels).forEach(([key, panel]) => {
    panel.hidden = key !== type;
  });
  generatePassword(elements);
}

function generatePassword(elements, { animate = false } = {}) {
  let password = '';
  let feedback = '';

  try {
    if (state.generator.currentGenerationType === 'random') {
      const useLowercase = elements.random.lowercase.checked;
      const useUppercase = elements.random.uppercase.checked;
      const useNumbers = elements.random.numbers.checked;
      const useSymbols = elements.random.symbols.checked;
      if (!useLowercase && !useUppercase && !useNumbers && !useSymbols) {
        throw new Error(t('gen_feedback_choose_charset'));
      }
      password = generateRandomPassword({
        length: Number(elements.random.lengthInput.value),
        useLowercase,
        useUppercase,
        useNumbers,
        useSymbols
      });
    } else if (state.generator.currentGenerationType === 'memorable') {
      const wordCount = Number(elements.memorable.wordCount.value);
      if (wordCount < 3 || wordCount > 8) {
        throw new Error(t('gen_feedback_word_range'));
      }
      password = generateMemorablePassword({
        wordCount,
        capitalize: elements.memorable.capitalize.checked,
        includeNumber: elements.memorable.numbers.checked,
        includeSymbol: elements.memorable.symbols.checked,
        separator: elements.memorable.separator.value,
        words: memorableWords
      });
    } else {
      const length = Number(elements.pin.length.value);
      if (length < 4 || length > 10) {
        throw new Error(t('gen_feedback_pin_range'));
      }
      password = generatePin({ length });
    }
  } catch (error) {
    feedback = error.message;
  }

  if (feedback) {
    elements.feedback.textContent = feedback;
    elements.feedback.classList.add('error');
    elements.passwordOutput.value = '';
    updateStrength('', elements);
    return;
  }

  elements.feedback.textContent = '';
  elements.feedback.classList.remove('error');
  elements.passwordOutput.value = password;
  updateStrength(password, elements);
  if (animate) {
    elements.passwordDisplay.classList.add('pulse');
    setTimeout(() => elements.passwordDisplay.classList.remove('pulse'), 500);
  }
}

function updateStrength(password, elements) {
  const { score, labelKey } = estimateStrength(password);
  const colors = ['var(--accent-weak)', 'var(--accent-weak)', 'var(--accent-weak)', 'var(--accent-medium)', 'var(--accent-strong)', 'var(--primary-color)'];
  const maxScore = 5;
  let percentage = 0;
  if (score >= 0) {
    percentage = Math.min((score / maxScore) * 100, 100);
  }
  elements.strengthBar.style.width = `${percentage}%`;
  elements.strengthBar.style.backgroundColor = colors[Math.max(0, score + 1)];
  elements.complexityValue.textContent = labelKey ? t(labelKey) : '';
}

function renderHistory(elements) {
  const hasHistory = state.passwordHistory.length > 0;
  elements.history.list.innerHTML = '';
  elements.history.emptyMessage.hidden = hasHistory;
  elements.history.exportBtn.hidden = !hasHistory;
  elements.history.clearBtn.hidden = !hasHistory;

  state.passwordHistory.forEach(item => {
    const wrapper = document.createElement('div');
    wrapper.className = 'history-item';
    const passwordSpan = document.createElement('span');
    passwordSpan.className = 'history-password';
    passwordSpan.textContent = item.password;
    const actions = document.createElement('div');
    actions.className = 'history-item-actions';

    const copyButton = document.createElement('button');
    copyButton.className = 'history-action';
    copyButton.type = 'button';
    copyButton.textContent = t('gen_history_copy');
    copyButton.addEventListener('click', async () => {
      await navigator.clipboard.writeText(item.password);
      showCopyMessage();
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'history-action';
    deleteButton.type = 'button';
    deleteButton.textContent = t('gen_history_delete');
    deleteButton.addEventListener('click', () => {
      removePasswordFromHistory(item.id);
      renderHistory(elements);
    });

    actions.append(copyButton, deleteButton);
    wrapper.append(passwordSpan, actions);
    elements.history.list.appendChild(wrapper);
  });
}

function exportHistoryToCsv() {
  if (state.passwordHistory.length === 0) return;
  const rows = ['password'];
  state.passwordHistory.forEach(item => {
    const sanitized = (item.password || '').replaceAll('"', '""');
    rows.push(`"${sanitized}"`);
  });
  const blob = new Blob([rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'password_history.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
