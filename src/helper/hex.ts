import { AES_KEY_SIZE_BYTES } from "../math/aesConstants.ts";
/**
 * Convert an AES key of size 16 bytes into a string in hexadecimal form.
 *
 * @param `aesKey` The key that will be converted into a hexadecimal string.
 *
 * @returns `string` containg an equivalent of the input AES key.
 */
export const keyToHexadecimal = (aesKey: Uint8Array): string => {
  const bytes = aesKey;
  const hexString = Array.from(bytes)
    .map((key_byte) => key_byte.toString(AES_KEY_SIZE_BYTES).padStart(2, "0"))
    .join(":");

  return hexString;
};

/**
 * Convert a hexadecimal string representation of an AES key into a `Uint8Array` AES key.
 *
 * @param `hexKey` The colon-separated hexadecimal string.
 *
 * @returns `Uint8Array` containing the corresponding AES key.
 */
export const hexadecimalToKey = (hexKey: string): Uint8Array => {
  const byteStrings = hexKey.split(":");
  const bytes = byteStrings.map((byte) => parseInt(byte, AES_KEY_SIZE_BYTES));
  return new Uint8Array(bytes);
};

/**
 * Get the n-th byte (0-based) from a colon-separated hex key string.
 *
 * @param `hexKey` Colon-separated hex string representing the key.
 * @param `n` Zero-based index of the byte to retrieve.
 *
 * @returns `string` The n-th byte as a two-character hex string, or undefined if out of range.
 */
export const getNthByteFromHexKey = (hexKey: string, n: number): string => {
  const bytes = hexKey.split(":");
  if (n < 0 || n >= bytes.length) {
    throw new Error("Byte position needs to be between 0 and 15");
  }
  return bytes[n].padStart(2, "0");
};

/**
 * Convert an array of 16 two-character hex byte strings into a colon-separated hex string.
 *
 * @param aesKeyHexInputBytes Array of 16 strings, each representing a hex byte (e.g. ["e0", "09", ...]).
 *
 * @returns Colon-separated hex string of 16 bytes.
 */
export const hexBytesToStringHexBytes = (
  aesKeyHexInputBytes: string[],
): string => {
  if (aesKeyHexInputBytes.length !== 16) {
    throw new Error("Input array must have exactly 16 elements.");
  }
  return aesKeyHexInputBytes.map((byte) => byte.padStart(2, "0")).join(":");
};
