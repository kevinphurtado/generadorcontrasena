import test from 'node:test';
import assert from 'node:assert/strict';

import { evaluatePassword } from '../js/lib/passwordVerifier.js';

test('evaluatePassword detecta criterios básicos', () => {
  const empty = evaluatePassword('');
  assert.deepEqual(empty.results, { length: false, uppercase: false, numbers: false, symbols: false });
  assert.equal(empty.score, 0);

  const mixed = evaluatePassword('ClaveSegura123!');
  assert.equal(mixed.results.length, true);
  assert.equal(mixed.results.uppercase, true);
  assert.equal(mixed.results.numbers, true);
  assert.equal(mixed.results.symbols, true);
  assert.equal(mixed.score, 4);
});
