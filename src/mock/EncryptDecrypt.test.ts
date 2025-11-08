import { decryptAes } from "../math/decryption.ts";
import { encryptAes } from "../math/encryption.ts";
import { generateAesKey } from "../math/keygen.ts";
import { stringToAESBlocks } from "../math/state.ts";

const AESKey: Uint8Array = generateAesKey();
console.log(`AES Key : ${AESKey}\n`);

const PlainText: string =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
console.log(`Text : ${PlainText}\n`);

const AESBlocks: Uint8Array[] = stringToAESBlocks(PlainText);
console.log(`AES Blocks : ${AESBlocks}\n`);

const encryptedAESBlock: Uint8Array[] = AESBlocks;
for (let i = 0; i < AESBlocks.length; i++) {
  encryptedAESBlock[i] = encryptAes(AESBlocks[i], AESKey);
}
// Mutating elements inside an array or object doesn't count as reassigning the variable itself

console.log(`AES Blocks Encrypted : ${encryptedAESBlock}\n`);

const decryptedAESBlock: Uint8Array[] = encryptedAESBlock;
for (let i = 0; i < encryptedAESBlock.length; i++) {
  decryptedAESBlock[i] = decryptAes(encryptedAESBlock[i], AESKey);
}

console.log(`AES Blocks Decrypted : ${decryptedAESBlock}\n`);
