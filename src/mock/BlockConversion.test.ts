import { expect, test } from "vitest";
import {
  blocksToString,
  encryptBlock,
  generateAes128Key,
  stringToBlocks,
} from "../math/aes128.ts";
import { decryptPerBlock } from "../math/aesHelper.ts";

const AESKey: Uint8Array = generateAes128Key();

const plainTextString: string =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

const plainTextAESBlocks: Uint8Array[] = stringToBlocks(plainTextString);

const encryptedAESBlock: Uint8Array[] = encryptBlock(
  plainTextAESBlocks,
  AESKey,
);

const decryptedAESBlock: Uint8Array[] = encryptedAESBlock;
for (let i = 0; i < encryptedAESBlock.length; i++) {
  decryptedAESBlock[i] = decryptPerBlock(encryptedAESBlock[i], AESKey);
}

const decryptedString: string = blocksToString(decryptedAESBlock);

test("Convert Plaintext AES blocks to string", () => {
  console.log(`Plain text : \n${plainTextString}\n`);
  console.log(
    `Reconverted converted plain text : \n${
      blocksToString(
        plainTextAESBlocks,
      )
    }\n`,
  );
  expect(blocksToString(plainTextAESBlocks)).toBe(plainTextString);
});

test("Convert decrypted AES blocks to string", () => {
  console.log(`Plain text : \n${plainTextString}\n`);
  console.log(`Reconverted converted decrypted text : \n${decryptedString}\n`);
  expect(decryptedString).toBe(plainTextString);
});
