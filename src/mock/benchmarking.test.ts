import { assert, describe, test } from "vitest";
import { benchmark } from "../math/benchmark.ts";
import {
  S_BOX,
  S_BOX_111,
  S_BOX_128,
  S_BOX_4,
  S_BOX_44,
  S_BOX_81,
} from "../math/aesConstants";
import { SBOX_TYPE } from "../math/aesHelper";

const ERROR = 0.05;

interface NotInPaperExpectedResult {
  name: string;
  sbox: number[];
  DU: number;
  AD: number;
  TO: number;
  CI: number;
}

interface InPaperExpectedResult {
  name: string;
  sbox: number[];
  NL: number;
  SAC: number;
  BIC_NL: number;
  BIC_SAC: number;
  LAP: number;
  DAP: number;
}

const expectedNotInPaperResults: NotInPaperExpectedResult = {
  name: SBOX_TYPE.Original,
  sbox: S_BOX,
  DU: 4, // Daemen, J., & Rijmen, V. (2002). The Design of Rijndael. Springer. (Section 3.4)
  AD: 7, // Nyberg, K. (1994). "Differentially uniform mappings for cryptography." Advances in Cryptology, EUROCRYPT '93.
  TO: 7.86, // Prouff, E. (2005). "DPA Attacks and S-Boxes." Fast Software Encryption (FSE 2005).
  CI: 0, // Siegenthaler, T. (1984). "Correlation-immunity of nonlinear combining functions for cryptographic applications." IEEE Transactions on Information Theory.
};

const expectedInPaperResults: InPaperExpectedResult[] = [
  {
    name: SBOX_TYPE.Original,
    sbox: S_BOX,
    NL: 112, // https://www.spiedigitallibrary.org/conference-proceedings-of-spie/13653/136530Z/Research-on-dynamic-S-box-image-encryption-algorithm-based-on/10.1117/12.3071253.short
    SAC: 0.504, // Webster, A. F., & Tavares, S. E. (1985). "On the design of S-boxes." Advances in Cryptology, CRYPTO '85.
    BIC_NL: 112, // Adams, C., & Tavares, S. (1990). "The Use of S-boxes in Cryptosystem Design."
    BIC_SAC: 0.504, // https://www.sciencedirect.com/science/article/pii/S0898122112004166
    LAP: 0.0625, // https://pmc.ncbi.nlm.nih.gov/articles/PMC7660566/
    DAP: 0.01563, // Hussain et al., 2018
  },
  {
    name: SBOX_TYPE.K4,
    sbox: S_BOX_4,
    NL: 112,
    SAC: 0.50781,
    BIC_NL: 112,
    BIC_SAC: 0.50572,
    LAP: 0.0625,
    DAP: 0.01563,
  },
  {
    name: SBOX_TYPE.K44,
    sbox: S_BOX_44,
    NL: 112,
    SAC: 0.50073,
    BIC_NL: 112,
    BIC_SAC: 0.50237,
    LAP: 0.0625,
    DAP: 0.01563,
  },
  {
    name: SBOX_TYPE.K81,
    sbox: S_BOX_81,
    NL: 112,
    SAC: 0.50439,
    BIC_NL: 112,
    BIC_SAC: 0.50098,
    LAP: 0.0625,
    DAP: 0.01563,
  },
  {
    name: SBOX_TYPE.K111,
    sbox: S_BOX_111,
    NL: 112,
    SAC: 0.50415,
    BIC_NL: 112,
    BIC_SAC: 0.49902,
    LAP: 0.0625,
    DAP: 0.01563,
  },
  {
    name: SBOX_TYPE.K128,
    sbox: S_BOX_128,
    NL: 112,
    SAC: 0.49389,
    BIC_NL: 112,
    BIC_SAC: 0.50572,
    LAP: 0.0625,
    DAP: 0.01563,
  },
];

describe("Non-linearity (NL)", () => {
  expectedInPaperResults.forEach((expectedResult) => {
    const resultNL = benchmark.nonLinearity(expectedResult.sbox);
    const expectedNL = expectedResult.NL;
    const error = ((resultNL - expectedNL) / expectedNL) * 100;
    test(`${expectedResult.name} NL : ${resultNL} (Err : ${error})`, () => {
      assert(error <= ERROR);
    });
  });
});

describe("Strict Avalanche Criterion (SAC)", () => {
  expectedInPaperResults.forEach((expectedResult) => {
    test(`${expectedResult.name} SAC`, () => {
      //   const resultNL = benchmark.nonLinearity(expectedResult.sbox);
      //   const expectedNL = expectedResult.NL;
      //   const error = ((resultNL - expectedNL) / expectedNL) * 100;
      //   console.log(`${expectedResult.name} NL : ${resultNL}`);
      //   console.log(`Error : ${error}`);
      //   assert(error <= ERROR);
    });
  });
});

