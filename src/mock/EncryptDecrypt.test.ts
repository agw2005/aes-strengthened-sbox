import { expect, test } from "vitest";
import {
  decryptBlock,
  encryptBlock,
  generateAes128Key,
  stringToBlocks,
} from "../math/aes128.ts";
import { aesBlockEquality } from "../math/aesHelper.ts";

const AESKey: Uint8Array = generateAes128Key();

const PlainText: string =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

const AESBlocks: Uint8Array[] = stringToBlocks(PlainText);

const encryptedAESBlock: Uint8Array[] = encryptBlock(AESBlocks, AESKey);

const decryptedAESBlock: Uint8Array[] = decryptBlock(encryptedAESBlock, AESKey);

test("vitest built-in Uint8Array[] equality", () => {
  expect(decryptedAESBlock).toStrictEqual(AESBlocks);
});

test("custom Uint8Array[] equality", () => {
  expect(aesBlockEquality(AESBlocks, decryptedAESBlock)).toBe(true);
});
