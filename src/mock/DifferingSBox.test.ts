import { describe, expect, test } from "vitest";
import {
  blocksToString,
  decryptBlock,
  encryptBlock,
  generateAes128Key,
  stringToBlocks,
} from "../math/aes128.ts";
import { aesBlockEquality, SBOX_TYPE } from "../math/aesHelper.ts";
import {
  INVERSE_S_BOX,
  INVERSE_S_BOX_111,
  INVERSE_S_BOX_128,
  INVERSE_S_BOX_4,
  INVERSE_S_BOX_44,
  INVERSE_S_BOX_81,
  S_BOX,
  S_BOX_111,
  S_BOX_128,
  S_BOX_4,
  S_BOX_44,
  S_BOX_81,
} from "../math/aesConstants.ts";

describe("S-Box Size Test", () => {
  test("Standard", () => {
    expect(S_BOX.length).toBe(256);
  });
  test("K4", () => {
    expect(S_BOX_4.length).toBe(256);
  });
  test("K44", () => {
    expect(S_BOX_44.length).toBe(256);
  });
  test("K81", () => {
    expect(S_BOX_81.length).toBe(256);
  });
  test("K111", () => {
    expect(S_BOX_111.length).toBe(256);
  });
  test("K128", () => {
    expect(S_BOX_128.length).toBe(256);
  });
  test("Inverse Standard", () => {
    expect(INVERSE_S_BOX.length).toBe(256);
  });
  test("Inverse K4", () => {
    expect(INVERSE_S_BOX_4.length).toBe(256);
  });
  test("Inverse K44", () => {
    expect(INVERSE_S_BOX_44.length).toBe(256);
  });
  test("Inverse K81", () => {
    expect(INVERSE_S_BOX_81.length).toBe(256);
  });
  test("Inverse K111", () => {
    expect(INVERSE_S_BOX_111.length).toBe(256);
  });
  test("Inverse K128", () => {
    expect(INVERSE_S_BOX_128.length).toBe(256);
  });
});

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

  describe("Block-to-String Conversion Test", () => {
    test("Plain text", () => {
      let deepConvertedPlainTextBlocks = plainTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepConvertedPlainTextBlocks = stringToBlocks(
          blocksToString(deepConvertedPlainTextBlocks),
        );
      }
      expect(blocksToString(deepConvertedPlainTextBlocks)).toStrictEqual(
        plainTextString,
      );
    });

    test("Encrypted text", () => {
      let deepEncryptedTextBlocks = encryptedTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepEncryptedTextBlocks = stringToBlocks(
          blocksToString(deepEncryptedTextBlocks),
        );
      }
      expect(blocksToString(deepEncryptedTextBlocks)).toStrictEqual(
        blocksToString(encryptedTextBlocks),
      );
    });

    test("Decrypted text", () => {
      let deepDecryptedTextBlocks = decryptedTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepDecryptedTextBlocks = stringToBlocks(
          blocksToString(deepDecryptedTextBlocks),
        );
      }
      expect(blocksToString(deepDecryptedTextBlocks)).toStrictEqual(
        decryptedTextString,
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

  describe("Block-to-String Conversion Test", () => {
    test("Plain text", () => {
      let deepConvertedPlainTextBlocks = plainTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepConvertedPlainTextBlocks = stringToBlocks(
          blocksToString(deepConvertedPlainTextBlocks),
        );
      }
      expect(blocksToString(deepConvertedPlainTextBlocks)).toStrictEqual(
        plainTextString,
      );
    });

    test("Encrypted text", () => {
      let deepEncryptedTextBlocks = encryptedTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepEncryptedTextBlocks = stringToBlocks(
          blocksToString(deepEncryptedTextBlocks),
        );
      }
      expect(blocksToString(deepEncryptedTextBlocks)).toStrictEqual(
        blocksToString(encryptedTextBlocks),
      );
    });

    test("Decrypted text", () => {
      let deepDecryptedTextBlocks = decryptedTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepDecryptedTextBlocks = stringToBlocks(
          blocksToString(deepDecryptedTextBlocks),
        );
      }
      expect(blocksToString(deepDecryptedTextBlocks)).toStrictEqual(
        decryptedTextString,
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

  describe("Block-to-String Conversion Test", () => {
    test("Plain text", () => {
      let deepConvertedPlainTextBlocks = plainTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepConvertedPlainTextBlocks = stringToBlocks(
          blocksToString(deepConvertedPlainTextBlocks),
        );
      }
      expect(blocksToString(deepConvertedPlainTextBlocks)).toStrictEqual(
        plainTextString,
      );
    });

    test("Encrypted text", () => {
      let deepEncryptedTextBlocks = encryptedTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepEncryptedTextBlocks = stringToBlocks(
          blocksToString(deepEncryptedTextBlocks),
        );
      }
      expect(blocksToString(deepEncryptedTextBlocks)).toStrictEqual(
        blocksToString(encryptedTextBlocks),
      );
    });

    test("Decrypted text", () => {
      let deepDecryptedTextBlocks = decryptedTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepDecryptedTextBlocks = stringToBlocks(
          blocksToString(deepDecryptedTextBlocks),
        );
      }
      expect(blocksToString(deepDecryptedTextBlocks)).toStrictEqual(
        decryptedTextString,
      );
    });
  });
});

