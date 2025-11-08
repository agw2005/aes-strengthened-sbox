import {
  AES_KEY_SIZE,
  EXPANDED_KEY_SIZE,
  roundConstants,
  subByteBox,
} from "./aesConstants.ts";

const rotateWord = (word: Uint8Array): Uint8Array => {
  return Uint8Array.from([word[1], word[2], word[3], word[0]]);
};

const substituteWord = (word: Uint8Array): Uint8Array => {
  return word.map((byte) => subByteBox[byte]);
};

export const expandKey = (aesKey: Uint8Array): Uint8Array => {
  const expandedKey = new Uint8Array(EXPANDED_KEY_SIZE);
  expandedKey.set(aesKey);

  let bytesGenerated = AES_KEY_SIZE;
  let roundConstantsIteration = 1;
  const temp = new Uint8Array(4);

  while (bytesGenerated < EXPANDED_KEY_SIZE) {
    temp.set(expandedKey.slice(bytesGenerated - 4, bytesGenerated));

    if (bytesGenerated % AES_KEY_SIZE === 0) {
      const rotated = rotateWord(temp);
      const substituted = substituteWord(rotated);
      substituted[0] ^= roundConstants[roundConstantsIteration];
      roundConstantsIteration++;
      temp.set(substituted);
    }

    const bytesBeforeCurrentPosition = 4;
    for (let i = 0; i < bytesBeforeCurrentPosition; i++) {
      expandedKey[bytesGenerated] = expandedKey[bytesGenerated - AES_KEY_SIZE] ^
        temp[i];
      bytesGenerated++;
    }
  }
  return expandedKey;
};
