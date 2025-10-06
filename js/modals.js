import { t } from './i18n.js';

let paypalScriptPromise = null;

function loadPayPalScript() {
  if (paypalScriptPromise) return paypalScriptPromise;
  paypalScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-paypal-sdk]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.paypal));
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=BAAowbkGbCrbEnx8RrBHz8qELfBlAeQLKHQ0XBqpc1w2g0btRFSOg8iLhzqU6m2kAwiBtrKK1WRGCTNuco&components=hosted-buttons&disable-funding=venmo&currency=USD';
    script.async = true;
    script.dataset.paypalSdk = 'true';
    script.addEventListener('load', () => resolve(window.paypal));
    script.addEventListener('error', reject);
    document.body.appendChild(script);
  });
  return paypalScriptPromise;
}

function closeModal(modal) {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

function openModal(modal) {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable) focusable.focus();
}

export function setupModalTriggers() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    if (modal.dataset.modalInitialized) return;
    modal.addEventListener('click', event => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
    modal.querySelectorAll('.close-btn').forEach(button => {
      button.addEventListener('click', () => closeModal(modal));
    });
    modal.dataset.modalInitialized = 'true';
  });

  document.querySelectorAll('[data-modal]').forEach(trigger => {
    if (trigger.dataset.modalTriggerInitialized) return;
    trigger.addEventListener('click', async event => {
      event.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (!modal) return;
      openModal(modal);

      if (modalId === 'donate-modal') {
        const container = document.getElementById('paypal-container-5Y6FSK8RBQCQN');
        if (!container) return;
        container.textContent = '';
        const loading = document.createElement('p');
        loading.textContent = t('donate_modal_loading');
        container.appendChild(loading);
        try {
          const paypal = await loadPayPalScript();
          container.textContent = '';
          paypal.HostedButtons({ hostedButtonId: '5Y6FSK8RBQCQN' }).render('#paypal-container-5Y6FSK8RBQCQN');
        } catch (error) {
          console.error('PayPal button failed to render', error);
          container.textContent = t('donate_modal_error');
        }
      }
    });
    trigger.dataset.modalTriggerInitialized = 'true';
  });
}
