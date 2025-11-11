import { describe, expect, test } from "vitest";
import {
  blocksToString,
  decryptBlock,
  encryptBlock,
  generateAes128Key,
  stringToBlocks,
} from "../math/aes128.ts";
import {
  aesBlockEquality,
  flattenBlocks,
  SBOX_TYPE,
  splitIntoBlocks,
} from "../math/aesHelper.ts";
import { base64ToUint8Array, uint8ArrayToBase64 } from "../helper/base64.ts";

describe("Standard S-Box Test", () => {
  const sBoxMechanism = SBOX_TYPE.Original;

  const generatedAESKey: Uint8Array = generateAes128Key();

  const plainTextString: string =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

  const plainTextBlocks: Uint8Array[] = stringToBlocks(plainTextString);

  const encryptedTextBlocks: Uint8Array[] = encryptBlock(
    plainTextBlocks,
    generatedAESKey,
    sBoxMechanism,
  );

  const decryptedTextBlocks: Uint8Array[] = decryptBlock(
    encryptedTextBlocks,
    generatedAESKey,
    sBoxMechanism,
  );

  const decryptedTextString = blocksToString(decryptedTextBlocks);

  describe("Encryption-Decryption Test", () => {
    test("Plain text = Decrypted text", () => {
      console.log(`Plain text : \n${plainTextString}\n`);
      console.log(`Decrypted text : \n${decryptedTextString}\n`);
      expect(decryptedTextString).toBe(plainTextString);
    });
  });

  describe("Block Equality Test", () => {
    test("vitest built-in Uint8Array[] equality", () => {
      expect(plainTextBlocks).toStrictEqual(decryptedTextBlocks);
    });

    test("custom Uint8Array[] equality", () => {
      expect(aesBlockEquality(plainTextBlocks, decryptedTextBlocks)).toBe(true);
    });
  });

  describe("String-Block Conversion Test", () => {
    test("Block-String conversion : Plain-text string", () => {
      expect(plainTextString).toBe(
        blocksToString(stringToBlocks(plainTextString)),
      );
    });

    test("String-Block conversion : Encrypted-text string", () => {
      expect(blocksToString(encryptedTextBlocks)).toBe(
        blocksToString(stringToBlocks(blocksToString(encryptedTextBlocks))),
      );
    });

    test("String-Block conversion : Decrypted-text string", () => {
      expect(decryptedTextString).toBe(
        blocksToString(stringToBlocks(decryptedTextString)),
      );
    });
  });

  describe("Block-String Conversion Test", () => {
    test("String-Block conversion : Plain-text block", () => {
      expect(plainTextBlocks).toStrictEqual(
        stringToBlocks(blocksToString(plainTextBlocks)),
      );
    });

    test("Block-String conversion : Encrypted-text block", () => {
      console.log(`\Original : ${encryptedTextBlocks}\n`);
      console.log(
        `\nReconverted : ${
          splitIntoBlocks(
            base64ToUint8Array(
              uint8ArrayToBase64(flattenBlocks(encryptedTextBlocks)),
            ),
          )
        }\n`,
      );
      expect(encryptedTextBlocks).toStrictEqual(
        splitIntoBlocks(
          base64ToUint8Array(
            uint8ArrayToBase64(flattenBlocks(encryptedTextBlocks)),
          ),
        ),
      );
    });

    test("Block-String conversion : Decrypted-text block", () => {
      expect(stringToBlocks(decryptedTextString)).toStrictEqual(
        stringToBlocks(blocksToString(stringToBlocks(decryptedTextString))),
      );
    });
  });
});

