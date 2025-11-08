import { expect, test } from "vitest";
import { decryptAes } from "../math/decryption.ts";
import { encryptAes } from "../math/encryption.ts";
import { generateAesKey } from "../math/keygen.ts";
import { aesBlocksToString, stringToAESBlocks } from "../math/state.ts";

const AESKey: Uint8Array = generateAesKey();

const plainTextString: string =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

const plainTextAESBlocks: Uint8Array[] = stringToAESBlocks(plainTextString);

const encryptedAESBlock: Uint8Array[] = plainTextAESBlocks;
for (let i = 0; i < plainTextAESBlocks.length; i++) {
  encryptedAESBlock[i] = encryptAes(plainTextAESBlocks[i], AESKey);
}
// Mutating elements inside an array or object doesn't count as reassigning the variable itself

const decryptedAESBlock: Uint8Array[] = encryptedAESBlock;
for (let i = 0; i < encryptedAESBlock.length; i++) {
  decryptedAESBlock[i] = decryptAes(encryptedAESBlock[i], AESKey);
}

const decryptedString: string = aesBlocksToString(decryptedAESBlock);

test("Convert Plaintext AES blocks to string", () => {
  console.log(`Plain text : ${plainTextString}`);
  console.log(
    `Reconverted converted plain text : ${
      aesBlocksToString(
        plainTextAESBlocks,
      )
    }\n`,
  );
  expect(aesBlocksToString(plainTextAESBlocks)).toBe(plainTextString);
});

test("Convert decrypted AES blocks to string", () => {
  console.log(`Plain text : ${plainTextString}`);
  console.log(`Reconverted converted decrypted text : ${decryptedString}\n`);
  expect(decryptedString).toBe(plainTextString);
});
