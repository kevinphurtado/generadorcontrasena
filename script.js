'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    //                 1. ESTADO Y CONFIGURACIÓN
    // ==========================================================
    const state = {
        currentApp: 'generator',
        currentLang: 'es',
        currentTheme: 'light',
        passwordHistory: JSON.parse(localStorage.getItem('passwordHistory')) || [],
        verifier: {
            isPasswordExposed: false,
            exposureCount: 0,
            exposureCheckTimeout: null,
            exposureCheckCount: 0,
        },
        generator: {
            currentGenerationType: 'random',
        }
    };

    // ==========================================================
    //                  2. TRADUCCIONES (COMPLETA)
    // ==========================================================
    const translations = {
        es: {
            nav_generator: "Generador", nav_verifier: "Verificador",
            footer_developed_by: "© 2025 Desarrollado por ", footer_privacy: "Privacidad 🔒",
            donate_button: "Donar", donate_modal_title: "Apoya este proyecto",
            donate_modal_desc: "Si esta herramienta te resulta útil, considera hacer una donación para apoyar su desarrollo y mantenimiento.",
            footer_open_source: "Herramienta de código libre",
            copied_message: "¡Copiado!",
            gen_main_title: "Generador de contraseñas seguro", gen_subtitle: "Cree contraseñas fuertes y seguras al instante.",
            complexity_very_weak:"Muy débil", complexity_weak:"Débil", complexity_good:"Buena", complexity_strong:"Fuerte",
            history_title: "Historial de contraseñas", history_empty: "No hay contraseñas en el historial.",
            history_export_csv: "Exportar a CSV", history_clear: "Borrar historial",
            tips_title: "¿Necesitas repasar las prácticas recomendadas?", tips_subtitle: "Céntrate en la longitud, la complejidad y la exclusividad.",
            tip1_title:"Larga", tip1_desc:"Una contraseña segura debe tener al menos 16 caracteres.",
            tip2_title:"Compleja", tip2_desc:"Utiliza una combinación de letras, números y símbolos.",
            tip3_title:"Única", tip3_desc:"Cada cuenta debe tener una contraseña única.",
            local_security_message: "Esta herramienta utiliza JavaScript para generar contraseñas en tu navegador localmente. Estas contraseñas no se transmiten a ningún servidor.",
            faq_title:"Preguntas frecuentes",
            faq1_q:"¿Es seguro usar este generador?", faq1_a:"Sí. Las contraseñas se generan en tu navegador y nunca se envían a ningún servidor. Es 100% seguro y privado.",
            faq2_q:"¿Por qué no debería crear mis propias contraseñas?", faq2_a:"Los humanos tendemos a crear patrones predecibles (fechas, nombres, secuencias). Un generador crea contraseñas verdaderamente aleatorias, que son casi imposibles de adivinar.",
            faq3_q:"¿Cuál es la contraseña más segura?", faq3_a:"La más segura es una contraseña larga (más de 16 caracteres) que combina mayúsculas, minúsculas, números y símbolos, o una frase de contraseña memorable de 4 o más palabras.",
            ver_main_title: "Revisa y mejora tu contraseña", ver_subtitle: "Comprueba la fortaleza de tu contraseña al instante.",
            ver_faq1_title: "¿Qué es un ataque de fuerza bruta?", ver_faq1_text: "Un método automatizado que prueba millones de combinaciones de contraseñas hasta dar con la correcta.",
            ver_faq2_title: "¿Cómo funciona este verificador?", ver_faq2_text: "Analiza tu contraseña en tu navegador. Tu contraseña nunca sale de tu dispositivo.",
            ver_faq3_title: "¿Cómo se verifica si mi contraseña fue expuesta?", ver_faq3_text: "Usamos la API de 'Have I Been Pwned' de forma segura, enviando solo una parte del hash de tu contraseña.",
        },
        en: {
            nav_generator: "Generator", nav_verifier: "Verifier",
            footer_developed_by: "© 2025 Developed by ", footer_privacy: "Privacy",
            donate_button: "Donate", donate_modal_title: "Support this Project",
            donate_modal_desc: "If you find this tool helpful, please consider making a donation to support its development and maintenance.",
            footer_open_source: "Open Source Tool",
            copied_message: "Copied!",
            gen_main_title: "Secure Password Generator", gen_subtitle: "Create strong and secure passwords instantly.",
            complexity_very_weak:"Very Weak", complexity_weak:"Weak", complexity_good:"Good", complexity_strong:"Strong",
            history_title: "Password History", history_empty: "No passwords in history.",
            history_export_csv: "Export to CSV", history_clear: "Clear History",
            tips_title: "Need a refresher on best practices?", tips_subtitle: "Focus on length, complexity, and uniqueness.",
            tip1_title:"Long", tip1_desc:"A strong password should be at least 16 characters long.",
            tip2_title:"Complex", tip2_desc:"Use a mix of letters, numbers, and symbols.",
            tip3_title:"Unique", tip3_desc:"Every account should have a unique password.",
            local_security_message: "This tool uses JavaScript to generate passwords locally in your browser. These passwords are not transmitted to any server.",
            faq_title:"Frequently Asked Questions",
            faq1_q:"Is it safe to use this generator?", faq1_a:"Yes. Passwords are generated in your browser and are never sent to any server. It's 100% safe and private.",
            faq2_q:"Why shouldn't I create my own passwords?", faq2_a:"Humans tend to create predictable patterns (dates, names, sequences). A generator creates truly random passwords, which are nearly impossible to guess.",
            faq3_q:"What is the most secure password?", faq3_a:"The most secure password is a long one (16+ characters) that combines uppercase, lowercase, numbers, and symbols, or a memorable passphrase of 4 or more words.",
            ver_main_title: "Check and improve your password", ver_subtitle: "Instantly check your password's strength.",
            ver_faq1_title: "What is a brute-force attack?", ver_faq1_text: "An automated method that tries millions of password combinations until it finds the correct one.",
            ver_faq2_title: "How does this checker work?", ver_faq2_text: "It analyzes your password in your browser. Your password never leaves your device.",
            ver_faq3_title: "How is my password's exposure checked?", ver_faq3_text: "We use the 'Have I Been Pwned' API securely, sending only part of your password's hash.",
        }
    };

    // ==========================================================
    //                 3. PLANTILLAS HTML (COMPLETAS)
    // ==========================================================
    const templates = {
        generator: `
            <div id="generator-view" class="app-view">
                <div class="app-container">
                    <header>
                        <h1 data-translate-key="gen_main_title"></h1>
                        <p class="subtitle" data-translate-key="gen_subtitle"></p>
                    </header>
                    <div class="gen-password-display-container">
                        <input type="text" id="passwordOutput" readonly placeholder="..."/>
                        <button id="regenerateBtn" class="gen-icon-btn" title="Generar nueva"><i class="fa-solid fa-arrows-rotate"></i></button>
                        <button id="copyBtn" class="gen-icon-btn" title="Copiar"><i class="fa-regular fa-copy"></i></button>
                        <button id="qrBtn" class="gen-icon-btn" title="Código QR"><i class="fa-solid fa-qrcode"></i></button>
                    </div>
                    <div id="complexityCheck" class="gen-complexity-check"></div>
                    <div class="gen-strength-meter-container"><div id="strengthBar" class="gen-strength-bar"></div></div>
                    <div class="gen-options-container">
                        <div class="gen-type-selector">
                            <button id="randomTypeBtn" class="active">Aleatoria</button>
                            <button id="memorableTypeBtn">Memorizable</button>
                            <button id="pinTypeBtn">PIN</button>
                        </div>
                        <div id="random-options">
                             <div class="gen-slider-wrapper" style="margin-bottom: 1rem;">
                                <span>6</span><input type="range" id="passwordLength" min="6" max="64" value="16"><span>64</span>
                                <span id="lengthValue" class="gen-slider-value">16</span>
                            </div>
                            <div class="gen-checkbox-group">
                                 <div class="gen-checkbox-item"><input type="checkbox" id="uppercase" checked/><label for="uppercase">A-Z</label></div>
                                 <div class="gen-checkbox-item"><input type="checkbox" id="lowercase" checked/><label for="lowercase">a-z</label></div>
                                 <div class="gen-checkbox-item"><input type="checkbox" id="numbers" checked/><label for="numbers">0-9</label></div>
                                 <div class="gen-checkbox-item"><input type="checkbox" id="symbols" checked/><label for="symbols">!@#$</label></div>
                            </div>
                        </div>
                        <div id="memorable-options" style="display:none;">
                             <div class="gen-slider-wrapper" style="margin-bottom: 1rem;">
                                <span>3</span><input type="range" id="wordCount" min="3" max="8" value="4"><span>8</span>
                                <span id="wordCountValue" class="gen-slider-value">4</span>
                            </div>
                            <div class="gen-checkbox-group">
                                <div class="gen-checkbox-item"><input type="checkbox" id="memorableCapitalize" checked/><label for="memorableCapitalize">Capitalizar</label></div>
                                <div class="gen-checkbox-item"><input type="checkbox" id="memorableNumbers" checked/><label for="memorableNumbers">Número</label></div>
                                <div class="gen-checkbox-item"><input type="checkbox" id="memorableSymbols"/><label for="memorableSymbols">Símbolo</label></div>
                                <div class="gen-form-group gen-checkbox-item">
                                    <label for="separator" style="margin-right: 8px;">Separador</label>
                                    <select id="separator" style="flex-grow: 1;">
                                        <option value="-">Guión</option>
                                        <option value="_">Guión bajo</option>
                                        <option value=".">Punto</option>
                                        <option value=" ">Espacio</option>
                                        <option value="">Ninguno</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div id="pin-options" style="display:none;">
                            <div class="gen-slider-wrapper">
                                <span>4</span><input type="range" id="pinLength" min="4" max="10" value="6"><span>10</span>
                                <span id="pinLengthValue" class="gen-slider-value">6</span>
                            </div>
                        </div>
                    </div>
                    <p class="gen-local-security-message" data-translate-key="local_security_message"></p>
                </div>
                <section class="extra-section">
                    <h2 data-translate-key="history_title"></h2>
                    <div id="passwordHistoryList"><p class="no-history-message" data-translate-key="history_empty"></p></div>
                    <div class="history-actions-footer">
                        <button id="exportCsvBtn" class="action-btn" style="display:none;" data-translate-key="history_export_csv"></button>
                        <button id="clearHistoryBtn" class="action-btn clear-btn" style="display:none;" data-translate-key="history_clear"></button>
                    </div>
                </section>
                <section class="extra-section">
                    <h2 data-translate-key="tips_title"></h2>
                    <p class="subtitle" data-translate-key="tips_subtitle"></p>
                    <div class="tips-grid">
                        <div class="tip-card"><div class="icon-circle"><i class="fas fa-ruler-horizontal"></i></div><h3 data-translate-key="tip1_title"></h3><p data-translate-key="tip1_desc"></p></div>
                        <div class="tip-card"><div class="icon-circle"><i class="fas fa-puzzle-piece"></i></div><h3 data-translate-key="tip2_title"></h3><p data-translate-key="tip2_desc"></p></div>
                        <div class="tip-card"><div class="icon-circle"><i class="fas fa-key"></i></div><h3 data-translate-key="tip3_title"></h3><p data-translate-key="tip3_desc"></p></div>
                    </div>
                </section>
                <section class="extra-section">
                    <h2 data-translate-key="faq_title"></h2>
                    <div class="faq-list">
                        <div class="faq-item">
                            <div class="faq-question" role="button"><span data-translate-key="faq1_q"></span><i class="fas fa-chevron-down faq-toggle"></i></div>
                            <div class="faq-answer"><p data-translate-key="faq1_a"></p></div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-question" role="button"><span data-translate-key="faq2_q"></span><i class="fas fa-chevron-down faq-toggle"></i></div>
                            <div class="faq-answer"><p data-translate-key="faq2_a"></p></div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-question" role="button"><span data-translate-key="faq3_q"></span><i class="fas fa-chevron-down faq-toggle"></i></div>
                            <div class="faq-answer"><p data-translate-key="faq3_a"></p></div>
                        </div>
                    </div>
                </section>
                <div id="qr-modal" class="modal-overlay"><div class="modal-content"><button class="close-btn">&times;</button><h2>Código QR</h2><div id="qrcode-container"></div></div></div>
            </div>`,
        verifier: `
            <div id="verifier-view" class="app-view">
                <div class="app-container">
                    <h1 data-translate-key="ver_main_title"></h1>
                    <p class="subtitle" data-translate-key="ver_subtitle"></p>
                    <div class="ver-password-wrapper">
                        <input type="password" id="passwordInput" placeholder="Introduce tu contraseña">
                        <span id="togglePassword" class="ver-eye-icon"><i class="fas fa-eye"></i></span>
                    </div>
                    <div class="ver-strength-bar-container"><div id="strength-bar" class="ver-strength-bar"></div></div>
                    <div class="ver-criteria">
                        <div class="ver-criterion" data-criterion="length"><span><i class="fa-solid fa-check"></i></span> <span>8+ Caracteres</span></div>
                        <div class="ver-criterion" data-criterion="uppercase"><span><i class="fa-solid fa-check"></i></span> <span>Mayúsculas [A-Z]</span></div>
                        <div class="ver-criterion" data-criterion="numbers"><span><i class="fa-solid fa-check"></i></span> <span>Números [0-9]</span></div>
                        <div class="ver-criterion" data-criterion="symbols"><span><i class="fa-solid fa-check"></i></span> <span>Símbolos [!@#]</span></div>
                        <div class="ver-criterion" data-criterion="exposure"><span><i class="fa-solid fa-check"></i></span> <span>No expuesta en filtraciones</span></div>
                    </div>
                    <div id="checking-exposure" class="ver-checking-exposure" style="display: none;"><div class="spinner"></div><span>Verificando...</span></div>
                    <div id="message-box" class="ver-message-box" style="display: none;"><div class="icon-circle"><i id="message-icon" class="fa-solid fa-triangle-exclamation"></i></div><div class="message-content"><h3 id="message-title"></h3><p id="message-details"></p></div></div>
                </div>
                 <section class="extra-section">
                    <h2>Preguntas Frecuentes</h2>
                     <div class="tips-grid">
                        <div class="tip-card"><h3 data-translate-key="ver_faq1_title"></h3><p data-translate-key="ver_faq1_text"></p></div>
                        <div class="tip-card"><h3 data-translate-key="ver_faq2_title"></h3><p data-translate-key="ver_faq2_text"></p></div>
                        <div class="tip-card"><h3 data-translate-key="ver_faq3_title"></h3><p data-translate-key="ver_faq3_text"></p></div>
                    </div>
                </section>
            </div>`
    };

   // --- ELEMENTOS DOM ESTÁTICOS ---
    const dom = {
        appContainer: document.getElementById('app-container'),
        appToggle: document.getElementById('appToggle'),
        themeBtn: document.getElementById('themeBtn'),
        translateBtn: document.getElementById('translateBtn'),
        copyMessage: document.getElementById('copyMessage'),
        privacyModal: document.getElementById('privacy-modal'),
        donateModal: document.getElementById('donate-modal'),
    };
    
    // ==========================================================
    //                  4. LÓGICA DE APLICACIÓN
    // ==========================================================
    const appLogic = {
        generator: {
            elements: {},
            charsets: {
                lowercase: 'abcdefghijklmnopqrstuvwxyz',
                uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                numbers: '0123456789',
                symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
            },
            memorableWords: ["casa","mesa","perro","gato","azul","verde","sol","luna","agua","arbol","flor","libro","cafe","nube","rio","feliz"],
            
            init() {
                this.elements = {
                    passwordOutput: document.getElementById('passwordOutput'),
                    regenerateBtn: document.getElementById('regenerateBtn'),
                    copyBtn: document.getElementById('copyBtn'),
                    qrBtn: document.getElementById('qrBtn'),
                    qrModal: document.getElementById('qr-modal'),
                    qrcodeContainer: document.getElementById('qrcode-container'),
                    complexityCheck: document.getElementById('complexityCheck'),
                    strengthBar: document.getElementById('strengthBar'),
                    randomTypeBtn: document.getElementById('randomTypeBtn'),
                    memorableTypeBtn: document.getElementById('memorableTypeBtn'),
                    pinTypeBtn: document.getElementById('pinTypeBtn'),
                    randomOptions: document.getElementById('random-options'),
                    memorableOptions: document.getElementById('memorable-options'),
                    pinOptions: document.getElementById('pin-options'),
                    passwordLengthInput: document.getElementById('passwordLength'),
                    lengthValueSpan: document.getElementById('lengthValue'),
                    uppercaseCheckbox: document.getElementById('uppercase'),
                    lowercaseCheckbox: document.getElementById('lowercase'),
                    numbersCheckbox: document.getElementById('numbers'),
                    symbolsCheckbox: document.getElementById('symbols'),
                    wordCountInput: document.getElementById('wordCount'),
                    wordCountValueSpan: document.getElementById('wordCountValue'),
                    memorableCapitalizeCheckbox: document.getElementById('memorableCapitalize'),
                    memorableNumbersCheckbox: document.getElementById('memorableNumbers'),
                    memorableSymbolsCheckbox: document.getElementById('memorableSymbols'),
                    separatorSelect: document.getElementById('separator'),
                    pinLengthInput: document.getElementById('pinLength'),
                    pinLengthValueSpan: document.getElementById('pinLengthValue'),
                    passwordHistoryList: document.getElementById('passwordHistoryList'),
                    noHistoryMessage: document.querySelector('.no-history-message'),
                    exportCsvBtn: document.getElementById('exportCsvBtn'),
                    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
                };
                this.addEventListeners();
                this.renderPasswordHistory();
                this.generatePassword();
            },

            addEventListeners() {
                this.elements.regenerateBtn.addEventListener('click', () => this.generatePassword());
                this.elements.copyBtn.addEventListener('click', () => this.copyPassword());
                this.elements.qrBtn.addEventListener('click', () => this.showQrCode());
                this.elements.randomTypeBtn.addEventListener('click', () => this.switchType('random'));
                this.elements.memorableTypeBtn.addEventListener('click', () => this.switchType('memorable'));
                this.elements.pinTypeBtn.addEventListener('click', () => this.switchType('pin'));

                const regen = () => this.generatePassword();
                const updateAndRegen = (el, span) => {
                    if (el && span) span.textContent = el.value;
                    regen();
                };

                this.elements.passwordLengthInput.addEventListener('input', () => updateAndRegen(this.elements.passwordLengthInput, this.elements.lengthValueSpan));
                this.elements.wordCountInput.addEventListener('input', () => updateAndRegen(this.elements.wordCountInput, this.elements.wordCountValueSpan));
                this.elements.pinLengthInput.addEventListener('input', () => updateAndRegen(this.elements.pinLengthInput, this.elements.pinLengthValueSpan));
                

                document.querySelectorAll('#random-options input, #memorable-options input, #memorable-options select').forEach(el => el.addEventListener('change', regen));
                
                this.elements.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
                this.elements.exportCsvBtn.addEventListener('click', () => this.exportHistoryToCSV());
                
            
                document.querySelectorAll('.faq-question').forEach(question => {
                    question.addEventListener('click', () => {
                        const item = question.parentElement;
                        const wasActive = item.classList.contains('active');
                        if (!wasActive) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });
                });
            },

            switchType(type) {
                state.generator.currentGenerationType = type;
                const allOptions = [this.elements.randomOptions, this.elements.memorableOptions, this.elements.pinOptions];
                const allButtons = [this.elements.randomTypeBtn, this.elements.memorableTypeBtn, this.elements.pinTypeBtn];
                allOptions.forEach(opt => opt.style.display = 'none');
                allButtons.forEach(btn => btn.classList.remove('active'));

                if (type === 'random') {
                    this.elements.randomOptions.style.display = 'block';
                    this.elements.randomTypeBtn.classList.add('active');
                } else if (type === 'memorable') {
                    this.elements.memorableOptions.style.display = 'block';
                    this.elements.memorableTypeBtn.classList.add('active');
                } else if (type === 'pin') {
                    this.elements.pinOptions.style.display = 'block';
                    this.elements.pinTypeBtn.classList.add('active');
                }
                this.generatePassword();
            },
            
            cryptoRandom(max) {
                const r = new Uint32Array(1);
                window.crypto.getRandomValues(r);
                return r[0] % max;
            },

            generatePassword() {
                let password = '';
                const type = state.generator.currentGenerationType;

                if (type === 'random') {
                    let pool = '';
                    if (this.elements.lowercaseCheckbox.checked) pool += this.charsets.lowercase;
                    if (this.elements.uppercaseCheckbox.checked) pool += this.charsets.uppercase;
                    if (this.elements.numbersCheckbox.checked) pool += this.charsets.numbers;
                    if (this.elements.symbolsCheckbox.checked) pool += this.charsets.symbols;
                    if (pool === '') pool = this.charsets.lowercase;

                    const len = parseInt(this.elements.passwordLengthInput.value, 10);
                    for (let i = 0; i < len; i++) password += pool[this.cryptoRandom(pool.length)];
                } else if (type === 'memorable') {
                     const wc = parseInt(this.elements.wordCountInput.value, 10);
                      let words = [];
                      for (let i=0; i<wc; i++) words.push(this.memorableWords[this.cryptoRandom(this.memorableWords.length)]);
                      if (this.elements.memorableCapitalizeCheckbox.checked) words = words.map(w=>w[0].toUpperCase()+w.slice(1));
                      
                      password = words.join(this.elements.separatorSelect.value);
                      if (this.elements.memorableNumbersCheckbox.checked) password += this.cryptoRandom(100);
                      if (this.elements.memorableSymbolsCheckbox.checked) password += this.charsets.symbols[this.cryptoRandom(this.charsets.symbols.length)];

                } else if (type === 'pin') {
                    const len = parseInt(this.elements.pinLengthInput.value, 10);
                    for (let i = 0; i < len; i++) password += this.charsets.numbers[this.cryptoRandom(10)];
                }
                this.elements.passwordOutput.value = password;
                this.updateStrength(password);
            },
            
            updateStrength(password) {
                let score = 0;
                if (!password) score = -1;
                else if (password.length < 8) score = 0;
                else {
                    score = 1;
                    if (password.length >= 12) score++;
                    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
                    if (/\d/.test(password)) score++;
                    if (/[^A-Za-z0-9]/.test(password)) score++;
                }
                const levels = { '-1': '', 0: 'complexity_very_weak', 1: 'complexity_weak', 2: 'complexity_weak', 3: 'complexity_good', 4: 'complexity_strong', 5: 'complexity_strong' };
                const colors = { '-1': 'transparent', 0: 'var(--accent-weak)', 1: 'var(--accent-weak)', 2: 'var(--accent-medium)', 3: 'var(--accent-strong)', 4: 'var(--accent-strong)', 5: 'var(--primary-color)' };
                const levelKey = levels[score] || '';
                this.elements.complexityCheck.textContent = translations[state.currentLang][levelKey] || '';
                this.elements.strengthBar.style.width = score < 0 ? '0%' : `${(score / 5) * 100}%`;
                this.elements.strengthBar.style.backgroundColor = colors[score];
            },
            
            copyPassword() {
                const password = this.elements.passwordOutput.value;
                if (!password) return;
                navigator.clipboard.writeText(password).then(() => {
                    dom.copyMessage.classList.add('show');
                    setTimeout(() => dom.copyMessage.classList.remove('show'), 2000);
                    this.addPasswordToHistory(password);
                });
            },
            
            showQrCode() {
                const password = this.elements.passwordOutput.value;
                if (!password || !this.elements.qrModal) return;
                this.elements.qrcodeContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(password)}" alt="QR Code">`;
                this.elements.qrModal.classList.add('active');
            },

            addPasswordToHistory(password) {
                if (!password || state.passwordHistory.some(item => item.password === password)) return;
                state.passwordHistory.unshift({ id: Date.now(), password });
                if (state.passwordHistory.length > 50) state.passwordHistory.pop();
                localStorage.setItem('passwordHistory', JSON.stringify(state.passwordHistory));
                this.renderPasswordHistory();
            },

            renderPasswordHistory() {
                this.elements.passwordHistoryList.innerHTML = '';
                const hasHistory = state.passwordHistory.length > 0;
                this.elements.noHistoryMessage.style.display = hasHistory ? 'none' : 'block';
                this.elements.exportCsvBtn.style.display = hasHistory ? 'inline-block' : 'none';
                this.elements.clearHistoryBtn.style.display = hasHistory ? 'inline-block' : 'none';
                state.passwordHistory.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'history-item';
                    itemDiv.innerHTML = `<span class="history-password">${item.password}</span><div class="history-item-actions"><button class="copy-hist-btn"><i class="fa-regular fa-copy"></i></button><button class="delete-hist-btn"><i class="fa-solid fa-trash-can"></i></button></div>`;
                    itemDiv.querySelector('.copy-hist-btn').addEventListener('click', () => {
                        navigator.clipboard.writeText(item.password);
                        dom.copyMessage.classList.add('show');
                        setTimeout(() => dom.copyMessage.classList.remove('show'), 2000);
                    });
                    itemDiv.querySelector('.delete-hist-btn').addEventListener('click', () => {
                        state.passwordHistory = state.passwordHistory.filter(h => h.id !== item.id);
                        localStorage.setItem('passwordHistory', JSON.stringify(state.passwordHistory));
                        this.renderPasswordHistory();
                    });
                    this.elements.passwordHistoryList.appendChild(itemDiv);
                });
            },

            clearHistory() {
                state.passwordHistory = [];
                localStorage.removeItem('passwordHistory');
                this.renderPasswordHistory();
            },

            exportHistoryToCSV() {
                if (state.passwordHistory.length === 0) return;
                const rows = ["password", ...state.passwordHistory.map(i => `"${(i.password || '').replace(/"/g, '""')}"`)];
                const csvContent = "data:text/csv;charset=utf-8," + rows.join("\r\n");
                const link = document.createElement('a');
                link.href = encodeURI(csvContent);
                link.download = "password_history.csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        },
        verifier: {
            elements: {},
            validations: {
                numbers: pass => /[0-9]/.test(pass),
                symbols: pass => /[!@#$%^&*(),.?":{}|<>]/.test(pass),
                uppercase: pass => /[A-Z]/.test(pass),
                length: pass => pass.length >= 8,
            },

            init() {
                this.elements = {
                    passwordInput: document.getElementById('passwordInput'),
                    togglePassword: document.getElementById('togglePassword'),
                    strengthBar: document.getElementById('strength-bar'),
                    messageBox: document.getElementById('message-box'),
                    messageIcon: document.getElementById('message-icon'),
                    messageTitle: document.getElementById('message-title'),
                    messageDetails: document.getElementById('message-details'),
                    checkingExposure: document.getElementById('checking-exposure'),
                    criteria: {
                        numbers: document.querySelector('[data-criterion="numbers"]'),
                        symbols: document.querySelector('[data-criterion="symbols"]'),
                        uppercase: document.querySelector('[data-criterion="uppercase"]'),
                        length: document.querySelector('[data-criterion="length"]'),
                        exposure: document.querySelector('[data-criterion="exposure"]')
                    },
                };
                this.addEventListeners();
            },

            addEventListeners() {
                this.elements.passwordInput.addEventListener('input', () => this.onPasswordInput());
                this.elements.togglePassword.addEventListener('click', () => this.onTogglePassword());
            },

            onTogglePassword() {
                const type = this.elements.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                this.elements.passwordInput.setAttribute('type', type);
                this.elements.togglePassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            },
            
            async checkPasswordExposure(password) {
                 if (!password) return true;
                this.elements.checkingExposure.style.display = 'flex';
                state.verifier.exposureCheckCount++;
                const currentCheck = state.verifier.exposureCheckCount;
                try {
                    const encoder = new TextEncoder();
                    const data = encoder.encode(password);
                    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
                    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
                    const prefix = hashHex.substring(0, 5).toUpperCase();
                    const suffix = hashHex.substring(5).toUpperCase();
                    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
                    if (currentCheck !== state.verifier.exposureCheckCount) return true;
                    const dataText = await response.text();
                    const found = dataText.split('\n').find(h => h.split(':')[0] === suffix);
                    if (found) {
                        state.verifier.exposureCount = parseInt(found.split(':')[1], 10);
                        state.verifier.isPasswordExposed = true;
                        return false;
                    }
                    state.verifier.isPasswordExposed = false;
                    return true;
                } catch (error) {
                    console.error('Error checking exposure:', error);
                    state.verifier.isPasswordExposed = false;
                    return true;
                } finally {
                    if (currentCheck === state.verifier.exposureCheckCount) {
                        this.elements.checkingExposure.style.display = 'none';
                    }
                }
            },
            
            updateUI(score, password) {
                if (password.length === 0) {
                    this.elements.strengthBar.style.width = '0%';
                    this.elements.messageBox.style.display = 'none';
                    Object.values(this.elements.criteria).forEach(el => el.classList.remove('active', 'exposed'));
                    return;
                }
                const totalChecks = Object.keys(this.validations).length + 1;
                let strengthPercentage = (score / totalChecks) * 100;
                let barColor = 'var(--accent-weak)';
                this.elements.messageBox.style.display = 'flex';
                
                if (state.verifier.isPasswordExposed) {
                    barColor = 'var(--accent-exposed)';
                    this.elements.messageBox.className = 'ver-message-box exposed';
                    this.elements.messageTitle.textContent = "¡Contraseña comprometida!";
                    this.elements.messageDetails.textContent = `Esta contraseña ha aparecido en ${state.verifier.exposureCount.toLocaleString()} filtraciones. ¡No la uses!`;
                } else if (score === totalChecks) {
                    barColor = 'var(--accent-strong)';
                    this.elements.messageBox.className = 'ver-message-box success';
                    this.elements.messageTitle.textContent = "¡Contraseña Segura!";
                    this.elements.messageDetails.textContent = "¡Excelente! Tu contraseña cumple los criterios.";
                } else {
                     barColor = strengthPercentage > 50 ? 'var(--accent-medium)' : 'var(--accent-weak)';
                    this.elements.messageBox.className = 'ver-message-box weak';
                    this.elements.messageTitle.textContent = "Contraseña débil";
                    this.elements.messageDetails.textContent = "Considera añadir más caracteres, mayúsculas, números o símbolos para mejorarla.";
                }
                
                this.elements.strengthBar.style.width = `${strengthPercentage}%`;
                this.elements.strengthBar.style.backgroundColor = barColor;
            },
            
            async onPasswordInput() {
                const password = this.elements.passwordInput.value;
                let score = 0;
                
                Object.keys(this.validations).forEach(key => {
                    const criterionEl = this.elements.criteria[key];
                    if (this.validations[key](password)) {
                        score++;
                        criterionEl.classList.add('active');
                    } else {
                        criterionEl.classList.remove('active');
                    }
                });

                clearTimeout(state.verifier.exposureCheckTimeout);
                this.updateUI(score, password);

                state.verifier.exposureCheckTimeout = setTimeout(async () => {
                    const isSafe = await this.checkPasswordExposure(password);
                    const exposureEl = this.elements.criteria.exposure;
                    exposureEl.classList.remove('active', 'exposed');
                    
                    let finalScore = score;
                    if (password.length > 0) {
                        if (isSafe) {
                            finalScore++;
                            exposureEl.classList.add('active');
                        } else {
                            exposureEl.classList.add('exposed');
                        }
                    }
                    this.updateUI(finalScore, password);
                }, 500);
            }
        }
    };

    // ==========================================================
    //  5. INICIALIZACIÓN DE LA APLICACIÓN PRINCIPAL Y UTILIDADES
    // ==========================================================
    function switchApp(appName) {
        state.currentApp = appName;
        dom.appContainer.innerHTML = templates[appName];
        
        const newView = document.getElementById(`${appName}-view`);
        if(newView) newView.classList.add('active');

        if (appName === 'generator') {
            appLogic.generator.init();
        } else if (appName === 'verifier') {
            appLogic.verifier.init();
        }
        setLanguage(state.currentLang); 
        setupModalTriggers();
    }
    
    function setupEventListeners() {
        dom.appToggle.addEventListener('change', () => {
            switchApp(dom.appToggle.checked ? 'verifier' : 'generator');
        });
        dom.themeBtn.addEventListener('click', () => {
            setTheme(state.currentTheme === 'light' ? 'dark' : 'light');
        });
        dom.translateBtn.addEventListener('click', () => {
            setLanguage(state.currentLang === 'es' ? 'en' : 'es');
        });
    }

    function setupModalTriggers() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            if (!modal.dataset.closeListenerAttached) {
                modal.addEventListener('click', e => {
                    if (e.target === modal || e.target.closest('.close-btn')) {
                        modal.classList.remove('active');
                    }
                });
                modal.dataset.closeListenerAttached = 'true';
            }
        });
        
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.addEventListener('click', e => {
                e.preventDefault();
                const modalId = trigger.dataset.modal;
                const modal = document.getElementById(modalId);
                if (modal) {
                     modal.classList.add('active');
                     if (modalId === 'donate-modal' && typeof paypal !== 'undefined') {
                         const paypalContainer = document.getElementById('paypal-container-5Y6FSK8RBQCQN');
                         if (paypalContainer) {
                             paypalContainer.innerHTML = '';
                             try {
                                 paypal.HostedButtons({ hostedButtonId: "5Y6FSK8RBQCQN" }).render("#paypal-container-5Y6FSK8RBQCQN");
                             } catch (err) {
                                 console.error("PayPal button failed to render", err);
                                 paypalContainer.innerHTML = '<p>Error al cargar el botón de donación.</p>';
                             }
                         }
                     }
                }
            });
        });
    }
    
    function setTheme(theme) {
        state.currentTheme = theme;
        document.body.classList.toggle('dark-mode', theme === 'dark');
        dom.themeBtn.querySelector('i').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', theme);
    }
    
    function setLanguage(lang) {
        state.currentLang = lang;
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.dataset.translateKey;
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        if (state.currentApp === 'generator' && appLogic.generator.elements.passwordOutput) {
            appLogic.generator.updateStrength(appLogic.generator.elements.passwordOutput.value);
        }
    }

    function init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const savedLang = localStorage.getItem('language') || 'es';
        setTheme(savedTheme);
        setupEventListeners();
        switchApp('generator');
    }

    init();
});