describe("K4 S-Box Test", () => {
  const sBoxMechanism = SBOX_TYPE.K4;

  const generatedAESKey: Uint8Array = generateAes128Key();

  const plainTextString: string =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

  const plainTextBlocks: Uint8Array[] = stringToBlocks(plainTextString);

  const encryptedTextBlocks: Uint8Array[] = encryptBlock(
    plainTextBlocks,
    generatedAESKey,
    sBoxMechanism,
  );

  const decryptedTextBlocks: Uint8Array[] = decryptBlock(
    encryptedTextBlocks,
    generatedAESKey,
    sBoxMechanism,
  );

  const decryptedTextString = blocksToString(decryptedTextBlocks);

  describe("Encryption-Decryption Test", () => {
    test("Plain text = Decrypted text", () => {
      console.log(`Plain text : \n${plainTextString}\n`);
      console.log(`Decrypted text : \n${decryptedTextString}\n`);
      expect(decryptedTextString).toBe(plainTextString);
    });
  });

  describe("Block Equality Test", () => {
    test("vitest built-in Uint8Array[] equality", () => {
      expect(plainTextBlocks).toStrictEqual(decryptedTextBlocks);
    });

    test("custom Uint8Array[] equality", () => {
      expect(aesBlockEquality(plainTextBlocks, decryptedTextBlocks)).toBe(true);
    });
  });

  describe("String-Block Conversion Test", () => {
    test("Block-String conversion : Plain-text string", () => {
      expect(plainTextString).toBe(
        blocksToString(stringToBlocks(plainTextString)),
      );
    });

    test("String-Block conversion : Encrypted-text string", () => {
      expect(blocksToString(encryptedTextBlocks)).toBe(
        blocksToString(stringToBlocks(blocksToString(encryptedTextBlocks))),
      );
    });

    test("String-Block conversion : Decrypted-text string", () => {
      expect(decryptedTextString).toBe(
        blocksToString(stringToBlocks(decryptedTextString)),
      );
    });
  });

  describe("Block-String Conversion Test", () => {
    test("String-Block conversion : Plain-text block", () => {
      expect(plainTextBlocks).toStrictEqual(
        stringToBlocks(blocksToString(plainTextBlocks)),
      );
    });

    test("Block-String conversion : Encrypted-text block", () => {
      console.log(`\Original : ${encryptedTextBlocks}\n`);
      console.log(
        `\nReconverted : ${
          splitIntoBlocks(
            base64ToUint8Array(
              uint8ArrayToBase64(flattenBlocks(encryptedTextBlocks)),
            ),
          )
        }\n`,
      );
      expect(encryptedTextBlocks).toStrictEqual(
        splitIntoBlocks(
          base64ToUint8Array(
            uint8ArrayToBase64(flattenBlocks(encryptedTextBlocks)),
          ),
        ),
      );
    });

    test("Block-String conversion : Decrypted-text block", () => {
      expect(stringToBlocks(decryptedTextString)).toStrictEqual(
        stringToBlocks(blocksToString(stringToBlocks(decryptedTextString))),
      );
    });
  });
});

describe("K44 S-Box Test", () => {
  const sBoxMechanism = SBOX_TYPE.K44;

  const generatedAESKey: Uint8Array = generateAes128Key();

  const plainTextString: string =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

  const plainTextBlocks: Uint8Array[] = stringToBlocks(plainTextString);

  const encryptedTextBlocks: Uint8Array[] = encryptBlock(
    plainTextBlocks,
    generatedAESKey,
    sBoxMechanism,
  );

  const decryptedTextBlocks: Uint8Array[] = decryptBlock(
    encryptedTextBlocks,
    generatedAESKey,
    sBoxMechanism,
  );

  const decryptedTextString = blocksToString(decryptedTextBlocks);

  describe("Encryption-Decryption Test", () => {
    test("Plain text = Decrypted text", () => {
      console.log(`Plain text : \n${plainTextString}\n`);
      console.log(`Decrypted text : \n${decryptedTextString}\n`);
      expect(decryptedTextString).toBe(plainTextString);
    });
  });

  describe("Block Equality Test", () => {
    test("vitest built-in Uint8Array[] equality", () => {
      expect(plainTextBlocks).toStrictEqual(decryptedTextBlocks);
    });

    test("custom Uint8Array[] equality", () => {
      expect(aesBlockEquality(plainTextBlocks, decryptedTextBlocks)).toBe(true);
    });
  });

  describe("String-Block Conversion Test", () => {
    test("Block-String conversion : Plain-text string", () => {
      expect(plainTextString).toBe(
        blocksToString(stringToBlocks(plainTextString)),
      );
    });

    test("String-Block conversion : Encrypted-text string", () => {
      expect(blocksToString(encryptedTextBlocks)).toBe(
        blocksToString(stringToBlocks(blocksToString(encryptedTextBlocks))),
      );
    });

    test("String-Block conversion : Decrypted-text string", () => {
      expect(decryptedTextString).toBe(
        blocksToString(stringToBlocks(decryptedTextString)),
      );
    });
  });

  describe("Block-String Conversion Test", () => {
    test("String-Block conversion : Plain-text block", () => {
      expect(plainTextBlocks).toStrictEqual(
        stringToBlocks(blocksToString(plainTextBlocks)),
      );
    });

    test("Block-String conversion : Encrypted-text block", () => {
      console.log(`\Original : ${encryptedTextBlocks}\n`);
      console.log(
        `\nReconverted : ${
          splitIntoBlocks(
            base64ToUint8Array(
              uint8ArrayToBase64(flattenBlocks(encryptedTextBlocks)),
            ),
          )
        }\n`,
      );
      expect(encryptedTextBlocks).toStrictEqual(
        splitIntoBlocks(
          base64ToUint8Array(
            uint8ArrayToBase64(flattenBlocks(encryptedTextBlocks)),
          ),
        ),
      );
    });

    test("Block-String conversion : Decrypted-text block", () => {
      expect(stringToBlocks(decryptedTextString)).toStrictEqual(
        stringToBlocks(blocksToString(stringToBlocks(decryptedTextString))),
      );
    });
  });
});

