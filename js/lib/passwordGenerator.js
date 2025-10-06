const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

const DEFAULT_WORDS = [
  'casa', 'mesa', 'perro', 'gato', 'azul', 'verde', 'sol', 'luna', 'agua', 'arbol',
  'flor', 'libro', 'cafe', 'nube', 'rio', 'feliz', 'mar', 'tierra', 'viento', 'fuego',
  'noche', 'dia', 'cielo', 'estrella', 'montana', 'bosque', 'lluvia', 'trueno', 'playa'
];

function cryptoRandomIndex(max) {
  const cryptoObj = globalThis.crypto?.getRandomValues
    ? globalThis.crypto
    : globalThis.crypto?.webcrypto;
  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
    throw new Error('Web Crypto API no disponible');
  }
  const array = new Uint32Array(1);
  cryptoObj.getRandomValues(array);
  return array[0] % max;
}

export function generateRandomPassword({ length, useLowercase, useUppercase, useNumbers, useSymbols }) {
  let pool = '';
  if (useLowercase) pool += LOWERCASE;
  if (useUppercase) pool += UPPERCASE;
  if (useNumbers) pool += NUMBERS;
  if (useSymbols) pool += SYMBOLS;
  if (!pool) {
    throw new Error('No character set selected');
  }
  const safeLength = Math.max(4, Math.min(length, 128));
  let password = '';
  for (let i = 0; i < safeLength; i += 1) {
    password += pool[cryptoRandomIndex(pool.length)];
  }
  return password;
}

export function generateMemorablePassword({
  wordCount,
  capitalize,
  includeNumber,
  includeSymbol,
  separator,
  words = DEFAULT_WORDS
}) {
  const count = Math.max(3, Math.min(wordCount, 8));
  const selected = [];
  for (let i = 0; i < count; i += 1) {
    let word = words[cryptoRandomIndex(words.length)];
    if (capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    selected.push(word);
  }
  let password = selected.join(separator);
  if (includeNumber) {
    password += `${cryptoRandomIndex(100)}`.padStart(2, '0');
  }
  if (includeSymbol) {
    password += SYMBOLS[cryptoRandomIndex(SYMBOLS.length)];
  }
  return password;
}

export function generatePin({ length }) {
  const safeLength = Math.max(4, Math.min(length, 10));
  let pin = '';
  for (let i = 0; i < safeLength; i += 1) {
    pin += NUMBERS[cryptoRandomIndex(NUMBERS.length)];
  }
  return pin;
}

export function estimateStrength(password) {
  if (!password) {
    return { score: -1, labelKey: '' };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labelMap = {
    0: 'complexity_very_weak',
    1: 'complexity_weak',
    2: 'complexity_weak',
    3: 'complexity_good',
    4: 'complexity_strong',
    5: 'complexity_strong'
  };

  return { score, labelKey: labelMap[score] || 'complexity_very_weak' };
}

export const characterSets = {
  lowercase: LOWERCASE,
  uppercase: UPPERCASE,
  numbers: NUMBERS,
  symbols: SYMBOLS
};

export const memorableWords = DEFAULT_WORDS;
