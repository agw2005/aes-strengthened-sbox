import {
  AES_KEY_SIZE_BYTES,
  BLOCK_DIMENSION,
  BLOCK_SIZE_BYTES,
  INVERSE_S_BOX,
  ROUND_CONSTANTS,
  S_BOX,
} from "./aesConstants.ts";
import {
  EXPANDED_KEY_COUNT,
  IV_SIZE,
  POSSIBLE_BYTE_VALUES,
} from "./otherConstants.ts";

/**
 * Generates a random sequence of number of `length` bytes.
 *
 * The individual bytes can have a value of 0 to 255.
 *
 * @param length The size of the generated sequence.
 * @returns `Uint8Array` value containing the generated sequence.
 */
export const generateRandomBytes = (length: number): Uint8Array => {
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * POSSIBLE_BYTE_VALUES);
  }
  return bytes;
};

/**
 * Generates an initialization vector key of 16 bytes.
 *
 * The individual bytes can have a value of 0 to 255.
 *
 * @returns `Uint8Array` value containing the generated IV key.
 */
export const generateAesIV = () => {
  return generateRandomBytes(IV_SIZE);
};

/**
 * Return a value of an element in a block at a certain row and column.
 *
 * @param `block` The block that contains the element.
 * @param `row` The row-index of the element.
 * @param `col` The column-index of the element.
 * @returns `number` corresponding to an element in a block.
 */
export const getBlockByte = (
  block: Uint8Array,
  row: number,
  col: number,
): number => {
  return block[col * BLOCK_DIMENSION + row];
};

/**
 * Assign a `number` value to an element of a block at a certain row and column.
 *
 * @param `block` The block that contains the element.
 * @param `row` The row-index of the element.
 * @param `col` The column-index of the element.
 * @param `value` The value that is to be assigned to the element.
 *
 * @returns `void`
 */
export const setBlockByte = (
  block: Uint8Array,
  row: number,
  col: number,
  value: number,
): void => {
  block[col * BLOCK_DIMENSION + row] = value;
};

/**
 * Shifts the bytes of the input Uint8Array left by one position,
 * wrapping the first byte around to the last position.
 *
 * @param `word` - 4-byte array of integers representing a word.
 * @returns `Uint8Array` The word where its bytes are rotated left by one.
 */
const rotateWord = (word: Uint8Array): Uint8Array => {
  const newWord = [word[1], word[2], word[3], word[0]];
  return Uint8Array.from(newWord);
};

/**
 * Applies the AES S-box substitution to each byte in the input word.
 *
 * Each byte of the 4-byte input is replaced by its corresponding
 * value from the AES S-box.
 *
 * @param `word` A 4-byte Uint8Array representing a word to substitute.
 * @returns `Uint8Array` The word where each byte is the substituted value from `subByteBox`.
 */
const substituteWord = (word: Uint8Array): Uint8Array => {
  return word.map((byte) => S_BOX[byte]);
};

/**
 * Expands a 16-byte AES key into a larger key that will be used for AES rounds.
 *
 * "Rotate" in this context means to apply a cyclic left byte-rotation on a 4-byte word.
 *
 * The initial key `aesKey` is copied, then iteratively
 * generating new 4-byte words. Every time the current byte index is a multiple
 * of the AES key size, the previous 4-byte word is rotated, substituted via
 * the AES S-box, and XORed with a round constant before being XORed with the
 * bytes of the word before it.
 *
 * @param `aesKey` The original AES key as a `Uint8Array` of length 16 bytes.
 * @returns `Uint8Array` The expanded AES key.
 */
export const expandKey = (aesKey: Uint8Array): Uint8Array => {
  const expandedAESKeySizeBytes = EXPANDED_KEY_COUNT * AES_KEY_SIZE_BYTES;
  const expandedKey = new Uint8Array(expandedAESKeySizeBytes);
  expandedKey.set(aesKey);

  let bytesGenerated = AES_KEY_SIZE_BYTES;
  let roundConstantsIteration = 1;
  const temp = new Uint8Array(4);

  while (bytesGenerated < expandedAESKeySizeBytes) {
    temp.set(expandedKey.slice(bytesGenerated - 4, bytesGenerated));

    if (bytesGenerated % AES_KEY_SIZE_BYTES === 0) {
      const rotated = rotateWord(temp);
      const substituted = substituteWord(rotated);
      substituted[0] ^= ROUND_CONSTANTS[roundConstantsIteration];
      roundConstantsIteration++;
      temp.set(substituted);
    }

    const bytesBeforeCurrentPosition = 4;
    for (let i = 0; i < bytesBeforeCurrentPosition; i++) {
      expandedKey[bytesGenerated] =
        expandedKey[bytesGenerated - AES_KEY_SIZE_BYTES] ^ temp[i];
      bytesGenerated++;
    }
  }
  return expandedKey;
};