describe("K81 S-Box Test", () => {
  const sBoxMechanism = SBOX_TYPE.K81;

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

  describe("Block-to-String Conversion Test", () => {
    test("Plain text", () => {
      let deepConvertedPlainTextBlocks = plainTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepConvertedPlainTextBlocks = stringToBlocks(
          blocksToString(deepConvertedPlainTextBlocks),
        );
      }
      expect(blocksToString(deepConvertedPlainTextBlocks)).toStrictEqual(
        plainTextString,
      );
    });

    test("Encrypted text", () => {
      let deepEncryptedTextBlocks = encryptedTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepEncryptedTextBlocks = stringToBlocks(
          blocksToString(deepEncryptedTextBlocks),
        );
      }
      expect(blocksToString(deepEncryptedTextBlocks)).toStrictEqual(
        blocksToString(encryptedTextBlocks),
      );
    });

    test("Decrypted text", () => {
      let deepDecryptedTextBlocks = decryptedTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepDecryptedTextBlocks = stringToBlocks(
          blocksToString(deepDecryptedTextBlocks),
        );
      }
      expect(blocksToString(deepDecryptedTextBlocks)).toStrictEqual(
        decryptedTextString,
      );
    });
  });
});

describe("K111 S-Box Test", () => {
  const sBoxMechanism = SBOX_TYPE.K111;

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

  describe("Block-to-String Conversion Test", () => {
    test("Plain text", () => {
      let deepConvertedPlainTextBlocks = plainTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepConvertedPlainTextBlocks = stringToBlocks(
          blocksToString(deepConvertedPlainTextBlocks),
        );
      }
      expect(blocksToString(deepConvertedPlainTextBlocks)).toStrictEqual(
        plainTextString,
      );
    });

    test("Encrypted text", () => {
      let deepEncryptedTextBlocks = encryptedTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepEncryptedTextBlocks = stringToBlocks(
          blocksToString(deepEncryptedTextBlocks),
        );
      }
      expect(blocksToString(deepEncryptedTextBlocks)).toStrictEqual(
        blocksToString(encryptedTextBlocks),
      );
    });

    test("Decrypted text", () => {
      let deepDecryptedTextBlocks = decryptedTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepDecryptedTextBlocks = stringToBlocks(
          blocksToString(deepDecryptedTextBlocks),
        );
      }
      expect(blocksToString(deepDecryptedTextBlocks)).toStrictEqual(
        decryptedTextString,
      );
    });
  });
});

describe("K128 S-Box Test", () => {
  const sBoxMechanism = SBOX_TYPE.K128;

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

  // describe("Block Equality Test", () => {
  //   test("vitest built-in Uint8Array[] equality", () => {
  //     expect(plainTextBlocks).toStrictEqual(decryptedTextBlocks);
  //   });

  //   test("custom Uint8Array[] equality", () => {
  //     expect(aesBlockEquality(plainTextBlocks, decryptedTextBlocks)).toBe(true);
  //   });
  // });

  describe("Block-to-String Conversion Test", () => {
    test("Plain text", () => {
      let deepConvertedPlainTextBlocks = plainTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepConvertedPlainTextBlocks = stringToBlocks(
          blocksToString(deepConvertedPlainTextBlocks),
        );
      }
      expect(blocksToString(deepConvertedPlainTextBlocks)).toStrictEqual(
        plainTextString,
      );
    });

    test("Encrypted text", () => {
      let deepEncryptedTextBlocks = encryptedTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepEncryptedTextBlocks = stringToBlocks(
          blocksToString(deepEncryptedTextBlocks),
        );
      }
      expect(blocksToString(deepEncryptedTextBlocks)).toStrictEqual(
        blocksToString(encryptedTextBlocks),
      );
    });

    test("Decrypted text", () => {
      let deepDecryptedTextBlocks = decryptedTextBlocks;
      for (let i = 0; i < 9; i++) {
        deepDecryptedTextBlocks = stringToBlocks(
          blocksToString(deepDecryptedTextBlocks),
        );
      }
      expect(blocksToString(deepDecryptedTextBlocks)).toStrictEqual(
        decryptedTextString,
      );
    });
  });
});
