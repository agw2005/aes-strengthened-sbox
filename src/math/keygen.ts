import { AES_KEY_SIZE, BIT_SIZE, IV_SIZE } from "./aesConstants.ts";

const generateRandomBytes = (length: number): Uint8Array => {
  const bytes = new Uint8Array(length);
  const bits = BIT_SIZE * 2;
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * bits);
  }
  return bytes;
};

export const generateAesKey = () => {
  return generateRandomBytes(AES_KEY_SIZE);
};

export const generateAesIV = () => {
  return generateRandomBytes(IV_SIZE);
};
