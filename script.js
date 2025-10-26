'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    //                 1. ESTADO Y CONFIGURACIÓN
    // ==========================================================
    const ENCRYPTED_HISTORY_KEY = 'encryptedPasswordHistory';
    const MASTER_KEY_HASH_KEY = 'masterKeyHash';

    const state = {
        currentApp: 'generator',
        currentLang: 'es',
        currentTheme: 'light',
        passwordHistory: [], // Se inicializa vacío, se carga o descifra después
        isHistoryDecrypted: false,
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
    //                  2. TRADUCCIONES (COMPLETA CON NOVEDADES)
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
            entropy_label: "Entropía: ",
            entropy_bits: (bits) => `${bits.toFixed(2)} bits`,
            crack_time_very_short: "Crackeo: < 1 día", crack_time_short: "Crackeo: ~%s días", crack_time_long: "Crackeo: ~%s años",
            complexity_very_weak:"Muy débil", complexity_weak:"Débil", complexity_good:"Buena", complexity_strong:"Fuerte",
            history_title: "Historial de contraseñas (Cifrado)", history_empty: "No hay contraseñas en el historial.",
            history_locked: "Historial cifrado. Desbloquee para ver.", history_unlock: "Desbloquear Historial",
            history_export_csv: "Exportar a CSV", history_clear: "Borrar historial",
            tips_title: "¿Necesitas repasar las prácticas recomendadas?", tips_subtitle: "Céntrate en la longitud, la complejidad y la exclusividad.",
            tip1_title:"Larga", tip1_desc:"Una contraseña segura debe tener al menos 16 caracteres.",
            tip2_title:"Compleja", tip2_desc:"Utiliza una combinación de letras, números y símbolos.",
            tip3_title:"Única", tip3_desc:"Cada cuenta debe tener una contraseña única.",
            local_security_message: "Esta herramienta utiliza JavaScript para generar contraseñas en tu navegador localmente. Estas contraseñas no se transmiten a ningún servidor. El historial se guarda cifrado con una clave maestra que solo tú conoces.",
            faq_title:"Preguntas frecuentes",
            faq1_q:"¿Es seguro usar este generador?", faq1_a:"Sí. Las contraseñas se generan en tu navegador y nunca se envían a ningún servidor. Es 100% seguro y privado.",
            faq2_q:"¿Por qué no debería crear mis propias contraseñas?", faq2_a:"Los humanos tendemos a crear patrones predecibles (fechas, nombres, secuencias). Un generador crea contraseñas verdaderamente aleatorias, que son casi imposibles de adivinar.",
            faq3_q:"¿Cuál es la contraseña más segura?", faq3_a:"La más segura es una contraseña larga (más de 16 caracteres) que combina mayúsculas, minúsculas, números y símbolos, o una frase de contraseña memorable de 4 o más palabras.",
            ver_main_title: "Revisa y mejora tu contraseña", ver_subtitle: "Comprueba la fortaleza de tu contraseña al instante.",
            gen_type_random: "Aleatoria",
            gen_type_memorable: "Memorizable",
            gen_type_pin: "PIN",
            gen_opt_capitalize: "Capitalizar",
            gen_opt_number: "Número",
            gen_opt_symbol: "Símbolo",
            gen_opt_separator: "Separador",
            ver_placeholder: "Introduce tu contraseña",
            ver_crit_length: "8+ Caracteres",
            ver_crit_uppercase: "Mayúsculas [A-Z]",
            ver_crit_numbers: "Números [0-9]",
            ver_crit_symbols: "Símbolos [!@#]",
            ver_crit_exposed: "No expuesta en filtraciones",
            ver_faq1_title: "¿Qué es un ataque de fuerza bruta?", ver_faq1_text: "Un método automatizado que prueba millones de combinaciones de contraseñas hasta dar con la correcta.",
            ver_faq2_title: "¿Cómo funciona este verificador?", ver_faq2_text: "Analiza tu contraseña en tu navegador. Tu contraseña nunca sale de tu dispositivo.",
            ver_faq3_title: "¿Cómo se verifica si mi contraseña fue expuesta?", ver_faq3_text: "Usamos la API de 'Have I Been Pwned' de forma segura, enviando solo una parte del hash de tu contraseña.",
            ai_modal_title: "Consejos de la IA", ai_generating_tips: "Generando consejos...",
            mp_modal_title: "Contraseña Maestra", mp_modal_desc: "Introduce una clave para descifrar y gestionar tu historial de contraseñas guardadas.",
            mp_modal_submit: "Desbloquear Historial", mp_error_message: "Clave Maestra incorrecta.",
            ver_exposed_title: "¡Contraseña comprometida!", ver_exposed_desc: "Esta contraseña ha aparecido en %s filtraciones. ¡No la uses!",
            ver_secure_title: "¡Contraseña Segura!", ver_secure_desc: "¡Excelente! Tu contraseña cumple los criterios. El tiempo de crackeo estimado es de %s.",
            ver_weak_title: "Contraseña débil",
            ver_weak_desc: "El tiempo de crackeo es muy corto. Considera mejorar: %s.",
            ver_weak_sugg_length: "Longitud < 16, añade más caracteres.",
            ver_weak_sugg_complex: "Faltan mayúsculas, números o símbolos.",
            ver_weak_sugg_generic: "Añade más caracteres de diferentes tipos para aumentar la entropía.",
        },
        en: {
            nav_generator: "Generator", nav_verifier: "Verifier",
            footer_developed_by: "© 2025 Developed by ", footer_privacy: "Privacy",
            donate_button: "Donate", donate_modal_title: "Support this Project",
            donate_modal_desc: "If you find this tool helpful, please consider making a donation to support its development and maintenance.",
            footer_open_source: "Open Source Tool",
            copied_message: "Copied!",
            gen_main_title: "Secure Password Generator", gen_subtitle: "Create strong and secure passwords instantly.",
            entropy_label: "Entropy: ",
            entropy_bits: (bits) => `${bits.toFixed(2)} bits`,
            crack_time_very_short: "Cracking: < 1 day", crack_time_short: "Cracking: ~%s days", crack_time_long: "Cracking: ~%s years",
            complexity_very_weak:"Very Weak", complexity_weak:"Weak", complexity_good:"Good", complexity_strong:"Strong",
            history_title: "Password History (Encrypted)", history_empty: "No passwords in history.",
            history_locked: "Encrypted history. Unlock to view.", history_unlock: "Unlock History",
            history_export_csv: "Export to CSV", history_clear: "Clear History",
            tips_title: "Need a refresher on best practices?", tips_subtitle: "Focus on length, complexity, and uniqueness.",
            tip1_title:"Long", tip1_desc:"A strong password should be at least 16 characters long.",
            tip2_title:"Complex", tip2_desc:"Use a mix of letters, numbers, and symbols.",
            tip3_title:"Unique", tip3_desc:"Every account should have a unique password.",
            local_security_message: "This tool uses JavaScript to generate passwords locally in your browser. These passwords are not transmitted to any server. History is saved encrypted with a master key only you know.",
            faq_title:"Frequently Asked Questions",
            faq1_q:"Is it safe to use this generator?", faq1_a:"Yes. Passwords are generated in your browser and are never sent to any server. It's 100% safe and private.",
            faq2_q:"Why shouldn't I create my own passwords?", faq2_a:"Humans tend to create predictable patterns (dates, names, sequences). A generator creates truly random passwords, which are nearly impossible to guess.",
            faq3_q:"What is the most secure password?", faq3_a:"The most secure password is a long one (16+ characters) that combines uppercase, lowercase, numbers, and symbols, or a memorable passphrase of 4 or more words.",
            ver_main_title: "Check and improve your password", ver_subtitle: "Instantly check your password's strength.",
            gen_type_random: "Random",
            gen_type_memorable: "Memorable",
            gen_type_pin: "PIN",
            gen_opt_capitalize: "Capitalize",
            gen_opt_number: "Number",
            gen_opt_symbol: "Symbol",
            gen_opt_separator: "Separator",
            ver_placeholder: "Enter your password",
            ver_crit_length: "8+ Characters",
            ver_crit_uppercase: "Uppercase [A-Z]",
            ver_crit_numbers: "Numbers [0-9]",
            ver_crit_symbols: "Symbols [!@#]",
            ver_crit_exposed: "Not exposed in breaches",
            ver_faq1_title: "What is a brute-force attack?", ver_faq1_text: "An automated method that tries millions of password combinations until it finds the correct one.",
            ver_faq2_title: "How does this checker work?", ver_faq2_text: "It analyzes your password in your browser. Your password never leaves your device.",
            ver_faq3_title: "How is my password's exposure checked?", ver_faq3_text: "We use the 'Have I Been Pwned' API securely, sending only part of your password's hash.",
            ai_modal_title: "AI Tips", ai_generating_tips: "Generating tips...",
            mp_modal_title: "Master Password", mp_modal_desc: "Enter a key to decrypt and manage your saved password history.",
            mp_modal_submit: "Unlock History", mp_error_message: "Incorrect Master Key.",
            ver_exposed_title: "Password Exposed!", ver_exposed_desc: "This password has appeared in %s data breaches. Do not use it!",
            ver_secure_title: "Secure Password!", ver_secure_desc: "Excellent! Your password meets all criteria. Estimated cracking time is %s.",
            ver_weak_title: "Weak Password",
            ver_weak_desc: "Cracking time is very short. Consider improving: %s.",
            ver_weak_sugg_length: "Length < 16, add more characters.",
            ver_weak_sugg_complex: "Missing uppercase, numbers, or symbols.",
            ver_weak_sugg_generic: "Add more characters of different types to increase entropy.",
        }
    };
    
    // ==========================================================
    //                  3. FUNCIÓN DE UTILIDAD: TRADUCCIÓN
    // ==========================================================
    /**
     * Obtiene una traducción y reemplaza argumentos opcionales.
     * @param {string} key La clave de traducción.
     * @param {...(string|number)} args Argumentos para reemplazar placeholders (%s).
     * @returns {string} La cadena traducida.
     */
    function getTranslation(key, ...args) {
        const lang = state.currentLang;
        const translation = translations[lang] ? translations[lang][key] : key;

        if (typeof translation === 'function') {
            return translation(...args);
        }

        let result = translation || `[MISSING_KEY:${key}]`;
        
        args.forEach(arg => {
            result = result.replace('%s', arg.toLocaleString(lang));
        });
        
        return result;
    }

   // --- ELEMENTOS DOM ESTÁTICOS ---
    const dom = {
        appContainer: document.getElementById('app-container'),
        appToggle: document.getElementById('appToggle'),
        themeBtn: document.getElementById('themeBtn'),
        translateBtn: document.getElementById('translateBtn'),
        infoBtn: document.getElementById('infoBtn'),
        copyMessage: document.getElementById('copyMessage'),
        privacyModal: document.getElementById('privacy-modal'),
        donateModal: document.getElementById('donate-modal'),
        infoModal: document.getElementById('info-modal'),
        qrModal: document.getElementById('qr-modal'),
        masterPasswordModal: document.getElementById('master-password-modal'), // NEW
    };
    
    // ==========================================================
    //                  4. CORE LOGIC: CRYPTO & ENTROPY
    // ==========================================================
    const cryptoLogic = {
        // Objeto que mapea las categorías a su tamaño de charset (para entropía)
        charsetSizes: {
            lowercase: 26, // a-z
            uppercase: 26, // A-Z
            numbers: 10,   // 0-9
            symbols: 32    // !@#$%... (estimado conservador)
        },

        /**
         * Calcula la entropía (bits) de una contraseña usando el modelo de Shannon.
         * E = L * log2(R)
         * @param {string} password
         * @returns {{bits: number, crackTime: string, crackTimeShort: string}}
         */
        calculateEntropy(password, charsetsUsed) {
            if (!password) return { bits: 0, crackTime: getTranslation('crack_time_very_short'), crackTimeShort: getTranslation('crack_time_very_short') };
            
            // 1. Determinar el tamaño del pool de caracteres (R)
            let R = 0;
            if (charsetsUsed && Object.keys(charsetsUsed).length > 0) {
                // Si viene de generator (opciones explícitas)
                Object.keys(charsetsUsed).forEach(key => {
                    R += this.charsetSizes[key] || 0;
                });
            } else {
                // Si viene de verifier (analizar la cadena)
                if (/[a-z]/.test(password)) R += this.charsetSizes.lowercase;
                if (/[A-Z]/.test(password)) R += this.charsetSizes.uppercase;
                if (/\d/.test(password)) R += this.charsetSizes.numbers;
                if (/[^A-Za-z0-9\s]/.test(password)) R += this.charsetSizes.symbols; 
            }
            R = Math.max(R, 10); // Mínimo de 10 por si es un PIN corto o vacío.

            // 2. Calcular Entropía E
            const L = password.length;
            const bits = L * Math.log2(R);

            // 3. Calcular tiempo de crackeo (estimado conservador: 100 mil millones de hashes/segundo, 10^11)
            const attemptsPerSecond = Math.pow(10, 11);
            const totalAttempts = Math.pow(R, L);
            const secondsToCrack = totalAttempts / attemptsPerSecond;
            
            let crackTime = getTranslation('crack_time_very_short');
            let crackTimeShort = getTranslation('crack_time_very_short');

            if (secondsToCrack >= 31536000) { // Si es más de 1 año
                crackTime = getTranslation('crack_time_long', Math.floor(secondsToCrack / 31536000));
                crackTimeShort = crackTime;
            } else if (secondsToCrack >= 86400) { // Si es más de 1 día
                crackTime = getTranslation('crack_time_short', Math.floor(secondsToCrack / 86400));
                crackTimeShort = crackTime;
            } else if (secondsToCrack > 1) {
                crackTime = getTranslation('crack_time_very_short');
                crackTimeShort = getTranslation('crack_time_very_short');
            } else {
                 crackTime = getTranslation('crack_time_very_short');
                 crackTimeShort = getTranslation('crack_time_very_short');
            }

            return { bits, crackTime, crackTimeShort };
        },

        // --- Cifrado/Descifrado AES para Historial ---
        
        /**
         * Cifra el historial en JSON usando la Clave Maestra.
         * @param {string} masterKey La clave proporcionada por el usuario.
         * @returns {string} El historial cifrado.
         */
        encryptHistory(masterKey) {
            const jsonString = JSON.stringify(state.passwordHistory);
            return CryptoJS.AES.encrypt(jsonString, masterKey).toString();
        },

        /**
         * Intenta descifrar el historial cifrado.
         * @param {string} masterKey La clave proporcionada por el usuario.
         * @returns {Array|null} El historial descifrado o null si falla.
         */
        decryptHistory(masterKey) {
            const encryptedData = localStorage.getItem(ENCRYPTED_HISTORY_KEY);
            if (!encryptedData) return [];
            try {
                const bytes = CryptoJS.AES.decrypt(encryptedData, this.hashMasterKey(masterKey));
                const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                if (!decryptedData) return null; // Fallo en el descifrado
                return JSON.parse(decryptedData);
            } catch (e) {
                console.warn("Fallo al descifrar el historial", e);
                return null;
            }
        },

        /**
         * Calcula el hash SHA-256 de la clave maestra para verificación.
         * @param {string} masterKey La clave de usuario.
         * @returns {string} El hash SHA-256.
         */
        hashMasterKey(masterKey) {
            return CryptoJS.SHA256(masterKey).toString();
        },
        
        // --- Lógica de Desbloqueo de Historial ---
        async unlockHistory(masterKey) {
            const decryptedHistory = this.decryptHistory(masterKey);
            const masterKeyHash = localStorage.getItem(MASTER_KEY_HASH_KEY);
            const newKeyHash = this.hashMasterKey(masterKey);

            if (decryptedHistory !== null) {
                // Caso 1: Desbloqueo exitoso. Puede ser la primera vez que se cifra o una clave recurrente.
                state.passwordHistory = decryptedHistory;
                state.isHistoryDecrypted = true;
                
                // Si el historial estaba vacío o si es la primera vez que se cifra, o si el hash no existe, lo guardamos.
                if (!masterKeyHash || masterKeyHash !== newKeyHash) {
                    localStorage.setItem(MASTER_KEY_HASH_KEY, newKeyHash);
                    // Sobreescribimos el historial cifrado con el hash de la clave, por si no existía el hash antes.
                    localStorage.setItem(ENCRYPTED_HISTORY_KEY, this.encryptHistory(newKeyHash));
                }
                
                dom.masterPasswordModal.classList.remove('active');
                appLogic.generator.renderPasswordHistory();
                return true;
            } 
            
            // Caso 2: Fallo en el descifrado.
            return false;
        },

        // --- Inicialización del Historial al cargar la app ---
        loadInitialHistory() {
            const masterKeyHash = localStorage.getItem(MASTER_KEY_HASH_KEY);
            const encryptedData = localStorage.getItem(ENCRYPTED_HISTORY_KEY);
            
            if (!masterKeyHash && encryptedData) {
                 // Si hay historial cifrado pero no hay hash, es un estado inconsistente. Borrar por seguridad.
                 localStorage.removeItem(ENCRYPTED_HISTORY_KEY);
            } else if (masterKeyHash) {
                // Hay hash, pero el historial está cifrado. Dejar state.isHistoryDecrypted en false.
                state.isHistoryDecrypted = false;
                state.passwordHistory = [];
            } else {
                // No hay historial cifrado ni hash. Historial vacío y desbloqueado (no hay nada que descifrar).
                state.isHistoryDecrypted = true; 
                state.passwordHistory = [];
            }
        }
    };
    
    // ==========================================================
    //                  5. LÓGICA DE APLICACIÓN
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
            memorableWords: {
                // Lista en español
                es: ["casa","mesa","perro","gato","azul","verde","sol","luna","agua","arbol","flor","libro","cafe","nube","rio","feliz","largo","bravo","claro","dulce","fuerte","grande","humano","joven","libre","nuevo","pobre","rico","sano","tarde","viejo","blanco","negro","rojo","verde","azul","amarillo","morado","rosa","gris","marron","naranja","violeta","turquesa","dorado","plateado","bronce","beige","crema","oliva","esmeralda","rubi","zafiro","ambar","topacio","perla","coral","magenta","cian","lima","menta","lavanda","lila","frambuesa","cereza","ciruela","melon","sandia","durazno","albaricoque","coco","piña","mango","kiwi","papaya","guayaba","maracuya","granada","higo","uva","platano","manzana","pera","naranja","limon","mandarina","pomelo","cereza","fresa","arandano","mora","frambuesa","zarzamora","grosella","madreselva","jazmin","orquidea","rosa","tulipan","lirio","margarita","girasol","clavel","amapola","violeta","hortensia","buganvilla","dalia","peonia","crisantemo","narciso","jacinto","lavanda","romero","salvia","tomillo","menta","albahaca","perejil","cilantro","eneldo","comino","canela","vainilla","nuez","almendra","avellana","pistacho","cacahuete","castana","nuezMoscada","pimienta","curcuma","jengibre","azafran","pimenton","oregano","mostaza","wasabi","soja","sake","vino","cerveza","whisky","ron","vodka","tequila","brandy","coñac","champan","sidra","licor","cafe","te","chocolate","leche","agua","zumo","batido","smoothie","limonada","refresco","energetica"],
                
                // Lista en inglés
                en: ["apple","house","tree","dog","cat","sun","moon","blue","red","run","jump","book","key","door","rock","wind","fire","water","fish","bird","sky","cloud","star","road","path","ship","boat","car","bike","time","work","play","food","art","song","calm","bold","dark","cold","warm","deep","fast","slow","high","low","new","old","big","small","good","bad","day","night","rain","snow","leaf","seed","gold","iron","wood","glass","air","love","hate","joy","sad","hope","fear","life","dead","find","lose","give","take","open","shut","move","stop","wait","talk","walk","see","hear","feel","think","know","learn","teach","read","write","eat","drink","sleep","wake","light","quiet","loud","soft","hard","true","false","wise","brave","kind","nice"]
            },
            
            init() {
                this.elements = {
                    passwordOutput: document.getElementById('passwordOutput'),
                    regenerateBtn: document.getElementById('regenerateBtn'),
                    copyBtn: document.getElementById('copyBtn'),
                    qrBtn: document.getElementById('qrBtn'),
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
                    unlockHistoryBtn: document.getElementById('unlockHistoryBtn'),
                };
                this.addEventListeners();
                this.renderPasswordHistory();
                this.generatePassword();
            },

            addEventListeners() {
                const regen = () => this.generatePassword();
                
                // Función utilitaria para sliders
                const updateAndRegen = (el, span) => {
                    if (el && span) span.textContent = el.value;
                    regen();
                };

                // Listeners principales
                this.elements.regenerateBtn.addEventListener('click', regen);
                this.elements.copyBtn.addEventListener('click', () => this.copyPassword());
                this.elements.qrBtn.addEventListener('click', () => this.showQrCode());

                // Listeners de tipo de generación
                this.elements.randomTypeBtn.addEventListener('click', () => this.switchType('random'));
                this.elements.memorableTypeBtn.addEventListener('click', () => this.switchType('memorable'));
                this.elements.pinTypeBtn.addEventListener('click', () => this.switchType('pin'));

                // Listeners de opciones (sliders)
                // Usar 'input' solo para actualizar el número (fluido)
                this.elements.passwordLengthInput.addEventListener('input', () => this.elements.lengthValueSpan.textContent = this.elements.passwordLengthInput.value);
                this.elements.wordCountInput.addEventListener('input', () => this.elements.wordCountValueSpan.textContent = this.elements.wordCountInput.value);
                this.elements.pinLengthInput.addEventListener('input', () => this.elements.pinLengthValueSpan.textContent = this.elements.pinLengthInput.value);
                
                // Usar 'change' para generar la contraseña (solo al soltar)
                this.elements.passwordLengthInput.addEventListener('change', regen);
                this.elements.wordCountInput.addEventListener('change', regen);
                this.elements.pinLengthInput.addEventListener('change', regen);
                
                // Listeners de opciones (checkboxes/select)
                document.querySelectorAll('#random-options input, #memorable-options input, #memorable-options select').forEach(el => el.addEventListener('change', regen));
                
                // Listener de historial
                this.elements.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
                this.elements.exportCsvBtn.addEventListener('click', () => this.exportHistoryToCSV());
                if (this.elements.unlockHistoryBtn) {
                     this.elements.unlockHistoryBtn.addEventListener('click', () => dom.masterPasswordModal.classList.add('active'));
                }
                
                // Mejorar FAQ (ya estaba bien implementado)
                document.querySelectorAll('.faq-question').forEach(question => {
                    question.addEventListener('click', () => {
                        const item = question.parentElement;
                        const wasActive = item.classList.contains('active');
                        document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));
                        if (!wasActive) {
                            item.classList.add('active');
                        }
                    });
                });

                // Hacer clicable el DIV padre del checkbox ---

                document.querySelectorAll('.gen-checkbox-item').forEach(item => {
                    // Ignorar el grupo del 'select'
                    if (item.classList.contains('select-group')) return;

                    item.addEventListener('click', (e) => {
                        // Si el clic NO fue en la etiqueta (que ya funciona sola)
                        if (e.target.tagName !== 'LABEL') {
                            const input = item.querySelector('input[type=checkbox]');
                            if (input && e.target !== input) {
                                // Simular un clic en el input, lo que dispara el 'change'
                                input.click(); 
                            }
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
                let charsetsUsed = {};
                
                if (type === 'random') {
                    let pool = '';
                    if (this.elements.lowercaseCheckbox.checked) { pool += this.charsets.lowercase; charsetsUsed.lowercase = true; }
                    if (this.elements.uppercaseCheckbox.checked) { pool += this.charsets.uppercase; charsetsUsed.uppercase = true; }
                    if (this.elements.numbersCheckbox.checked) { pool += this.charsets.numbers; charsetsUsed.numbers = true; }
                    if (this.elements.symbolsCheckbox.checked) { pool += this.charsets.symbols; charsetsUsed.symbols = true; }
                    if (pool === '') pool = this.charsets.lowercase; // Fallback
                    if (Object.keys(charsetsUsed).length === 0) charsetsUsed.lowercase = true;

                    const len = parseInt(this.elements.passwordLengthInput.value, 10);
                    for (let i = 0; i < len; i++) password += pool[this.cryptoRandom(pool.length)];
                
                } else if (type === 'memorable') {
                      const wc = parseInt(this.elements.wordCountInput.value, 10);

                      // 1. Obtiene la lista de palabras correcta (ej: 'en' o 'es')
                      const wordList = this.memorableWords[state.currentLang] || this.memorableWords.en;
                      
                      let words = [];
                      // 2. Usa la wordList correcta para generar las palabras
                      for (let i=0; i<wc; i++) words.push(wordList[this.cryptoRandom(wordList.length)]);
 

                      if (this.elements.memorableCapitalizeCheckbox.checked) words = words.map(w=>w[0].toUpperCase()+w.slice(1));
                      
                      password = words.join(this.elements.separatorSelect.value);
                      
                      if (this.elements.memorableNumbersCheckbox.checked) {
                          password += this.cryptoRandom(100);
                          charsetsUsed.numbers = true;
                      }
                      if (this.elements.memorableSymbolsCheckbox.checked) {
                          password += this.charsets.symbols[this.cryptoRandom(this.charsets.symbols.length)];
                          charsetsUsed.symbols = true;
                      }
                      
                      // Para entropía de memorable: estimamos minúsculas/mayúsculas y la longitud de las palabras.
                      charsetsUsed.lowercase = true;
                      if (this.elements.memorableCapitalizeCheckbox.checked) charsetsUsed.uppercase = true;
                      if (this.elements.separatorSelect.value !== '') charsetsUsed.symbols = true; // Incluye separadores como símbolos
                      

                } else if (type === 'pin') {
                    const len = parseInt(this.elements.pinLengthInput.value, 10);
                    for (let i = 0; i < len; i++) password += this.charsets.numbers[this.cryptoRandom(10)];
                    charsetsUsed.numbers = true;
                }
                this.elements.passwordOutput.value = password;
                this.updateStrength(password, charsetsUsed);
            },
            
            updateStrength(password, charsetsUsed = {}) {
                let score = 0;
                if (!password) score = -1;
                else {
                    score = 1;
                    if (password.length >= 12) score++;
                    if (password.length >= 16) score++;
                    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
                    if (/\d/.test(password)) score++;
                    if (/[^A-Za-z0-9]/.test(password)) score++;
                }
                
                // 1. Calcular y mostrar entropía
                const { bits, crackTimeShort } = cryptoLogic.calculateEntropy(password, charsetsUsed);
                const entropyText = `${getTranslation('entropy_label')} ${getTranslation('entropy_bits', bits)}`;
                const crackTimeText = crackTimeShort.replace('~', getTranslation('crack_time_very_short') === crackTimeShort ? '' : ' | '); // Evitar doble ~

                // 2. Determinar el nivel y color
                const levels = { '-1': '', 0: 'complexity_very_weak', 1: 'complexity_weak', 2: 'complexity_weak', 3: 'complexity_good', 4: 'complexity_strong', 5: 'complexity_strong', 6: 'complexity_strong' };
                const colors = { '-1': 'transparent', 0: 'var(--accent-weak)', 1: 'var(--accent-weak)', 2: 'var(--accent-medium)', 3: 'var(--accent-strong)', 4: 'var(--accent-strong)', 5: 'var(--primary-color)' };
                const levelKey = levels[score] || '';
                
                this.elements.complexityCheck.innerHTML = `<span>${getTranslation(levelKey)}</span><span style="font-size: .8em; color: var(--text-secondary);">${entropyText}${crackTimeShort}</span>`;
                
                this.elements.complexityCheck.className = 'gen-complexity-check';
                if (score <= 1) this.elements.complexityCheck.classList.add('error');
                else if (score <= 3) this.elements.complexityCheck.classList.add('warning');
                else this.elements.complexityCheck.classList.add('success');
                
                this.elements.strengthBar.style.width = score < 0 ? '0%' : `${(score / 5) * 100}%`;
                this.elements.strengthBar.style.backgroundColor = colors[score];
            },
            
            copyPassword() {
                const password = this.elements.passwordOutput.value;
                if (!password) return;
                navigator.clipboard.writeText(password).then(() => {
                    this.showCopyMessage();
                    this.addPasswordToHistory(password);
                }).catch(err => {
                    console.error('Error al copiar: ', err);
                    this.elements.passwordOutput.select();
                    document.execCommand('copy');
                    this.showCopyMessage();
                    this.addPasswordToHistory(password);
                });
            },
            
            showCopyMessage() {
                dom.copyMessage.classList.add('show');
                setTimeout(() => dom.copyMessage.classList.remove('show'), 2000);
            },
            
            showQrCode() {
                const password = this.elements.passwordOutput.value;
                if (!password || !dom.qrModal) return;
                this.elements.qrcodeContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(password)}" alt="QR Code">`;
                dom.qrModal.classList.add('active');
            },

            addPasswordToHistory(password) {
                // Solo añadir si el historial está desbloqueado. Si está bloqueado, no lo almacenamos.
                if (!password || !state.isHistoryDecrypted || state.passwordHistory.some(item => item.password === password)) return; 

                state.passwordHistory.unshift({ id: Date.now(), password });
                if (state.passwordHistory.length > 50) state.passwordHistory.pop();
                
                // Cifrar y guardar
                const masterKeyHash = localStorage.getItem(MASTER_KEY_HASH_KEY);
                if (masterKeyHash) {
                    const tempKey = masterKeyHash; // Usamos el hash como una clave temporal de cifrado/descifrado para el historial
                    localStorage.setItem(ENCRYPTED_HISTORY_KEY, cryptoLogic.encryptHistory(tempKey));
                }
                
                this.renderPasswordHistory();
            },

            renderPasswordHistory() {
                this.elements.passwordHistoryList.innerHTML = '';
                
                if (!state.isHistoryDecrypted && localStorage.getItem(MASTER_KEY_HASH_KEY)) {
                     // Historial cifrado y bloqueado
                    this.elements.passwordHistoryList.innerHTML = `<p class="no-history-message" data-translate-key="history_locked">${getTranslation('history_locked')}</p><button id="unlockHistoryBtn" class="action-btn" style="margin-top: 10px;" data-translate-key="history_unlock">${getTranslation('history_unlock')}</button>`;
                    document.getElementById('unlockHistoryBtn').addEventListener('click', () => dom.masterPasswordModal.classList.add('active'));
                    this.elements.exportCsvBtn.style.display = 'none';
                    this.elements.clearHistoryBtn.style.display = 'none';
                    return;
                }
                
                // Historial vacío
                const hasHistory = state.passwordHistory.length > 0;
                if (!hasHistory) {
                    this.elements.passwordHistoryList.innerHTML = `<p class="no-history-message" data-translate-key="history_empty">${getTranslation('history_empty')}</p>`;
                }
                
                this.elements.exportCsvBtn.style.display = hasHistory ? 'inline-block' : 'none';
                this.elements.clearHistoryBtn.style.display = hasHistory ? 'inline-block' : 'none';

                state.passwordHistory.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'history-item';
                    itemDiv.innerHTML = `<span class="history-password">${item.password}</span><div class="history-item-actions"><button class="copy-hist-btn"><i class="fa-regular fa-copy"></i></button><button class="delete-hist-btn"><i class="fa-solid fa-trash-can"></i></button></div>`;
                    itemDiv.querySelector('.copy-hist-btn').addEventListener('click', () => {
                        navigator.clipboard.writeText(item.password).then(() => {
                            this.showCopyMessage();
                        });
                    });
                    itemDiv.querySelector('.delete-hist-btn').addEventListener('click', () => {
                        state.passwordHistory = state.passwordHistory.filter(h => h.id !== item.id);
                        
                        // Recifrar y guardar
                        const masterKeyHash = localStorage.getItem(MASTER_KEY_HASH_KEY);
                        if (masterKeyHash) {
                            localStorage.setItem(ENCRYPTED_HISTORY_KEY, cryptoLogic.encryptHistory(masterKeyHash));
                        } else {
                            // Si no hay hash, guardamos en texto plano (legacy o primera vez, aunque no debería pasar si se maneja bien)
                            localStorage.setItem(ENCRYPTED_HISTORY_KEY, JSON.stringify(state.passwordHistory));
                        }
                        this.renderPasswordHistory();
                    });
                    this.elements.passwordHistoryList.appendChild(itemDiv);
                });
            },

            clearHistory() {
                if (confirm(getTranslation('history_clear_confirm'))) {
                    state.passwordHistory = [];
                    localStorage.removeItem(ENCRYPTED_HISTORY_KEY);
                    localStorage.removeItem(MASTER_KEY_HASH_KEY);
                    state.isHistoryDecrypted = true; // Si lo borras, se considera desbloqueado (vacío)
                    this.renderPasswordHistory();
                }
            },

            exportHistoryToCSV() {
                if (state.passwordHistory.length === 0) return;
                const rows = ["password", ...state.passwordHistory.map(i => `"${(i.password || '').replace(/"/g, '""')}"`)];
                const csvContent = "data:text/csv;charset=utf-8," + rows.join("\r\n");
                const link = document.createElement('a');
                link.href = encodeURI(csvContent);
                link.download = "securepass_history.csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        },
        verifier: {
            elements: {},
            validations: {
                length: pass => pass.length >= 8,
                uppercase: pass => /[A-Z]/.test(pass),
                numbers: pass => /[0-9]/.test(pass),
                symbols: pass => /[!@#$%^&*(),.?":{}|<>]/.test(pass),
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
                        length: document.querySelector('[data-criterion="length"]'),
                        uppercase: document.querySelector('[data-criterion="uppercase"]'),
                        numbers: document.querySelector('[data-criterion="numbers"]'),
                        symbols: document.querySelector('[data-criterion="symbols"]'),
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
            
            updateUI(score, password, entropyResult) {
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
                    // Estado: Expuesta
                    barColor = 'var(--accent-exposed)';
                    this.elements.messageBox.className = 'ver-message-box exposed';
                    this.elements.messageIcon.className = 'fa-solid fa-triangle-exclamation';
                    this.elements.messageTitle.textContent = getTranslation('ver_exposed_title');
                    this.elements.messageDetails.textContent = getTranslation('ver_exposed_desc', state.verifier.exposureCount);
                    
                } else if (score === totalChecks) {
                    // Estado: Segura
                    barColor = 'var(--accent-strong)';
                    this.elements.messageBox.className = 'ver-message-box success';
                    this.elements.messageIcon.className = 'fa-solid fa-shield-check';
                    this.elements.messageTitle.textContent = getTranslation('ver_secure_title');
                    this.elements.messageDetails.textContent = getTranslation('ver_secure_desc', entropyResult.crackTime);
                    
                } else {
                    // Estado: Débil / Media
                     barColor = strengthPercentage > 50 ? 'var(--accent-medium)' : 'var(--accent-weak)';
                    this.elements.messageBox.className = 'ver-message-box weak';
                    this.elements.messageIcon.className = 'fa-solid fa-exclamation-triangle';
                    this.elements.messageTitle.textContent = getTranslation('ver_weak_title');

                    // Lógica de Sugerencias Mejorada
                    let suggestions = [];
                    if (password.length < 16) suggestions.push(getTranslation('ver_weak_sugg_length'));
                    if (!this.validations.uppercase(password) || !this.validations.numbers(password) || !this.validations.symbols(password)) {
                        suggestions.push(getTranslation('ver_weak_sugg_complex'));
                    }
                    if (suggestions.length === 0 && password.length > 0) suggestions.push(getTranslation('ver_weak_sugg_generic'));
                    
                    this.elements.messageDetails.textContent = getTranslation('ver_weak_desc', suggestions.join(', '));
                }
                
                this.elements.strengthBar.style.width = `${strengthPercentage}%`;
                this.elements.strengthBar.style.backgroundColor = barColor;
            },
            
            async onPasswordInput() {
                const password = this.elements.passwordInput.value;
                let score = 0;
                
                // 1. Validaciones de criterios (local)
                Object.keys(this.validations).forEach(key => {
                    const criterionEl = this.elements.criteria[key];
                    if (this.validations[key](password)) {
                        score++;
                        criterionEl.classList.add('active');
                    } else {
                        criterionEl.classList.remove('active');
                    }
                });

                // 2. Calcular entropía
                const entropyResult = cryptoLogic.calculateEntropy(password);
                
                // 3. Mostrar UI inicial (sin exposición)
                clearTimeout(state.verifier.exposureCheckTimeout);
                this.elements.criteria.exposure.classList.remove('active', 'exposed');
                this.updateUI(score, password, entropyResult);

                // 4. Chequeo de exposición (debounced)
                state.verifier.exposureCheckTimeout = setTimeout(async () => {
                    const isSafe = await this.checkPasswordExposure(password);
                    const exposureEl = this.elements.criteria.exposure;
                    
                    let finalScore = score;
                    if (password.length > 0) {
                        if (isSafe) {
                            finalScore++;
                            exposureEl.classList.add('active');
                        } else {
                            exposureEl.classList.add('exposed');
                        }
                    }
                    // 5. Mostrar UI final con resultado de exposición
                    this.updateUI(finalScore, password, entropyResult);
                }, 500);
            }
        }
    };

    // ==========================================================
    //  6. INICIALIZACIÓN DE LA APLICACIÓN PRINCIPAL Y UTILIDADES
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
        setupFooterLinks();
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
        dom.infoBtn.addEventListener('click', () => {
            dom.infoModal.classList.add('active');
        });
        
        // Listener del modal de Contraseña Maestra (NEW)
        const masterPasswordInput = document.getElementById('masterPasswordInput');
        const masterPasswordSubmitBtn = document.getElementById('masterPasswordSubmitBtn');
        const masterPasswordError = document.getElementById('masterPasswordError');
        const toggleMasterPassword = document.getElementById('toggleMasterPassword');

        if (masterPasswordInput && masterPasswordSubmitBtn) {
            masterPasswordSubmitBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                masterPasswordError.style.display = 'none';
                const key = masterPasswordInput.value;
                
                const isSuccess = await cryptoLogic.unlockHistory(key);
                if (isSuccess) {
                    masterPasswordInput.value = '';
                    // El switchApp a generator ya está hecho en init(), solo renderizamos el historial.
                    if (state.currentApp === 'generator') appLogic.generator.renderPasswordHistory();
                } else {
                    masterPasswordError.textContent = getTranslation('mp_error_message');
                    masterPasswordError.style.display = 'block';
                }
            });
            
             if (toggleMasterPassword) {
                 toggleMasterPassword.addEventListener('click', () => {
                    const type = masterPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                    masterPasswordInput.setAttribute('type', type);
                    toggleMasterPassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
                 });
             }
        }
    }

    function setupFooterLinks() {
        // Manejo de enlaces de cambio de aplicación (Generador/Verificador)
        document.querySelectorAll('.footer-link[data-app]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const app = link.getAttribute('data-app');
                if (app === 'generator' || app === 'verifier') {
                    dom.appToggle.checked = app === 'verifier';
                    switchApp(app);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });

        const faqLink = document.querySelector('.footer-link[data-navigate-to-faq]');
        if (faqLink) {
            faqLink.addEventListener('click', (e) => {
                e.preventDefault();
                // 1. Si no estamos en el generador, cambiamos a él primero
                if (state.currentApp !== 'generator') {
                    dom.appToggle.checked = false;
                    switchApp('generator');
                }
                // 2. Buscamos la sección y nos desplazamos a ella
                const faqSection = document.getElementById('faq-section');
                if (faqSection) {
                    faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }

    function setupModalTriggers() {
        // Cierre de modales
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            if (!modal.dataset.closeListenerAttached) {
                modal.addEventListener('click', e => {
                    if (e.target === modal || e.target.closest('.close-btn')) {
                        modal.classList.remove('active');
                        // Limpiar campos de contraseña si se cierra el modal de clave maestra
                        if (modal.id === 'master-password-modal') {
                            document.getElementById('masterPasswordInput').value = '';
                            document.getElementById('masterPasswordError').style.display = 'none';
                        }
                    }
                });
                modal.dataset.closeListenerAttached = 'true';
            }
        });
        
        // Disparadores de modales
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
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
        
        // Copiar direcciones de criptomonedas
        document.querySelectorAll('.copy-address-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const address = btn.dataset.address;
                navigator.clipboard.writeText(address).then(() => {
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                    }, 2000);
                });
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
            const translation = getTranslation(key);
            
            if (translation) {
                // Comprobar si el elemento es un INPUT (o TEXTAREA)
                // y tiene un atributo 'placeholder'. Si es así, traducimos el placeholder.
                if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.hasAttribute('placeholder')) {
                    el.placeholder = translation;
                } else {
                    // Comportamiento original: traducir el texto interno
                    el.textContent = translation;
                }
            }
        });
        
        // Asegurar que se actualice el contenido dinámico dependiente del idioma
        if (state.currentApp === 'generator' && appLogic.generator.elements.passwordOutput) {
            appLogic.generator.updateStrength(appLogic.generator.elements.passwordOutput.value);
            appLogic.generator.renderPasswordHistory(); // Para actualizar el mensaje de "bloqueado"
            
            // Forzar la regeneración de la contraseña memorable si se cambia el idioma
            if (state.generator.currentGenerationType === 'memorable') {
                appLogic.generator.generatePassword();
            }
        }
        if (state.currentApp === 'verifier' && appLogic.verifier.elements.passwordInput) {
            appLogic.verifier.onPasswordInput();
        }
        localStorage.setItem('language', lang);
    }

    function init() {
        // Cargar estado
        const savedTheme = localStorage.getItem('theme') || 'light';
        const savedLang = localStorage.getItem('language') || 'es';
        
        // NEW: Inicializar historial cifrado
        cryptoLogic.loadInitialHistory();

        setTheme(savedTheme);
        setLanguage(savedLang);
        setupEventListeners();
        switchApp('generator'); // Carga la plantilla y llama a init() del generador
        setupModalTriggers();
        setupFooterLinks();
    }

    // ==========================================================
    //                        6. PLANTILLAS HTML
    // ==========================================================
     // (Las plantillas se mantienen en el script.js por simplicidad del ejemplo)
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
                            <button id="randomTypeBtn" class="active" data-translate-key="gen_type_random">Aleatoria</button>
                            <button id="memorableTypeBtn" data-translate-key="gen_type_memorable">Memorizable</button>
                            <button id="pinTypeBtn" data-translate-key="gen_type_pin">PIN</button>
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
                                <div class="gen-checkbox-item"><input type="checkbox" id="memorableCapitalize" checked/><label for="memorableCapitalize" data-translate-key="gen_opt_capitalize">Capitalizar</label></div>
                                <div class="gen-checkbox-item"><input type="checkbox" id="memorableNumbers" checked/><label for="memorableNumbers" data-translate-key="gen_opt_number">Número</label></div>
                                <div class="gen-checkbox-item"><input type="checkbox" id="memorableSymbols"/><label for="memorableSymbols" data-translate-key="gen_opt_symbol">Símbolo</label></div>
                                <div class="gen-form-group gen-checkbox-item select-group">
                                    <label for="separator" style="margin-right: 8px;" data-translate-key="gen_opt_separator">Separador</label>
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
                <section id="faq-section" class="extra-section">
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
            </div>`,
        verifier: `
            <div id="verifier-view" class="app-view">
                <div class="app-container">
                    <h1 data-translate-key="ver_main_title"></h1>
                    <p class="subtitle" data-translate-key="ver_subtitle"></p>
                    <div class="ver-password-wrapper">
                        <input type="password" id="passwordInput" placeholder="Introduce tu contraseña" autocomplete="new-password" data-translate-key="ver_placeholder">
                        <span id="togglePassword" class="ver-eye-icon"><i class="fas fa-eye"></i></span>
                    </div>
                    <div class="ver-strength-bar-container"><div id="strength-bar" class="ver-strength-bar"></div></div>
                    <div class="ver-criteria">
                        <div class="ver-criterion" data-criterion="length"><span><i class="fa-solid fa-check"></i></span> <span data-translate-key="ver_crit_length">8+ Caracteres</span></div>
                        <div class="ver-criterion" data-criterion="uppercase"><span><i class="fa-solid fa-check"></i></span> <span data-translate-key="ver_crit_uppercase">Mayúsculas [A-Z]</span></div>
                        <div class="ver-criterion" data-criterion="numbers"><span><i class="fa-solid fa-check"></i></span> <span data-translate-key="ver_crit_numbers">Números [0-9]</span></div>
                        <div class="ver-criterion" data-criterion="symbols"><span><i class="fa-solid fa-check"></i></span> <span data-translate-key="ver_crit_symbols">Símbolos [!@#]</span></div>
                        <div class="ver-criterion" data-criterion="exposure"><span><i class="fa-solid fa-check"></i></span> <span data-translate-key="ver_crit_exposed">No expuesta en filtraciones</span></div>
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

    init();
});