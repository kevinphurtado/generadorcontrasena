export const validators = {
  length: password => password.length >= 8,
  uppercase: password => /[A-Z]/.test(password),
  numbers: password => /\d/.test(password),
  symbols: password => /[^A-Za-z0-9]/.test(password)
};

export function evaluatePassword(password) {
  const results = Object.fromEntries(
    Object.entries(validators).map(([key, validator]) => [key, validator(password)])
  );
  const score = Object.values(results).filter(Boolean).length;
  return { results, score };
}

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

export async function checkPasswordExposure(password) {
  if (!password) {
    return { exposed: false, count: 0 };
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const digest = await (globalThis.crypto?.subtle ?? globalThis.crypto?.webcrypto?.subtle).digest('SHA-1', data);
  const hash = bufferToHex(digest);
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);
  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  if (!response.ok) {
    throw new Error('HIBP request failed');
  }
  const text = await response.text();
  const match = text.split('\n').find(line => line.startsWith(suffix));
  if (!match) {
    return { exposed: false, count: 0 };
  }
  const [, countString] = match.split(':');
  return { exposed: true, count: Number(countString || 0) };
}