describe("Bit Independence Criterion Non-linearity (BIC-NL)", () => {
  expectedInPaperResults.forEach((expectedResult) => {
    test(`${expectedResult.name} BIC-NL`, () => {
      //   const resultNL = benchmark.nonLinearity(expectedResult.sbox);
      //   const expectedNL = expectedResult.NL;
      //   const error = ((resultNL - expectedNL) / expectedNL) * 100;
      //   console.log(`${expectedResult.name} NL : ${resultNL}`);
      //   console.log(`Error : ${error}`);
      //   assert(error <= ERROR);
    });
  });
});

describe("Bit Independence Criterion Strict Avalanche Criterion (BIC-SAC)", () => {
  expectedInPaperResults.forEach((expectedResult) => {
    test(`${expectedResult.name} BIC-SAC`, () => {
      //   const resultNL = benchmark.nonLinearity(expectedResult.sbox);
      //   const expectedNL = expectedResult.NL;
      //   const error = ((resultNL - expectedNL) / expectedNL) * 100;
      //   console.log(`${expectedResult.name} NL : ${resultNL}`);
      //   console.log(`Error : ${error}`);
      //   assert(error <= ERROR);
    });
  });
});

describe("Linear Approximation Probability (LAP)", () => {
  expectedInPaperResults.forEach((expectedResult) => {
    test(`${expectedResult.name} LAP`, () => {
      //   const resultNL = benchmark.nonLinearity(expectedResult.sbox);
      //   const expectedNL = expectedResult.NL;
      //   const error = ((resultNL - expectedNL) / expectedNL) * 100;
      //   console.log(`${expectedResult.name} NL : ${resultNL}`);
      //   console.log(`Error : ${error}`);
      //   assert(error <= ERROR);
    });
  });
});

describe("Differential Approximation Probability (DAP)", () => {
  expectedInPaperResults.forEach((expectedResult) => {
    test(`${expectedResult.name} DAP`, () => {
      //   const resultNL = benchmark.nonLinearity(expectedResult.sbox);
      //   const expectedNL = expectedResult.NL;
      //   const error = ((resultNL - expectedNL) / expectedNL) * 100;
      //   console.log(`${expectedResult.name} NL : ${resultNL}`);
      //   console.log(`Error : ${error}`);
      //   assert(error <= ERROR);
    });
  });
});

describe("Differential Uniformity (DU)", () => {
  expectedInPaperResults.forEach((expectedResult) => {
    test(`${expectedResult.name} DU`, () => {
      //   const resultNL = benchmark.nonLinearity(expectedResult.sbox);
      //   const expectedNL = expectedResult.NL;
      //   const error = ((resultNL - expectedNL) / expectedNL) * 100;
      //   console.log(`${expectedResult.name} NL : ${resultNL}`);
      //   console.log(`Error : ${error}`);
      //   assert(error <= ERROR);
    });
  });
});

describe("Algebraic Degree (AD)", () => {
  expectedInPaperResults.forEach((expectedResult) => {
    test(`${expectedResult.name} AD`, () => {
      //   const resultNL = benchmark.nonLinearity(expectedResult.sbox);
      //   const expectedNL = expectedResult.NL;
      //   const error = ((resultNL - expectedNL) / expectedNL) * 100;
      //   console.log(`${expectedResult.name} NL : ${resultNL}`);
      //   console.log(`Error : ${error}`);
      //   assert(error <= ERROR);
    });
  });
});

describe("Transparency Order (TO)", () => {
  expectedInPaperResults.forEach((expectedResult) => {
    test(`${expectedResult.name} TO`, () => {
      //   const resultNL = benchmark.nonLinearity(expectedResult.sbox);
      //   const expectedNL = expectedResult.NL;
      //   const error = ((resultNL - expectedNL) / expectedNL) * 100;
      //   console.log(`${expectedResult.name} NL : ${resultNL}`);
      //   console.log(`Error : ${error}`);
      //   assert(error <= ERROR);
    });
  });
});

describe("Correlation Immunity (CI)", () => {
  expectedInPaperResults.forEach((expectedResult) => {
    test(`${expectedResult.name} CI`, () => {
      //   const resultNL = benchmark.nonLinearity(expectedResult.sbox);
      //   const expectedNL = expectedResult.NL;
      //   const error = ((resultNL - expectedNL) / expectedNL) * 100;
      //   console.log(`${expectedResult.name} NL : ${resultNL}`);
      //   console.log(`Error : ${error}`);
      //   assert(error <= ERROR);
    });
  });
});