/**
 * Apply AES encryption at the individual block level.
 *
 * @param `block` The block that will be encrypted.
 * @param `aesKey` The AES key.
 * @returns `Uint8Array` The encrypted block.
 */
export const encryptPerBlock = (
  block: Uint8Array,
  aesKey: Uint8Array,
): Uint8Array => {
  const expandedKey = expandKey(aesKey);
  const startingRound = 1;
  const endingRound = 9;
  let resultBlock = addRoundKeys(block, expandedKey.slice(0, 16));

  for (let round = startingRound; round <= endingRound; round++) {
    const roundKey = expandedKey.slice(
      round * BLOCK_SIZE_BYTES,
      round * BLOCK_SIZE_BYTES + BLOCK_SIZE_BYTES,
    );
    resultBlock = substituteBytes(resultBlock);
    resultBlock = shiftRows(resultBlock);
    resultBlock = mixColumns(resultBlock);
    resultBlock = addRoundKeys(resultBlock, roundKey);
  }

  const finalRoundKey = expandedKey.slice(160, 176);
  resultBlock = substituteBytes(resultBlock);
  resultBlock = shiftRows(resultBlock);
  resultBlock = addRoundKeys(resultBlock, finalRoundKey);

  return resultBlock;
};

/**
 * Applies a byte substitution transformation to a given `block` using a predefined S-box.
 *
 * Each byte in the `block` is replaced by its corresponding substituted value from the S-box.
 *
 * @param `block` The `block` of bytes to be substituted; its length should be `BLOCK_DIMENSION` squared.
 * @returns `Uint8Array` A new block with the substituted bytes.
 */
const substituteBytes = (block: Uint8Array): Uint8Array => {
  const blockElementCount = BLOCK_DIMENSION ** 2;
  const substitutedBytesBlock = new Uint8Array(blockElementCount);
  for (let i = 0; i < blockElementCount; i++) {
    substitutedBytesBlock[i] = S_BOX[block[i]];
  }
  return substitutedBytesBlock;
};

/**
 * Takes a block and shifts each row cyclically to the left by its row index:
 * - The 0th row is not shifted.
 * - The 1st row is shifted by 1 byte.
 * - The 2nd row is shifted by 2 bytes.
 * - The 3rd row is shifted by 3 bytes.
 *
 * @param `block` The input block.
 * @returns `Uint8Array` A new shifted block.
 */
const shiftRows = (block: Uint8Array): Uint8Array => {
  const matrixElementCount = BLOCK_DIMENSION ** 2;
  const shiftedRowsBlock = new Uint8Array(matrixElementCount);
  for (let rowIndex = 0; rowIndex < BLOCK_DIMENSION; rowIndex++) {
    for (let columnIndex = 0; columnIndex < BLOCK_DIMENSION; columnIndex++) {
      const shiftedCol = (columnIndex + rowIndex) % BLOCK_DIMENSION;
      const value = getBlockByte(block, rowIndex, shiftedCol);
      setBlockByte(shiftedRowsBlock, rowIndex, columnIndex, value);
    }
  }
  return shiftedRowsBlock;
};

/**
 * Applies the `mixSingleColumn` transformation at each column of the input block independently.
 *
 * @param `block` The input block.
 * @returns `Uint8Array` The transformed input block.
 */
const mixColumns = (block: Uint8Array): Uint8Array => {
  const matrixElementCount = BLOCK_DIMENSION ** 2;
  const mixedColumnsBlock = new Uint8Array(matrixElementCount);
  for (let columnIndex = 0; columnIndex < BLOCK_DIMENSION; columnIndex++) {
    const column = block.slice(
      columnIndex * BLOCK_DIMENSION,
      columnIndex * BLOCK_DIMENSION + BLOCK_DIMENSION,
    );
    const mixedColumn = mixSingleColumn(column);
    mixedColumnsBlock.set(mixedColumn, columnIndex * BLOCK_DIMENSION);
  }
  return mixedColumnsBlock;
};

/**
 * Apply AES decryption at the individual block level.
 *
 * @param `block` The block that will be decrypted.
 * @param `aesKey` The AES key.
 * @returns `Uint8Array` The decrypted block.
 */
