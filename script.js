'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const translations = {
    es: {
      meta_title:"Generador de Contraseñas Seguro",
      main_title:"Generador de contraseñas seguro",
      subtitle:"Cree contraseñas fuertes y seguras al instante.",
      placeholder_generating:"Generando...",
      qr_code_btn_title:"Generar código QR",
      copy_btn_title:"Copiar contraseña",
      regenerate_btn_title:"Generar nueva contraseña",
      copied_message:"¡Copiado!",
      complexity_very_weak:"Contraseña muy débil",
      complexity_weak:"Contraseña débil",
      complexity_good:"Contraseña buena",
      complexity_strong:"Contraseña fuerte",
      type_random:"Aleatoria",
      type_memorable:"Memorizable",
      type_pin:"PIN",
      option_length:"Longitud de la contraseña",
      option_include:"Incluir:",
      option_word_count:"Número de palabras",
      option_memorable_options:"Opciones:",
      option_capitalize:"Capitalizar",
      option_include_number:"Número",
      option_include_symbol:"Símbolo",
      option_separator:"Separador",
      separator_hyphen:"Guión",
      separator_underscore:"Guión bajo",
      separator_dot:"Punto",
      separator_space:"Espacio",
      separator_none:"Ninguno",
      option_pin_length:"Longitud del PIN",
      pin_note:"Los PIN usan únicamente dígitos (0–9).",
      entropy_label:"Entropía estimada",
      cracktime_label:"Tiempo de crackeo",
      cracktime_note:"Estimación con fuerza bruta (~1×10⁹ intentos/seg), promedio 50% del espacio.",
      local_security_message:"Esta herramienta utiliza JavaScript para generar contraseñas en tu navegador localmente. Estas contraseñas no se transmiten a nuestros servidores.",
      history_title:"Historial de contraseñas",
      history_empty:"No hay contraseñas en el historial.",
      history_export_csv:"Exportar a CSV",
      history_clear:"Borrar historial",
      footer_tagline:"Seguridad digital a tu alcance.",
      footer_info:"Información",
      footer_privacy:"Política de privacidad",
      footer_products:"Política de productos",
      footer_legal:"Información legal",
      footer_extensions:"Extensiones",
      footer_add_extension:"Añadir a Chrome",
      qr_modal_title:"Código QR de tu Contraseña",
      qr_modal_warning:"Escanea este QR para transferir la contraseña. No lo compartas públicamente.",
      tips_title:"¿Necesitas repasar las prácticas recomendadas?",
      tips_subtitle:"Estos son nuestros consejos para crear contraseñas seguras. Céntrate en la longitud, la complejidad y la exclusividad.",
      tip1_title:"Larga",
      tip1_desc:"Cuanto más larga es una contraseña, más segura es. Una contraseña segura debe tener al menos 16 caracteres.",
      tip2_title:"Compleja",
      tip2_desc:"Utiliza una combinación de letras mayúsculas, minúsculas, números y símbolos para formar una cadena impredecible.",
      tip3_title:"Única",
      tip3_desc:"Cada cuenta debe tener una contraseña única. Reutilizar contraseñas es uno de los mayores riesgos de seguridad.",
      faq_title:"Preguntas frecuentes",
      faq_subtitle:"¿Tienes alguna pregunta? ¡Encontrarás las respuestas aquí!",
      faq1_q:"¿Es seguro usar este generador?",
      faq1_a:"Sí. Las contraseñas se generan en tu navegador y nunca se envían a ningún servidor. Es 100% seguro y privado.",
      faq2_q:"¿Por qué no debería crear mis propias contraseñas?",
      faq2_a:"Los humanos tendemos a crear patrones predecibles (fechas, nombres, secuencias). Un generador crea verdaderamente aleatorias.",
      faq3_q:"¿Cuál es la contraseña más segura?",
      faq3_a:"Una contraseña larga (16+ caracteres) con todos los tipos, o una frase memorable de 4+ palabras.",
      donate_button:"Donar",
      donate_modal_title:"Apoya este proyecto",
      donate_modal_desc:"Si esta herramienta te resulta útil, considera hacer una donación para apoyar su desarrollo y mantenimiento."
    },
    en: {
      meta_title:"Secure Password Generator",
      main_title:"Secure Password Generator",
      subtitle:"Create strong and secure passwords instantly.",
      placeholder_generating:"Generating...",
      qr_code_btn_title:"Generate QR Code",
      copy_btn_title:"Copy Password",
      regenerate_btn_title:"Regenerate Password",
      copied_message:"Copied!",
      complexity_very_weak:"Very weak password",
      complexity_weak:"Weak password",
      complexity_good:"Good password",
      complexity_strong:"Strong password",
      type_random:"Random",
      type_memorable:"Memorable",
      type_pin:"PIN",
      option_length:"Password Length",
      option_include:"Include:",
      option_word_count:"Number of Words",
      option_memorable_options:"Options:",
      option_capitalize:"Capitalize",
      option_include_number:"Number",
      option_include_symbol:"Symbol",
      option_separator:"Separator",
      separator_hyphen:"Hyphen",
      separator_underscore:"Underscore",
      separator_dot:"Dot",
      separator_space:"Space",
      separator_none:"None",
      option_pin_length:"PIN Length",
      pin_note:"PINs use digits only (0–9).",
      entropy_label:"Estimated entropy",
      cracktime_label:"Crack time",
      cracktime_note:"Brute-force estimate (~1×10⁹ guesses/s), ~50% of space on average.",
      local_security_message:"This tool uses JavaScript to generate passwords locally in your browser. These passwords are not transmitted to our servers.",
      history_title:"Password History",
      history_empty:"No passwords in history.",
      history_export_csv:"Export to CSV",
      history_clear:"Clear History",
      footer_tagline:"Digital security at your fingertips.",
      footer_info:"Information",
      footer_privacy:"Privacy Policy",
      footer_products:"Product Policy",
      footer_legal:"Legal Information",
      footer_extensions:"Extensions",
      footer_add_extension:"Add to Chrome",
      qr_modal_title:"Password QR Code",
      qr_modal_warning:"Scan this QR to transfer the password. Do not share it publicly.",
      tips_title:"Need a refresher on best practices?",
      tips_subtitle:"Focus on length, complexity, and uniqueness.",
      tip1_title:"Long",
      tip1_desc:"A strong password should be at least 16 characters long.",
      tip2_title:"Complex",
      tip2_desc:"Use uppercase, lowercase, numbers, and symbols.",
      tip3_title:"Unique",
      tip3_desc:"Never reuse passwords.",
      faq_title:"Frequently Asked Questions",
      faq_subtitle:"You'll find the answers here!",
      faq1_q:"Is it safe to use this generator?",
      faq1_a:"Yes. Passwords are generated in your browser and never sent to any server.",
      faq2_q:"Why shouldn't I create my own passwords?",
      faq2_a:"Humans create predictable patterns; generators are truly random.",
      faq3_q:"What is the most secure password?",
      faq3_a:"A long password (16+) with all character types, or a 4+ word passphrase.",
      donate_button:"Donate",
      donate_modal_title:"Support this Project",
      donate_modal_desc:"If you find this tool helpful, please consider making a donation to support its development and maintenance."
    }
  };

  const dom = {
    passwordOutput: document.getElementById('passwordOutput'),
    regenerateBtn: document.getElementById('regenerateBtn'),
    copyBtn: document.getElementById('copyBtn'),
    qrBtn: document.getElementById('qrBtn'),
    copyMessage: document.getElementById('copyMessage'),
    passwordLengthInput: document.getElementById('passwordLength'),
    lengthValueSpan: document.getElementById('lengthValue'),
    uppercaseCheckbox: document.getElementById('uppercase'),
    lowercaseCheckbox: document.getElementById('lowercase'),
    numbersCheckbox: document.getElementById('numbers'),
    symbolsCheckbox: document.getElementById('symbols'),
    strengthBar: document.getElementById('strengthBar'),
    complexityCheck: document.getElementById('complexityCheck'),
    randomTypeBtn: document.getElementById('randomTypeBtn'),
    memorableTypeBtn: document.getElementById('memorableTypeBtn'),
    pinTypeBtn: document.getElementById('pinTypeBtn'),
    randomOptions: document.getElementById('random-options-wrapper'),
    memorableOptions: document.getElementById('memorable-options-wrapper'),
    pinOptions: document.getElementById('pin-options-wrapper'),
    wordCountInput: document.getElementById('wordCount'),
    wordCountValueSpan: document.getElementById('wordCountValue'),
    separatorSelect: document.getElementById('separator'),
    memorableCapitalizeCheckbox: document.getElementById('memorableCapitalize'),
    memorableNumbersCheckbox: document.getElementById('memorableNumbers'),
    memorableSymbolsCheckbox: document.getElementById('memorableSymbols'),
    pinLengthInput: document.getElementById('pinLength'),
    pinLengthValueSpan: document.getElementById('pinLengthValue'),
    passwordHistoryList: document.getElementById('passwordHistoryList'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),
    noHistoryMessage: document.querySelector('.no-history-message'),
    themeBtn: document.getElementById('themeBtn'),
    translateBtn: document.getElementById('translateBtn'),
    qrModal: document.getElementById('qrModal'),
    qrcodeContainer: document.getElementById('qrcode'),
    modalTriggers: document.querySelectorAll('.modal-trigger'),
    modals: document.querySelectorAll('.modal'),
    closeBtns: document.querySelectorAll('.close-btn'),
    faqItems: document.querySelectorAll('.faq-item'),
    entropyValue: document.getElementById('entropyValue'),
    crackTimeValue: document.getElementById('crackTimeValue')
  };

  let state = {
    currentLang: 'es',
    currentTheme: 'light',
    currentGenerationType: 'random',
    passwordHistory: JSON.parse(localStorage.getItem('passwordHistory')) || []
  };

  const charsets = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  const memorableWords = ["casa","mesa","perro","gato","azul","verde","sol","luna","agua","arbol","flor","libro","cafe","nube","rio","feliz"];

  // -------- UTILIDADES
  function cryptoRandom(max){ const r=new Uint32Array(1); window.crypto.getRandomValues(r); return r[0]%max; }

  function log2(x){ return Math.log(x)/Math.LN2; }

  function humanizeDuration(seconds, lang=state.currentLang){
    if (!isFinite(seconds) || seconds<=0) return lang==='es'?'instantáneo':'instant';
    const units = [
      {s:31557600, es:'años', en:'years'},
      {s:2629800,  es:'meses', en:'months'},
      {s:604800,   es:'semanas', en:'weeks'},
      {s:86400,    es:'días', en:'days'},
      {s:3600,     es:'horas', en:'hours'},
      {s:60,       es:'min', en:'min'},
      {s:1,        es:'seg', en:'sec'}
    ];
    for (const u of units){
      if (seconds>=u.s){
        const v = seconds/u.s;
        const n = v>=100 ? Math.round(v) : (v>=10? Math.round(v*10)/10 : Math.round(v*100)/100);
        return `${n} ${u[lang]}`;
      }
    }
    return lang==='es'?'<1 seg':'<1 sec';
  }

  // -------- GENERACIÓN
  function generatePassword(){
    const t = state.currentGenerationType;
    let password = '';

    if (t==='random'){
      let pool = '';
      if (dom.lowercaseCheckbox.checked) pool+=charsets.lowercase;
      if (dom.uppercaseCheckbox.checked) pool+=charsets.uppercase;
      if (dom.numbersCheckbox.checked)   pool+=charsets.numbers;
      if (dom.symbolsCheckbox.checked)   pool+=charsets.symbols;
      if (pool==='') pool = charsets.lowercase; // safety

      const len = parseInt(dom.passwordLengthInput.value,10);
      for (let i=0;i<len;i++) password += pool[cryptoRandom(pool.length)];
    }

    if (t==='memorable'){
      const wc = parseInt(dom.wordCountInput.value,10);
      let words = [];
      for (let i=0;i<wc;i++) words.push(memorableWords[cryptoRandom(memorableWords.length)]);
      if (dom.memorableCapitalizeCheckbox.checked) words = words.map(w=>w[0].toUpperCase()+w.slice(1));
      password = words.join(dom.separatorSelect.value);
      if (dom.memorableNumbersCheckbox.checked) password += cryptoRandom(100);
      if (dom.memorableSymbolsCheckbox.checked) password += charsets.symbols[cryptoRandom(charsets.symbols.length)];
    }

    if (t==='pin'){
      const len = parseInt(dom.pinLengthInput.value,10);
      for (let i=0;i<len;i++) password += charsets.numbers[cryptoRandom(10)];
    }

    dom.passwordOutput.value = password;
    updateStrength(password);
    updateEntropyAndCrackTime(password);
  }

  // -------- ENTROPÍA Y CRACK TIME
  function estimateEntropyBits(password){
    const t = state.currentGenerationType;

    if (!password) return 0;

    if (t==='random'){
      let poolSize = 0;
      if (dom.lowercaseCheckbox.checked) poolSize += 26;
      if (dom.uppercaseCheckbox.checked) poolSize += 26;
      if (dom.numbersCheckbox.checked)   poolSize += 10;
      if (dom.symbolsCheckbox.checked)   poolSize += charsets.symbols.length;
      if (poolSize===0) poolSize = 26;
      return password.length * log2(poolSize);
    }

    if (t==='pin'){
      // Dígitos 0–9
      return password.length * log2(10);
    }

    // memorable (aprox): num_palabras * log2(tamaño_lista) + extras
    const words = password.split(dom.separatorSelect.value || /[\s\-\._]?/).filter(Boolean);
    const baseBits = (words.length || 0) * log2(memorableWords.length);
    let extra = 0;
    if (dom.memorableNumbersCheckbox.checked) extra += log2(100); // 0–99
    if (dom.memorableSymbolsCheckbox.checked) extra += log2(charsets.symbols.length);
    return baseBits + extra;
  }

  function updateEntropyAndCrackTime(password){
    const bits = estimateEntropyBits(password);
    const bitsRounded = Math.max(0, Math.round(bits*100)/100);
    dom.entropyValue.textContent = `${bitsRounded} bits`;

    // Suposición conservadora: 1e9 intentos por segundo; promedio 50% del espacio
    const guesses = Math.pow(2, bits) / 2;
    const rate = 1e9; // guesses/s
    const seconds = guesses / rate;

    dom.crackTimeValue.textContent = humanizeDuration(seconds);
  }

  // -------- MEDIDOR DE FUERZA
  function updateStrength(password){
    let score = 0;
    if (!password || password.length<8){ score = 0; }
    else{
      score = 1;
      if (password.length>=12) score++;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;
    }
    const levels={0:'very_weak',1:'weak',2:'weak',3:'good',4:'strong',5:'strong'};
    const colors={0:'var(--error-color)',1:'var(--error-color)',2:'var(--warning-color)',3:'var(--success-color)',4:'var(--success-color)',5:'var(--primary-color)'};
    const classes={0:'error',1:'error',2:'warning',3:'success',4:'success',5:'success'};
    const levelKey=`complexity_${levels[score]}`;

    dom.complexityCheck.textContent = translations[state.currentLang][levelKey] || '';
    dom.complexityCheck.className = `complexity-check ${classes[score]}`;
    dom.strengthBar.style.width = `${(score/5)*100}%`;
    dom.strengthBar.style.backgroundColor = colors[score];
  }

  // -------- HISTORIAL
  function renderPasswordHistory(){
    dom.passwordHistoryList.innerHTML = '';
    const hasHistory = state.passwordHistory.length>0;
    dom.noHistoryMessage.style.display = hasHistory?'none':'block';
    dom.exportCsvBtn.style.display = hasHistory?'inline-block':'none';
    dom.clearHistoryBtn.style.display = hasHistory?'inline-block':'none';

    state.passwordHistory.forEach(item=>{
      const itemDiv=document.createElement('div');
      itemDiv.className='history-item';
      itemDiv.innerHTML = `
        <span class="history-password">${item.password}</span>
        <div class="history-item-actions">
          <button class="history-btn copy-hist-btn" title="Copiar"><i class="fa-regular fa-copy"></i></button>
          <button class="history-btn delete-hist-btn" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button>
        </div>`;
      itemDiv.querySelector('.copy-hist-btn').addEventListener('click',()=>{
        navigator.clipboard.writeText(item.password);
        dom.copyMessage.textContent = translations[state.currentLang].copied_message;
        dom.copyMessage.classList.add('show');
        setTimeout(()=>dom.copyMessage.classList.remove('show'),2000);
      });
      itemDiv.querySelector('.delete-hist-btn').addEventListener('click',()=>{
        state.passwordHistory = state.passwordHistory.filter(h=>h.id!==item.id);
        localStorage.setItem('passwordHistory',JSON.stringify(state.passwordHistory));
        renderPasswordHistory();
      });
      dom.passwordHistoryList.appendChild(itemDiv);
    });
  }

  function addPasswordToHistory(password){
    if (!password) return;
    if (state.passwordHistory.some(item=>item.password===password)) return;
    const newItem = {id:Date.now(), password};
    state.passwordHistory.unshift(newItem);
    if (state.passwordHistory.length>50) state.passwordHistory.pop(); // aumentado el límite
    localStorage.setItem('passwordHistory', JSON.stringify(state.passwordHistory));
    renderPasswordHistory();
  }

  function exportHistoryToCSV(){
    const savedHistory = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    if (savedHistory.length===0) return;
    const rows = ["password", ...savedHistory.map(i=>`"${(i.password||'').replace(/"/g,'""')}"`)];
    const csvContent = "data:text/csv;charset=utf-8," + rows.join("\r\n");
    const link=document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = "password_history.csv";
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  }

  // -------- THEME & LANG
  function setTheme(theme){
    state.currentTheme=theme;
    document.body.classList.toggle('dark-mode', theme==='dark');
    dom.themeBtn.querySelector('i').className = theme==='dark'?'fas fa-sun':'fas fa-moon';
    localStorage.setItem('theme', theme);
  }
  function setLanguage(lang){
    state.currentLang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-translate-key]').forEach(el=>{
      const key = el.dataset.translateKey;
      if (translations[lang][key]) el.textContent = translations[lang][key];
    });
    document.querySelectorAll('[data-translate-title-key]').forEach(el=>{
      const key = el.dataset.translateTitleKey;
      if (translations[lang][key]) el.title = translations[lang][key];
    });
    localStorage.setItem('language', lang);
    updateStrength(dom.passwordOutput.value);
    updateEntropyAndCrackTime(dom.passwordOutput.value);
  }

  // -------- EVENTOS
  function setupEventListeners(){
    dom.regenerateBtn.addEventListener('click', generatePassword);
    dom.copyBtn.addEventListener('click', ()=>{
      if (!dom.passwordOutput.value) return;
      navigator.clipboard.writeText(dom.passwordOutput.value).then(()=>{
        dom.copyMessage.textContent = translations[state.currentLang].copied_message;
        dom.copyMessage.classList.add('show');
        setTimeout(()=>dom.copyMessage.classList.remove('show'),2000);
        addPasswordToHistory(dom.passwordOutput.value);
      });
    });

    dom.randomTypeBtn.addEventListener('click', ()=>{
      state.currentGenerationType='random';
      dom.randomTypeBtn.classList.add('active');
      dom.memorableTypeBtn.classList.remove('active');
      dom.pinTypeBtn.classList.remove('active');
      dom.randomOptions.style.display='block';
      dom.memorableOptions.style.display='none';
      dom.pinOptions.style.display='none';
      generatePassword();
    });
    dom.memorableTypeBtn.addEventListener('click', ()=>{
      state.currentGenerationType='memorable';
      dom.memorableTypeBtn.classList.add('active');
      dom.randomTypeBtn.classList.remove('active');
      dom.pinTypeBtn.classList.remove('active');
      dom.randomOptions.style.display='none';
      dom.memorableOptions.style.display='block';
      dom.pinOptions.style.display='none';
      generatePassword();
    });
    dom.pinTypeBtn.addEventListener('click', ()=>{
      state.currentGenerationType='pin';
      dom.pinTypeBtn.classList.add('active');
      dom.randomTypeBtn.classList.remove('active');
      dom.memorableTypeBtn.classList.remove('active');
      dom.randomOptions.style.display='none';
      dom.memorableOptions.style.display='none';
      dom.pinOptions.style.display='block';
      generatePassword();
    });

    dom.passwordLengthInput.addEventListener('input', ()=>{
      dom.lengthValueSpan.textContent = dom.passwordLengthInput.value;
      generatePassword();
    });
    dom.wordCountInput.addEventListener('input', ()=>{
      dom.wordCountValueSpan.textContent = dom.wordCountInput.value;
      generatePassword();
    });
    dom.pinLengthInput.addEventListener('input', ()=>{
      dom.pinLengthValueSpan.textContent = dom.pinLengthInput.value;
      generatePassword();
    });

    document.querySelectorAll('#random-options-wrapper input').forEach(el=>el.addEventListener('change', generatePassword));
    document.querySelectorAll('#memorable-options-wrapper input, #memorable-options-wrapper select').forEach(el=>el.addEventListener('change', generatePassword));

    dom.clearHistoryBtn.addEventListener('click', ()=>{
      state.passwordHistory = [];
      localStorage.removeItem('passwordHistory');
      renderPasswordHistory();
    });
    dom.exportCsvBtn.addEventListener('click', exportHistoryToCSV);

    dom.themeBtn.addEventListener('click', ()=> setTheme(state.currentTheme==='light'?'dark':'light'));
    dom.translateBtn.addEventListener('click', ()=> setLanguage(state.currentLang==='es'?'en':'es'));

    dom.qrBtn.addEventListener('click', ()=>{
      dom.qrcodeContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(dom.passwordOutput.value)}" alt="QR Code">`;
      dom.qrModal.style.display='flex';
    });
    
    // Re-query triggers every time to include new ones like the donate button
    document.querySelectorAll('.modal-trigger').forEach(trigger=>trigger.addEventListener('click', e=>{
      e.preventDefault();
      const modal = document.getElementById(trigger.dataset.modal);
      if(modal) modal.style.display='flex';
    }));

    document.querySelectorAll('.close-btn').forEach(btn=>btn.addEventListener('click', ()=> btn.closest('.modal').style.display='none'));
    window.addEventListener('click', e=>{ if (e.target.classList.contains('modal')) e.target.style.display='none'; });

    dom.faqItems.forEach(item=>{
      const question=item.querySelector('.faq-question');
      question.addEventListener('click', ()=>{
        const isActive=item.classList.contains('active');
        dom.faqItems.forEach(i=>i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  }

  function init(){
    setTheme(localStorage.getItem('theme') || 'light');
    setLanguage(localStorage.getItem('language') || 'es');
    setupEventListeners();
    renderPasswordHistory();
    generatePassword();
  }

  init();
});