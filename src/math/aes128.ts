import { AES_KEY_SIZE_BYTES, BLOCK_SIZE_BYTES } from "./aesConstants.ts";
import {
  decryptPerBlock,
  encryptPerBlock,
  generateRandomBytes,
  type SBoxType,
} from "./aesHelper.ts";

/**
 * Generates an AES key of 16 bytes.
 *
 * The individual bytes can have a value of 0 to 255.
 *
 * @returns `Uint8Array` value containing the generated AES key.
 */
export const generateAes128Key = () => {
  return generateRandomBytes(AES_KEY_SIZE_BYTES);
};

/**
 * Convert a string into block(s) of size 16 bytes.
 *
 * Block(s) are 2D arrays of unsigned 8-bit integers.
 *
 * Block(s) are the main input to be fed into the AES encryptors.
 *
 * This method pads the blocks with zeroes by assigning the remaining empty block-element as 0 during `blocks` declaration.
 *
 * @param `text` The text that will be converted into a block(s).
 *
 * @returns `Uint8Array[]` containing the block equivalent of the input string.
 */
export const stringToBlocks = (text: string): Uint8Array[] => {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);

  const numberOfBlocks = Math.ceil(bytes.length / BLOCK_SIZE_BYTES);
  const blocks: Uint8Array[] = [];

  for (let i = 0; i < numberOfBlocks; i++) {
    const block = new Uint8Array(BLOCK_SIZE_BYTES);
    block.set(
      bytes.slice(
        i * BLOCK_SIZE_BYTES,
        i * BLOCK_SIZE_BYTES + BLOCK_SIZE_BYTES,
      ),
    );
    blocks.push(block);
  }

  return blocks;
};

/**
 * Convert a block(s) of size 16 bytes into a string.
 *
 * @param `blocks` The block(s) that will be converted into a string.
 *
 * @returns A string containg an equivalent of the input block(s).
 */
export const blocksToString = (blocks: Uint8Array[]): string => {
  const totalLength = blocks.length * BLOCK_SIZE_BYTES;
  const combined = new Uint8Array(totalLength);

  for (let i = 0; i < blocks.length; i++) {
    combined.set(blocks[i], i * BLOCK_SIZE_BYTES);
  }

  let lastNonZeroIndex = combined.length - 1;
  while (lastNonZeroIndex >= 0 && combined[lastNonZeroIndex] === 0) {
    lastNonZeroIndex--;
  }
  const trimmed = combined.slice(0, lastNonZeroIndex + 1);

  const decoder = new TextDecoder();
  const text = decoder.decode(trimmed);
  return text;
};

/**
 * Encrypt block(s) with AES-128.
 *
 * @param `plainTextBlocks` The block(s) that will be encrypted.
 *
 * @param `aesKey` The AES key.
 *
 * @returns An encrypted version of the input plaintext block(s).
 */
export const encryptBlock = (
  plainTextBlocks: Uint8Array[],
  aesKey: Uint8Array,
  sBoxType: SBoxType,
): Uint8Array[] => {
  const encryptedBlock: Uint8Array[] = structuredClone(plainTextBlocks);
  for (let i = 0; i < plainTextBlocks.length; i++) {
    encryptedBlock[i] = encryptPerBlock(plainTextBlocks[i], aesKey, sBoxType);
  }
  return encryptedBlock;
};

/**
 * Decrypt block(s) with AES-128.
 *
 * @param `encryptedBlocks` The block(s) that will be decrypted.
 *
 * @param `aesKey` The AES key.
 *
 * @returns A decrypted version of the input encrypted block(s).
 */
export const decryptBlock = (
  encryptedBlocks: Uint8Array[],
  aesKey: Uint8Array,
  sBoxType: SBoxType,
): Uint8Array[] => {
  const decryptedBlock: Uint8Array[] = structuredClone(encryptedBlocks);
  for (let i = 0; i < encryptedBlocks.length; i++) {
    decryptedBlock[i] = decryptPerBlock(encryptedBlocks[i], aesKey, sBoxType);
  }
  return decryptedBlock;
};