export const decryptPerBlock = (
  block: Uint8Array,
  aesKey: Uint8Array,
): Uint8Array => {
  const expandedKey = expandKey(aesKey);
  const startingRound = 1;
  const endingRound = 9;

  let resultBlock = addRoundKeys(block, expandedKey.slice(160, 176));

  for (let round = endingRound; round >= startingRound; round--) {
    resultBlock = inverseShiftRows(resultBlock);
    resultBlock = inverseSubstituteBytes(resultBlock);
    resultBlock = addRoundKeys(
      resultBlock,
      expandedKey.slice(
        round * BLOCK_SIZE_BYTES,
        round * BLOCK_SIZE_BYTES + BLOCK_SIZE_BYTES,
      ),
    );
    resultBlock = inverseMixColumns(resultBlock);
  }

  const finalRoundKey = expandedKey.slice(0, 16);
  resultBlock = inverseShiftRows(resultBlock);
  resultBlock = inverseSubstituteBytes(resultBlock);
  resultBlock = addRoundKeys(resultBlock, finalRoundKey);

  return resultBlock;
};

/**
 * Applies the inverse byte substitution transformation to a block using the AES inverse S-box.
 *
 * Each byte in the `block` is replaced by its corresponding value from the `INVERSE_S_BOX`.
 *
 * @param `block` - The input block of bytes to be inverse substituted.
 * @returns `Uint8Array` A new block with bytes replaced according to the inverse S-box.
 */
const inverseSubstituteBytes = (block: Uint8Array): Uint8Array => {
  const matrixElementCount = BLOCK_DIMENSION ** 2;
  const substitutedBytesBlock = new Uint8Array(matrixElementCount);
  for (let i = 0; i < matrixElementCount; i++) {
    substitutedBytesBlock[i] = INVERSE_S_BOX[block[i]];
  }
  return substitutedBytesBlock;
};

/**
 * Reverses the row shifting transformation on a block by cyclically shifting each row right by its row index.
 *
 * - The 0th row is not shifted.
 * - The 1st row is shifted right by 1 byte.
 * - The 2nd row is shifted right by 2 bytes.
 * - The 3rd row is shifted right by 3 bytes.
 *
 * @param `block` - The input block to be inverse shifted.
 * @returns `Uint8Array` A new block with rows shifted right to reverse the AES `shiftRows` step.
 */
const inverseShiftRows = (block: Uint8Array): Uint8Array => {
  const matrixRowCount = 4;
  const matrixColumnCount = 4;
  const matrixElementCount = matrixRowCount * matrixColumnCount;
  const shiftedRowsState = new Uint8Array(matrixElementCount);
  for (let rowIndex = 0; rowIndex < matrixRowCount; rowIndex++) {
    for (let columnIndex = 0; columnIndex < matrixColumnCount; columnIndex++) {
      const shiftedCol = (columnIndex - rowIndex + BLOCK_DIMENSION) %
        BLOCK_DIMENSION;
      const value = getBlockByte(block, rowIndex, shiftedCol);
      setBlockByte(shiftedRowsState, rowIndex, columnIndex, value);
    }
  }
  return shiftedRowsState;
};

/**
 * Applies the inverse MixColumns transformation to each column of the input block.
 *
 * Each column undergoes a matrix multiplication with the inverse mix columns matrix
 * to reverse the mixing effect of the AES MixColumns step.
 *
 * @param `block` - The input block of 16 bytes (4x4 matrix) to be inverse mixed.
 * @returns `Uint8Array` A new block with each column transformed by the inverse MixColumns operation.
 */
const inverseMixColumns = (block: Uint8Array): Uint8Array => {
  const matrixRowCount = 4;
  const matrixColumnCount = 4;
  const matrixElementCount = matrixRowCount * matrixColumnCount;
  const mixedColumnsState = new Uint8Array(matrixElementCount);
  for (let columnIndex = 0; columnIndex < matrixColumnCount; columnIndex++) {
    const column = block.slice(
      columnIndex * matrixColumnCount,
      columnIndex * matrixColumnCount + matrixColumnCount,
    );
    const mixedColumn = inverseMixSingleColumn(column);
    mixedColumnsState.set(mixedColumn, columnIndex * matrixColumnCount);
  }
  return mixedColumnsState;
};

/**
 * Performs a bitwise XOR operation between a block and a round-key.
 *
 * @param `block` The input block.
 * @param `roundKey` The round-key that is used.
 * @returns `Uint8Array` The XORed block.
 */
export const addRoundKeys = (
  block: Uint8Array,
  roundKey: Uint8Array,
): Uint8Array => {
  const XORedState = new Uint8Array(block.length);
  for (let i = 0; i < block.length; i++) {
    XORedState[i] = block[i] ^ roundKey[i];
  }
  return XORedState;
};

