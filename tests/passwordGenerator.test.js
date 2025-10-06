import test from 'node:test';
import assert from 'node:assert/strict';

import {
  generateRandomPassword,
  generateMemorablePassword,
  generatePin,
  estimateStrength,
  characterSets
} from '../js/lib/passwordGenerator.js';

test('generateRandomPassword respeta la longitud y los conjuntos seleccionados', () => {
  const length = 24;
  const password = generateRandomPassword({
    length,
    useLowercase: true,
    useUppercase: true,
    useNumbers: true,
    useSymbols: false
  });
  assert.equal(password.length, length);
  const allowed = new RegExp(`^[${characterSets.lowercase}${characterSets.uppercase}${characterSets.numbers}]+$`);
  assert.ok(allowed.test(password));
});

test('generateRandomPassword lanza error sin conjuntos habilitados', () => {
  assert.throws(() => {
    generateRandomPassword({ length: 10, useLowercase: false, useUppercase: false, useNumbers: false, useSymbols: false });
  }, /No character set selected/);
});

test('generateMemorablePassword crea frases con separador y opciones extra', () => {
  const password = generateMemorablePassword({
    wordCount: 4,
    capitalize: true,
    includeNumber: true,
    includeSymbol: true,
    separator: '-'
  });
  const parts = password.split('-');
  assert.equal(parts.length >= 4, true);
  assert.match(password, /[0-9]{1,2}[^A-Za-z0-9]$/);
});

test('generatePin limita la longitud permitida', () => {
  const pin = generatePin({ length: 12 });
  assert.equal(pin.length, 10);
  assert.match(pin, /^\d+$/);
});

test('estimateStrength calcula niveles esperados', () => {
  const weak = estimateStrength('abc');
  assert.equal(weak.score, 0);
  const strong = estimateStrength('CorrectHorseBatteryStaple42!');
  assert.ok(strong.score >= 4);
});
