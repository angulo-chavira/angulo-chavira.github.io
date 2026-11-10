(() => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const ITERATIONS = 310000;
  const toBase64 = (bytes) => {
    let binary = "";
    for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };
  const fromBase64 = (value) => Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

  async function deriveKey(passphrase, salt, iterations) {
    if (!globalThis.crypto?.subtle) throw new Error("Este navegador no ofrece Web Crypto. Abre el sitio con HTTPS o desde localhost.");
    const material = await crypto.subtle.importKey("raw", encoder.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
      material,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encrypt(data, passphrase) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(passphrase, salt, ITERATIONS);
    const plaintext = encoder.encode(JSON.stringify(data));
    const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
    return {
      version: 1,
      initialized: true,
      kdf: { name: "PBKDF2", hash: "SHA-256", iterations: ITERATIONS, salt: toBase64(salt) },
      cipher: { name: "AES-GCM", iv: toBase64(iv), ciphertext: toBase64(new Uint8Array(ciphertext)) }
    };
  }

  async function decrypt(envelope, passphrase) {
    if (!envelope?.initialized || envelope.version !== 1 || envelope.kdf?.name !== "PBKDF2" || envelope.cipher?.name !== "AES-GCM") {
      throw new Error("El archivo cifrado no tiene un formato válido.");
    }
    const salt = fromBase64(envelope.kdf.salt);
    const iv = fromBase64(envelope.cipher.iv);
    const ciphertext = fromBase64(envelope.cipher.ciphertext);
    const key = await deriveKey(passphrase, salt, Number(envelope.kdf.iterations) || ITERATIONS);
    const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
    return JSON.parse(decoder.decode(plaintext));
  }

  globalThis.VaultCrypto = Object.freeze({ encrypt, decrypt });
})();