/**
 * Multiplies an input byte by the polynomial {02} in GF(2^8).
 *
 * It implements the finite field multiplication required for AES’s `mixColumns`.
 *
 * @param `byte` The element of a block.
 * @returns `number` The element multiplied by 2 in GF(2^8).
 */
const xtime = (byte: number): number => {
  return ((byte << 1) ^ (byte & 0x80 ? 0x1b : 0)) & 0xff;
};

/**
 * Performs XOR operations to a single 4-byte column of a block according to the fixed matrix multiplication in GF(2^8) defined by the AES standard.
 *
 * @param column The column of the block.
 * @returns `Uint8Array` The XORed column.
 */
export const mixSingleColumn = (column: Uint8Array): Uint8Array => {
  const temp = new Uint8Array(4);
  temp[0] = xtime(column[0]) ^ xtime(column[1]) ^ column[1] ^ column[2] ^
    column[3];
  temp[1] = column[0] ^ xtime(column[1]) ^ xtime(column[2]) ^ column[2] ^
    column[3];
  temp[2] = column[0] ^ column[1] ^ xtime(column[2]) ^ xtime(column[3]) ^
    column[3];
  temp[3] = xtime(column[0]) ^ column[0] ^ column[1] ^ column[2] ^
    xtime(column[3]);
  return temp;
};

/**
 * Multiplies two bytes in the finite field GF(2^8) used by AES.
 *
 * Uses repeated `xtime` operations and XOR to perform multiplication as defined by the AES polynomial.
 *
 * @param `x` The first byte (multiplicand).
 * @param `y` The second byte (multiplier).
 * @returns `number` The product of `x` and `y` in GF(2^8).
 */
const multiplyBytes = (x: number, y: number): number => {
  let result = 0;
  let a = x;
  let b = y;
  while (b > 0) {
    if (b & 1) result ^= a;
    a = xtime(a);
    b >>= 1;
  }
  return result & 0xff;
};

/**
 * Multiplies the column by a fixed matrix in GF(2^8).
 *
 * @param `column` An input column of a block.
 * @returns `Uint8Array` A new transformed column of a block.
 */
export const inverseMixSingleColumn = (column: Uint8Array): Uint8Array => {
  const temp = new Uint8Array(4);
  temp[0] = multiplyBytes(column[0], 0x0e) ^
    multiplyBytes(column[1], 0x0b) ^
    multiplyBytes(column[2], 0x0d) ^
    multiplyBytes(column[3], 0x09);
  temp[1] = multiplyBytes(column[0], 0x09) ^
    multiplyBytes(column[1], 0x0e) ^
    multiplyBytes(column[2], 0x0b) ^
    multiplyBytes(column[3], 0x0d);
  temp[2] = multiplyBytes(column[0], 0x0d) ^
    multiplyBytes(column[1], 0x09) ^
    multiplyBytes(column[2], 0x0e) ^
    multiplyBytes(column[3], 0x0b);
  temp[3] = multiplyBytes(column[0], 0x0b) ^
    multiplyBytes(column[1], 0x0d) ^
    multiplyBytes(column[2], 0x09) ^
    multiplyBytes(column[3], 0x0e);
  return temp;
};

/**
 * Evaluates whether 2 arrays are deeply equal.
 *
 * It checks if both element has the exact same value at the same indices.
 *
 * @param `arrayA` Input of data type `Uint8Array`.
 * @param `arrayB` Input of data type `Uint8Array`.
 * @returns `boolean` The evaluation of the equality.
 */
const arrayEquality = (arrayA: Uint8Array, arrayB: Uint8Array): boolean => {
  if (arrayA.length !== arrayB.length) return false;
  for (let i = 0; i < arrayA.length; i++) {
    if (arrayA[i] !== arrayB[i]) return false;
  }
  return true;
};

/**
 * Evaluates whether 2 blocks are deeply equal.
 *
 * It checks if both blocks has the exact same value at the same indices.
 *
 * @param blockA Input of data type `Uint8Array[]`.
 * @param blockB Input of data type `Uint8Array[]`.
 * @returns `boolean` The evaluation of the equality.
 */
export const aesBlockEquality = (
  blockA: Uint8Array[],
  blockB: Uint8Array[],
): boolean => {
  if (blockA.length !== blockB.length) return false;
  for (let i = 0; i < blockA.length; i++) {
    console.log(`A-blocks : ${blockA[i]}\nB-blocks : ${blockB[i]}\n`);
    if (!arrayEquality(blockA[i], blockB[i])) return false;
  }
  return true;
};
