export function generatorTemplate() {
  return `
    <div id="generator-view" class="app-view" role="region" aria-labelledby="generator-heading">
      <div class="app-container">
        <header>
          <h1 id="generator-heading" data-translate-key="gen_main_title"></h1>
          <p class="subtitle" data-translate-key="gen_subtitle"></p>
        </header>
        <div class="gen-password-display-container" id="passwordDisplay" aria-live="polite">
          <input type="text" id="passwordOutput" readonly aria-describedby="strengthLabel" />
          <button id="regenerateBtn" class="gen-icon-btn" data-translate-attrs="aria-label:gen_generate_new">
            <span class="icon" aria-hidden="true">🔄</span>
            <span data-translate-key="gen_generate_new" class="btn-text"></span>
          </button>
          <button id="copyBtn" class="gen-icon-btn" data-translate-attrs="aria-label:gen_copy">
            <span class="icon" aria-hidden="true">📋</span>
            <span data-translate-key="gen_copy" class="btn-text"></span>
          </button>
        </div>
        <div class="gen-complexity-label">
          <span id="strengthLabel" data-translate-key="gen_strength_label"></span>
          <span id="complexityValue" class="gen-complexity-value"></span>
        </div>
        <div class="gen-strength-meter-container"><div id="strengthBar" class="gen-strength-bar"></div></div>
        <div id="generatorFeedback" class="gen-feedback" role="status" aria-live="polite"></div>
        <section class="gen-options" aria-labelledby="generator-options-heading">
          <h2 id="generator-options-heading" data-translate-key="gen_options"></h2>
          <div class="gen-type-selector" role="tablist">
            <button id="randomTypeBtn" role="tab" aria-selected="true" data-translate-key="gen_random"></button>
            <button id="memorableTypeBtn" role="tab" aria-selected="false" data-translate-key="gen_memorable"></button>
            <button id="pinTypeBtn" role="tab" aria-selected="false" data-translate-key="gen_pin"></button>
          </div>
          <div id="random-options" class="gen-options-panel">
            <label class="gen-slider-wrapper" for="passwordLength">
              <span data-translate-key="gen_length"></span>
              <input type="range" id="passwordLength" min="6" max="64" value="16" aria-valuemin="6" aria-valuemax="64" aria-valuenow="16">
              <span id="lengthValue" class="gen-slider-value">16</span>
            </label>
          <div class="gen-checkbox-group" role="group" data-translate-attrs="aria-label:gen_character_options">
              <div class="gen-checkbox-item"><input type="checkbox" id="uppercase" checked><label for="uppercase">A-Z</label></div>
              <div class="gen-checkbox-item"><input type="checkbox" id="lowercase" checked><label for="lowercase">a-z</label></div>
              <div class="gen-checkbox-item"><input type="checkbox" id="numbers" checked><label for="numbers">0-9</label></div>
              <div class="gen-checkbox-item"><input type="checkbox" id="symbols" checked><label for="symbols">!@#$</label></div>
            </div>
          </div>
          <div id="memorable-options" class="gen-options-panel" hidden>
            <label class="gen-slider-wrapper" for="wordCount">
              <span data-translate-key="gen_word_count"></span>
              <input type="range" id="wordCount" min="3" max="8" value="4" aria-valuemin="3" aria-valuemax="8" aria-valuenow="4">
              <span id="wordCountValue" class="gen-slider-value">4</span>
            </label>
            <div class="gen-checkbox-group" role="group">
              <div class="gen-checkbox-item"><input type="checkbox" id="memorableCapitalize" checked><label for="memorableCapitalize" data-translate-key="gen_capitalize"></label></div>
              <div class="gen-checkbox-item"><input type="checkbox" id="memorableNumbers" checked><label for="memorableNumbers" data-translate-key="gen_numbers"></label></div>
              <div class="gen-checkbox-item"><input type="checkbox" id="memorableSymbols"><label for="memorableSymbols" data-translate-key="gen_symbols"></label></div>
            </div>
            <label class="gen-form-group" for="separator">
              <span data-translate-key="gen_separator"></span>
              <select id="separator">
                <option value="-" data-translate-key="gen_separator_hyphen"></option>
                <option value="_" data-translate-key="gen_separator_underscore"></option>
                <option value="." data-translate-key="gen_separator_dot"></option>
                <option value=" " data-translate-key="gen_separator_space"></option>
                <option value="" data-translate-key="gen_separator_none"></option>
              </select>
            </label>
          </div>
          <div id="pin-options" class="gen-options-panel" hidden>
            <label class="gen-slider-wrapper" for="pinLength">
              <span data-translate-key="gen_length"></span>
              <input type="range" id="pinLength" min="4" max="10" value="6" aria-valuemin="4" aria-valuemax="10" aria-valuenow="6">
              <span id="pinLengthValue" class="gen-slider-value">6</span>
            </label>
          </div>
          <label class="gen-form-group" for="notificationDuration">
            <span data-translate-key="copy_duration_label"></span>
            <input type="number" id="notificationDuration" min="1" max="10" value="2">
          </label>
        </section>
        <p class="gen-local-security-message" data-translate-key="gen_local_security_message"></p>
      </div>
      <section class="extra-section" aria-labelledby="history-heading">
        <h2 id="history-heading" data-translate-key="gen_history_title"></h2>
        <div id="passwordHistoryList"><p class="no-history-message" data-translate-key="gen_history_empty"></p></div>
        <div class="history-actions-footer">
          <button id="exportCsvBtn" class="action-btn" data-translate-key="gen_history_export" hidden></button>
          <button id="clearHistoryBtn" class="action-btn clear-btn" data-translate-key="gen_history_clear" hidden></button>
        </div>
      </section>
      <section class="extra-section">
        <h2 data-translate-key="tips_title"></h2>
        <p class="subtitle" data-translate-key="tips_subtitle"></p>
        <div class="tips-grid">
          <div class="tip-card"><div class="icon-circle" aria-hidden="true">📏</div><h3 data-translate-key="tip1_title"></h3><p data-translate-key="tip1_desc"></p></div>
          <div class="tip-card"><div class="icon-circle" aria-hidden="true">🧩</div><h3 data-translate-key="tip2_title"></h3><p data-translate-key="tip2_desc"></p></div>
          <div class="tip-card"><div class="icon-circle" aria-hidden="true">🔑</div><h3 data-translate-key="tip3_title"></h3><p data-translate-key="tip3_desc"></p></div>
        </div>
      </section>
      <section class="extra-section">
        <h2 data-translate-key="faq_title"></h2>
        <div class="faq-list">
          <div class="faq-item">
            <button class="faq-question" aria-expanded="false">
              <span data-translate-key="faq1_q"></span>
              <span class="faq-toggle" aria-hidden="true">⌄</span>
            </button>
            <div class="faq-answer" hidden><p data-translate-key="faq1_a"></p></div>
          </div>
          <div class="faq-item">
            <button class="faq-question" aria-expanded="false">
              <span data-translate-key="faq2_q"></span>
              <span class="faq-toggle" aria-hidden="true">⌄</span>
            </button>
            <div class="faq-answer" hidden><p data-translate-key="faq2_a"></p></div>
          </div>
          <div class="faq-item">
            <button class="faq-question" aria-expanded="false">
              <span data-translate-key="faq3_q"></span>
              <span class="faq-toggle" aria-hidden="true">⌄</span>
            </button>
            <div class="faq-answer" hidden><p data-translate-key="faq3_a"></p></div>
          </div>
        </div>
      </section>
    </div>
  `;
}

