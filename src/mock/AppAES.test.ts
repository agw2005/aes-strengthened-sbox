import { expect, test } from "vitest";
import {
  blocksToString,
  decryptBlock,
  encryptBlock,
  generateAes128Key,
  stringToBlocks,
} from "../math/aes128.ts";
import { flattenBlocks, splitIntoBlocks } from "../math/aesHelper.ts";
import { base64ToUint8Array, uint8ArrayToBase64 } from "../helper/base64.ts";

const aesKey = generateAes128Key();
const plainText = "Hello World!";

const plainTextBlock = stringToBlocks(plainText);
const encryptedTextBlocks = encryptBlock(plainTextBlock, aesKey);
// const encryptedTextString = blocksToString(encryptedTextBlocks);
const encryptedTextBlock = flattenBlocks(encryptedTextBlocks);
const encryptedBase64 = uint8ArrayToBase64(encryptedTextBlock);
const encryptedTextBlocksReconverted = splitIntoBlocks(
  base64ToUint8Array(encryptedBase64),
);

const encryptedTextBase64 = base64ToUint8Array(encryptedBase64);
const encryptedTextBlocks_ = splitIntoBlocks(encryptedTextBase64);
const decryptedTextBlocks = decryptBlock(encryptedTextBlocks_, aesKey);
const decryptedTextString = blocksToString(decryptedTextBlocks);

test("Encrypted Text Blocks is equal to reconverted encrypted text string to blocks", () => {
  console.log(`Encrypted text block : \n${encryptedTextBlocks}\n`);
  console.log(
    `Reconverted converted encrypted text block : \n${encryptedTextBlocksReconverted}\n`,
  );
  expect(encryptedTextBlocks).toStrictEqual(encryptedTextBlocksReconverted);
});

test("Plain text block is equal to decrypted text block", () => {
  console.log(`Plain text : \n${plainTextBlock}\n`);
  console.log(
    `Reconverted converted decrypted text : \n${decryptedTextBlocks}\n`,
  );
  expect(plainTextBlock).toStrictEqual(decryptedTextBlocks);
});

test("Plain text string is equal to decrypted text string", () => {
  console.log(`Plain text : \n${plainText}\n`);
  console.log(
    `Reconverted converted decrypted text : \n${decryptedTextString}\n`,
  );
  expect(plainText).toBe(decryptedTextString);
});
