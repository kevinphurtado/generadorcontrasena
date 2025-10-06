import { verifierTemplate } from './templates.js';
import { applyTranslations, t } from './i18n.js';
import { evaluatePassword, checkPasswordExposure } from './lib/passwordVerifier.js';
import { setExposureOptIn, state } from './state.js';

export function renderVerifierView(container) {
  container.innerHTML = verifierTemplate();
  applyTranslations(container);
  initVerifierLogic(container);
}

function initVerifierLogic(container) {
  const elements = {
    passwordInput: container.querySelector('#passwordInput'),
    togglePassword: container.querySelector('#togglePassword'),
    strengthBar: container.querySelector('#strength-bar'),
    messageBox: container.querySelector('#message-box'),
    messageTitle: container.querySelector('#message-title'),
    messageDetails: container.querySelector('#message-details'),
    criteria: {
      length: container.querySelector('[data-criterion="length"]'),
      uppercase: container.querySelector('[data-criterion="uppercase"]'),
      numbers: container.querySelector('[data-criterion="numbers"]'),
      symbols: container.querySelector('[data-criterion="symbols"]'),
      exposure: container.querySelector('[data-criterion="exposure"]')
    },
    exposureOptIn: container.querySelector('#exposureOptIn'),
    exposureButton: container.querySelector('#checkExposureBtn'),
    checkingExposure: container.querySelector('#checking-exposure')
  };

  const exposureState = {
    hasChecked: false,
    exposed: false,
    count: 0
  };

  elements.exposureOptIn.checked = state.verifier.hasUserOptedExposure;
  elements.exposureButton.disabled = !state.verifier.hasUserOptedExposure;

  elements.exposureOptIn.addEventListener('change', () => {
    const isChecked = elements.exposureOptIn.checked;
    setExposureOptIn(isChecked);
    elements.exposureButton.disabled = !isChecked || !elements.passwordInput.value;
    exposureState.hasChecked = false;
    updateMessage({ score: 0, results: {}, password: elements.passwordInput.value }, elements, exposureState);
  });

  elements.togglePassword.addEventListener('click', () => {
    const isPassword = elements.passwordInput.type === 'password';
    elements.passwordInput.type = isPassword ? 'text' : 'password';
    elements.togglePassword.setAttribute('aria-label', isPassword ? t('ver_toggle_hide') : t('ver_toggle_show'));
    elements.togglePassword.textContent = isPassword ? t('ver_toggle_hide') : t('ver_toggle_show');
  });

  elements.passwordInput.addEventListener('input', () => {
    const password = elements.passwordInput.value;
    const evaluation = evaluatePassword(password);
    exposureState.hasChecked = false;
    exposureState.exposed = false;
    exposureState.count = 0;
    updateChecklist(evaluation.results, elements);
    updateMessage({ ...evaluation, password }, elements, exposureState);
    elements.exposureButton.disabled = !elements.exposureOptIn.checked || !password;
  });

  elements.exposureButton.addEventListener('click', async () => {
    const password = elements.passwordInput.value;
    if (!password) return;
    try {
      elements.exposureButton.disabled = true;
      elements.checkingExposure.hidden = false;
      const { exposed, count } = await checkPasswordExposure(password);
      exposureState.hasChecked = true;
      exposureState.exposed = exposed;
      exposureState.count = count;
      const evaluation = evaluatePassword(password);
      updateMessage({ ...evaluation, password }, elements, exposureState);
    } catch (error) {
      console.error(error);
      elements.messageBox.className = 'ver-message-box exposed';
      elements.messageTitle.textContent = t('ver_status_weak_title');
      elements.messageDetails.textContent = t('ver_exposure_error');
      elements.messageBox.style.display = 'flex';
      elements.criteria.exposure.classList.remove('active', 'exposed');
    } finally {
      elements.checkingExposure.hidden = true;
      elements.exposureButton.disabled = !elements.exposureOptIn.checked || !elements.passwordInput.value;
    }
    updateChecklist(evaluatePassword(elements.passwordInput.value).results, elements);
  });

  updateChecklist({ length: false, uppercase: false, numbers: false, symbols: false }, elements);
  updateMessage({ score: 0, results: {}, password: '' }, elements, exposureState);
}

function updateChecklist(results, elements) {
  Object.entries(elements.criteria).forEach(([key, element]) => {
    if (key === 'exposure') {
      return;
    }
    element.classList.toggle('active', Boolean(results[key]));
  });
}

function updateMessage({ score, results, password }, elements, exposureState) {
  const baseChecks = Object.keys(results).length;
  let effectiveScore = score;
  if (exposureState.hasChecked) {
    if (exposureState.exposed) {
      elements.criteria.exposure.classList.add('exposed');
      elements.criteria.exposure.classList.remove('active');
    } else {
      elements.criteria.exposure.classList.add('active');
      elements.criteria.exposure.classList.remove('exposed');
      effectiveScore += 1;
    }
  } else {
    elements.criteria.exposure.classList.remove('active', 'exposed');
  }

  if (!password) {
    elements.messageBox.style.display = 'none';
    elements.strengthBar.style.width = '0%';
    return;
  }

  const totalChecks = baseChecks + 1; // exposure is the additional check
  const percentage = Math.min((effectiveScore / totalChecks) * 100, 100);
  elements.strengthBar.style.width = `${percentage}%`;
  elements.messageBox.style.display = 'flex';

  if (exposureState.hasChecked && exposureState.exposed) {
    elements.messageBox.className = 'ver-message-box exposed';
    elements.messageTitle.textContent = t('ver_status_compromised_title');
    elements.messageDetails.textContent = t('ver_status_compromised_desc', { count: exposureState.count.toLocaleString() });
    return;
  }

  if (effectiveScore === totalChecks) {
    elements.messageBox.className = 'ver-message-box success';
    elements.messageTitle.textContent = t('ver_status_strong_title');
    elements.messageDetails.textContent = t('ver_status_strong_desc');
  } else {
    elements.messageBox.className = 'ver-message-box weak';
    elements.messageTitle.textContent = t('ver_status_weak_title');
    elements.messageDetails.textContent = t('ver_status_weak_desc');
  }
}
