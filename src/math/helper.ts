/**
 * A helper function that multiplies an input byte by the polynomial {02} in GF(2^8).
 * It implements the finite field multiplication required for AES’s `MixColumns` function.
 *
 * @param byte The element of an AES state
 * @returns The element multiplied by 2 in GF(2^8)
 */
const xtime = (byte: number): number => {
  return ((byte << 1) ^ (byte & 0x80 ? 0x1b : 0)) & 0xff;
};

/**
 * A helper function that applies `MixColumns` transformation to a single 4-byte column of the AES state.
 * It performs XOR operations according to the fixed matrix multiplication in GF(2^8) defined by the AES standard.
 *
 * @param column The column of an AES state
 * @returns Transformed column
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
 * A helper function that applies GF(2^8) similar to `xtime()`.
 *
 * @param x Description to be added soon
 * @param y Description to be added soon
 * @returns Description to be added soon
 */
const multiply = (x: number, y: number): number => {
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
 * A helper function that applies `inverseMixColumns` transformation to a single 4-byte column of the AES state.
 *
 * @param column The column of an AES state
 * @returns Transformed column
 */
export const inverseMixSingleColumn = (column: Uint8Array): Uint8Array => {
  const temp = new Uint8Array(4);
  temp[0] = multiply(column[0], 0x0e) ^
    multiply(column[1], 0x0b) ^
    multiply(column[2], 0x0d) ^
    multiply(column[3], 0x09);
  temp[1] = multiply(column[0], 0x09) ^
    multiply(column[1], 0x0e) ^
    multiply(column[2], 0x0b) ^
    multiply(column[3], 0x0d);
  temp[2] = multiply(column[0], 0x0d) ^
    multiply(column[1], 0x09) ^
    multiply(column[2], 0x0e) ^
    multiply(column[3], 0x0b);
  temp[3] = multiply(column[0], 0x0b) ^
    multiply(column[1], 0x0d) ^
    multiply(column[2], 0x09) ^
    multiply(column[3], 0x0e);
  return temp;
};

/**
 * A helper function that checks if 2 arrays are deeply equal.
 *
 * @param a Array A
 * @param b Array B
 * @returns Equality evaluation
 */
const arrayEquality = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

/**
 * A helper function that checks if 2 AES blocks are equal.
 *
 * @param AESBlockA Uint8Array[] A
 * @param AESBlockB Uint8Array[] B
 * @returns Equality evaluation
 */
export const aesBlockEquality = (
  AESBlockA: Uint8Array[],
  AESBlockB: Uint8Array[],
): boolean => {
  if (AESBlockA.length !== AESBlockB.length) return false;
  for (let i = 0; i < AESBlockA.length; i++) {
    console.log(`A-blocks : ${AESBlockA[i]}\nB-blocks : ${AESBlockB[i]}\n`);
    if (!arrayEquality(AESBlockA[i], AESBlockB[i])) return false;
  }
  return true;
};
