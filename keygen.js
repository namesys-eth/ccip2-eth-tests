import { etc } from 'ed25519-2.0.0'; // Replace with 'ed25519' for Node.js
import { utils, getPublicKey } from 'ed25519-1.6.1';
import { hkdf } from '@noble/hashes/hkdf';
import { sha256 } from '@noble/hashes/sha256';
import { utils as _utils, getPublicKey as _getPublicKey } from '@noble/secp256k1';
import pkg from 'cryptico';
const { generateRSAKey, publicKeyString } = pkg;

/**
 * @param  username key identifier
 * @param    caip10 CAIP identifier for the blockchain account
 * @param signature Deterministic signature from X-wallet provider
 * @param  password Optional password
 * @returns Deterministic private/public keypairs as hex strings
 * Hex-encoded
 * [  ed25519.priv,   ed25519.pub], 
 * [secp256k1.priv, secp256k1.pub]
 */
async function KEYGEN(
  username,
  caip10,
  signature,
  password
) {
  if (signature.length < 64)
    throw new Error('SIGNATURE TOO SHORT; LENGTH SHOULD BE 65 BYTES');
  let inputKey = sha256(
    etc.hexToBytes(
      signature.toLowerCase().startsWith('0x') ? signature.slice(2) : signature
    )
  );
  let info = `${caip10}:${username}`;
  let salt = sha256(`${info}:${password ? password : ''}:${signature.slice(-64)}`);
  let hashKey = hkdf(sha256, inputKey, salt, info, 42);
  let ed25519priv = utils.hashToPrivateScalar(hashKey).toString(16).padStart(64, "0"); // ed25519 (IPNS) Private Key
  let ed25519pub = etc.bytesToHex(await getPublicKey(ed25519priv)); // ed25519 (IPNS) Public Key
  let secp256k1priv = _utils.bytesToHex(_utils.hashToPrivateKey(hashKey)); // secp256k1 Private Key
  let secp256k1pub = _utils.bytesToHex(_getPublicKey(ed25519priv)); // secp256k1 Public Key
  return [ // Hex-encoded [[ed25519.priv, ed25519.pub], [secp256k1.priv, secp256k1.pub]]
    [ed25519priv, ed25519pub],
    [secp256k1priv, secp256k1pub]
  ];
}

/**
 * @param  username key identifier
 * @param    caip10 CAIP identifier for the blockchain account
 * @param signature Deterministic signature from X-wallet provider
 * @param  password Optional password
 * @returns Deterministic private/public keypair
 * [RSA.priv, RSA.pub]
 */
async function RSAGEN(
  username,
  caip10,
  signature,
  password
) {
  if (signature.length < 64)
    throw new Error('SIGNATURE TOO SHORT; LENGTH SHOULD BE 65 BYTES');
  let inputKey = sha256(
    etc.hexToBytes(
      signature.toLowerCase().startsWith('0x') ? signature.slice(2) : signature
    )
  );
  let BITS = 2048;
  let info = `${caip10}:${username}`;
  let salt = sha256(`${info}:${password ? password : ''}:${signature.slice(-64)}`);
  let hashKey = hkdf(sha256, inputKey, salt, info, 42);
  let privKey = generateRSAKey(hashKey, BITS);
  let pubKey = publicKeyString(privKey);
  return [privKey, pubKey]; // [RSA.priv, RSA.pub]
}

export default {
  KEYGEN,
  RSAGEN,
};