describe("K81 S-Box Test", () => {
  const sBoxMechanism = SBOX_TYPE.K44;

  const generatedAESKey: Uint8Array = generateAes128Key();

  const plainTextString: string =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

  const plainTextBlocks: Uint8Array[] = stringToBlocks(plainTextString);

  const encryptedTextBlocks: Uint8Array[] = encryptBlock(
    plainTextBlocks,
    generatedAESKey,
    sBoxMechanism,
  );

  const decryptedTextBlocks: Uint8Array[] = decryptBlock(
    encryptedTextBlocks,
    generatedAESKey,
    sBoxMechanism,
  );

  const decryptedTextString = blocksToString(decryptedTextBlocks);

  describe("Encryption-Decryption Test", () => {
    test("Plain text = Decrypted text", () => {
      console.log(`Plain text : \n${plainTextString}\n`);
      console.log(`Decrypted text : \n${decryptedTextString}\n`);
      expect(decryptedTextString).toBe(plainTextString);
    });
  });

  describe("Block Equality Test", () => {
    test("vitest built-in Uint8Array[] equality", () => {
      expect(plainTextBlocks).toStrictEqual(decryptedTextBlocks);
    });

    test("custom Uint8Array[] equality", () => {
      expect(aesBlockEquality(plainTextBlocks, decryptedTextBlocks)).toBe(true);
    });
  });

  describe("String-Block Conversion Test", () => {
    test("Block-String conversion : Plain-text string", () => {
      expect(plainTextString).toBe(
        blocksToString(stringToBlocks(plainTextString)),
      );
    });

    test("String-Block conversion : Encrypted-text string", () => {
      expect(blocksToString(encryptedTextBlocks)).toBe(
        blocksToString(stringToBlocks(blocksToString(encryptedTextBlocks))),
      );
    });

    test("String-Block conversion : Decrypted-text string", () => {
      expect(decryptedTextString).toBe(
        blocksToString(stringToBlocks(decryptedTextString)),
      );
    });
  });

  describe("Block-String Conversion Test", () => {
    test("String-Block conversion : Plain-text block", () => {
      expect(plainTextBlocks).toStrictEqual(
        stringToBlocks(blocksToString(plainTextBlocks)),
      );
    });

    test("Block-String conversion : Encrypted-text block", () => {
      console.log(`\Original : ${encryptedTextBlocks}\n`);
      console.log(
        `\nReconverted : ${
          splitIntoBlocks(
            base64ToUint8Array(
              uint8ArrayToBase64(flattenBlocks(encryptedTextBlocks)),
            ),
          )
        }\n`,
      );
      expect(encryptedTextBlocks).toStrictEqual(
        splitIntoBlocks(
          base64ToUint8Array(
            uint8ArrayToBase64(flattenBlocks(encryptedTextBlocks)),
          ),
        ),
      );
    });

    test("Block-String conversion : Decrypted-text block", () => {
      expect(stringToBlocks(decryptedTextString)).toStrictEqual(
        stringToBlocks(blocksToString(stringToBlocks(decryptedTextString))),
      );
    });
  });
});