export function verifierTemplate() {
  return `
    <div id="verifier-view" class="app-view" role="region" aria-labelledby="verifier-heading">
      <div class="app-container">
        <h1 id="verifier-heading" data-translate-key="ver_main_title"></h1>
        <p class="subtitle" data-translate-key="ver_subtitle"></p>
        <div class="ver-password-wrapper">
          <label for="passwordInput" class="sr-only">Password</label>
          <input type="password" id="passwordInput" data-translate-key="ver_placeholder" placeholder="" autocomplete="off">
          <button id="togglePassword" class="ver-toggle" data-translate-attrs="aria-label:ver_toggle_show">
            <span data-translate-key="ver_toggle_show"></span>
          </button>
        </div>
        <div class="ver-strength-bar-container"><div id="strength-bar" class="ver-strength-bar"></div></div>
        <div class="ver-criteria" role="list">
          <div class="ver-criterion" data-criterion="length"><span aria-hidden="true">•</span><span data-translate-key="ver_checklist_length"></span></div>
          <div class="ver-criterion" data-criterion="uppercase"><span aria-hidden="true">•</span><span data-translate-key="ver_checklist_uppercase"></span></div>
          <div class="ver-criterion" data-criterion="numbers"><span aria-hidden="true">•</span><span data-translate-key="ver_checklist_numbers"></span></div>
          <div class="ver-criterion" data-criterion="symbols"><span aria-hidden="true">•</span><span data-translate-key="ver_checklist_symbols"></span></div>
          <div class="ver-criterion" data-criterion="exposure"><span aria-hidden="true">•</span><span data-translate-key="ver_checklist_exposure"></span></div>
        </div>
        <div id="message-box" class="ver-message-box" role="status" aria-live="polite">
          <div class="icon-circle" aria-hidden="true">ℹ️</div>
          <div class="ver-message-content">
            <h3 id="message-title"></h3>
            <p id="message-details"></p>
          </div>
        </div>
        <div class="ver-checking-exposure" id="checking-exposure" hidden>
          <div class="spinner" aria-hidden="true"></div>
          <span data-translate-key="ver_checking_exposure"></span>
        </div>
        <div class="ver-actions-container">
          <label class="ver-opt-in">
            <input type="checkbox" id="exposureOptIn">
            <span data-translate-key="ver_exposure_opt_in"></span>
          </label>
          <p class="ver-disclaimer" data-translate-key="ver_exposure_disclaimer"></p>
          <button id="checkExposureBtn" class="action-btn" data-translate-key="ver_check_exposure" disabled></button>
        </div>
      </div>
      <section class="extra-section">
        <h2 data-translate-key="faq_title"></h2>
        <div class="tips-grid">
          <div class="tip-card"><h3 data-translate-key="ver_faq1_title"></h3><p data-translate-key="ver_faq1_text"></p></div>
          <div class="tip-card"><h3 data-translate-key="ver_faq2_title"></h3><p data-translate-key="ver_faq2_text"></p></div>
          <div class="tip-card"><h3 data-translate-key="ver_faq3_title"></h3><p data-translate-key="ver_faq3_text"></p></div>
        </div>
      </section>
    </div>
  `;
}
