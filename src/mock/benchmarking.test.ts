import { afterAll, describe, test } from "vitest";
import { benchmark } from "../math/benchmark.ts";
import {
  S_BOX,
  S_BOX_111,
  S_BOX_128,
  S_BOX_4,
  S_BOX_44,
  S_BOX_81,
} from "../math/aesConstants.ts";
import { SBOX_TYPE, type SBoxType } from "../math/aesHelper.ts";

interface ResultFormat {
  Subject: string;
  Result: number;
  Expected: number;
  Difference: number;
  Verdict: string;
}

/*
interface NotInPaperExpectedResult {
  name: SBoxType;
  sbox: number[];
  DU: number;
  AD: number;
  TO: number;
  CI: number;
}
  */

interface InPaperExpectedResult {
  name: SBoxType;
  sbox: number[];
  NL: number;
  SAC: number;
  BIC_NL: number;
  BIC_SAC: number;
  LAP: number;
  DAP: number;
}

/*
const expectedNotInPaperResults: NotInPaperExpectedResult = {
  name: SBOX_TYPE.Original,
  sbox: S_BOX,
  DU: 4, // Daemen, J., & Rijmen, V. (2002). The Design of Rijndael. Springer. (Section 3.4)
  AD: 7, // Nyberg, K. (1994). "Differentially uniform mappings for cryptography." Advances in Cryptology, EUROCRYPT '93.
  TO: 7.86, // Prouff, E. (2005). "DPA Attacks and S-Boxes." Fast Software Encryption (FSE 2005).
  CI: 0, // Siegenthaler, T. (1984). "Correlation-immunity of nonlinear combining functions for cryptographic applications." IEEE Transactions on Information Theory.
};
*/

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
]; // 5 items (max index: 4)

const analysis: ResultFormat[] = [];

const generateVerdict = (
  expectedValue: number,
  resultValue: number,
): string => {
  return expectedValue >= resultValue
    ? "Expected value is bigger"
    : "Expected value is smaller";
};

describe.concurrent("Benchmarkings", () => {
  describe("Non-linearity (NL)", () => {
    test.concurrent(
      `${expectedInPaperResults[0].name} NL`,
      { timeout: 0 },
      () => {
        const resultNL = benchmark.nonLinearity(expectedInPaperResults[0].sbox);
        const expectedNL = expectedInPaperResults[0].NL;
        const diff = expectedNL - resultNL;
        const verdict = generateVerdict(expectedNL, resultNL);
        const logAnalysis = {
          Subject: `${expectedInPaperResults[0].name} NL`,
          Result: resultNL,
          Expected: expectedNL,
          Difference: diff,
          Verdict: verdict,
        };
        analysis.push(logAnalysis);
      },
    );
    test.concurrent(
      `${expectedInPaperResults[1].name} NL`,
      { timeout: 0 },
      () => {
        const resultNL = benchmark.nonLinearity(expectedInPaperResults[1].sbox);
        const expectedNL = expectedInPaperResults[1].NL;
        const diff = expectedNL - resultNL;
        const verdict = generateVerdict(expectedNL, resultNL);
        const logAnalysis = {
          Subject: `${expectedInPaperResults[1].name} NL`,
          Result: resultNL,
          Expected: expectedNL,
          Difference: diff,
          Verdict: verdict,
        };
        analysis.push(logAnalysis);
      },
    );
    test.concurrent(
      `${expectedInPaperResults[2].name} NL`,
      { timeout: 0 },
      () => {
        const resultNL = benchmark.nonLinearity(expectedInPaperResults[2].sbox);
        const expectedNL = expectedInPaperResults[2].NL;
        const diff = expectedNL - resultNL;
        const verdict = generateVerdict(expectedNL, resultNL);
        const logAnalysis = {
          Subject: `${expectedInPaperResults[2].name} NL`,
          Result: resultNL,
          Expected: expectedNL,
          Difference: diff,
          Verdict: verdict,
        };
        analysis.push(logAnalysis);
      },
    );
    test.concurrent(
      `${expectedInPaperResults[3].name} NL`,
      { timeout: 0 },
      () => {
        const resultNL = benchmark.nonLinearity(expectedInPaperResults[3].sbox);
        const expectedNL = expectedInPaperResults[3].NL;
        const diff = expectedNL - resultNL;
        const verdict = generateVerdict(expectedNL, resultNL);
        const logAnalysis = {
          Subject: `${expectedInPaperResults[3].name} NL`,
          Result: resultNL,
          Expected: expectedNL,
          Difference: diff,
          Verdict: verdict,
        };
        analysis.push(logAnalysis);
      },
    );
    test.concurrent(
      `${expectedInPaperResults[4].name} NL`,
      { timeout: 0 },
      () => {
        const resultNL = benchmark.nonLinearity(expectedInPaperResults[4].sbox);
        const expectedNL = expectedInPaperResults[4].NL;
        const diff = expectedNL - resultNL;
        const verdict = generateVerdict(expectedNL, resultNL);
        const logAnalysis = {
          Subject: `${expectedInPaperResults[4].name} NL`,
          Result: resultNL,
          Expected: expectedNL,
          Difference: diff,
          Verdict: verdict,
        };
        analysis.push(logAnalysis);
      },
    );
  });

  describe("Strict Avalanche Criterion (SAC)", () => {
    test.concurrent(
      `${expectedInPaperResults[0].name} SAC`,
      { timeout: 0 },
      () => {
        const resultSAC = benchmark.strictAvalancheCriterion(
          expectedInPaperResults[0].name,
        );
        const expectedSAC = expectedInPaperResults[0].SAC;
        const diff = expectedSAC - resultSAC;
        const verdict = generateVerdict(expectedSAC, resultSAC);
        const logAnalysis = {
          Subject: `${expectedInPaperResults[0].name} SAC`,
          Result: resultSAC,
          Expected: expectedSAC,
          Difference: diff,
          Verdict: verdict,
        };
        analysis.push(logAnalysis);
      },
    );
    test.concurrent(
      `${expectedInPaperResults[1].name} SAC`,
      { timeout: 0 },
      () => {
        const resultSAC = benchmark.strictAvalancheCriterion(
          expectedInPaperResults[1].name,
        );
        const expectedSAC = expectedInPaperResults[1].SAC;
        const diff = expectedSAC - resultSAC;
        const verdict = generateVerdict(expectedSAC, resultSAC);
        const logAnalysis = {
          Subject: `${expectedInPaperResults[1].name} SAC`,
          Result: resultSAC,
          Expected: expectedSAC,
          Difference: diff,
          Verdict: verdict,
        };
        analysis.push(logAnalysis);
      },
    );
    test.concurrent(
      `${expectedInPaperResults[2].name} SAC`,
      { timeout: 0 },
      () => {
        const resultSAC = benchmark.strictAvalancheCriterion(
          expectedInPaperResults[2].name,
        );
        const expectedSAC = expectedInPaperResults[2].SAC;
        const diff = expectedSAC - resultSAC;
        const verdict = generateVerdict(expectedSAC, resultSAC);
        const logAnalysis = {
          Subject: `${expectedInPaperResults[2].name} SAC`,
          Result: resultSAC,
          Expected: expectedSAC,
          Difference: diff,
          Verdict: verdict,
        };
        analysis.push(logAnalysis);
      },
    );
    test.concurrent(
      `${expectedInPaperResults[3].name} SAC`,
      { timeout: 0 },
      () => {
        const resultSAC = benchmark.strictAvalancheCriterion(
          expectedInPaperResults[3].name,
        );
        const expectedSAC = expectedInPaperResults[3].SAC;
        const diff = expectedSAC - resultSAC;
        const verdict = generateVerdict(expectedSAC, resultSAC);
        const logAnalysis = {
          Subject: `${expectedInPaperResults[3].name} SAC`,
          Result: resultSAC,
          Expected: expectedSAC,
          Difference: diff,
          Verdict: verdict,
        };
        analysis.push(logAnalysis);
      },
    );
    test.concurrent(
      `${expectedInPaperResults[4].name} SAC`,
      { timeout: 0 },
      () => {
        const resultSAC = benchmark.strictAvalancheCriterion(
          expectedInPaperResults[4].name,
        );
        const expectedSAC = expectedInPaperResults[4].SAC;
        const diff = expectedSAC - resultSAC;
        const verdict = generateVerdict(expectedSAC, resultSAC);
        const logAnalysis = {
          Subject: `${expectedInPaperResults[4].name} SAC`,
          Result: resultSAC,
          Expected: expectedSAC,
          Difference: diff,
          Verdict: verdict,
        };
        analysis.push(logAnalysis);
      },
    );
  });

  describe("Bit Independence Criterion Strict Avalanche Criterion (BIC-SAC)", () => {
    test.concurrent(
      `${expectedInPaperResults[0].name} BIC-SAC`,
      { timeout: 0 },
      () => {
        const resultBICSAC = benchmark
          .bitIndependenceCriterionStrictAvalancheCriterion(
            expectedInPaperResults[0].name,
          );
        const expectedBICSAC = expectedInPaperResults[0].BIC_SAC;
        const diff = expectedBICSAC - resultBICSAC;
        const verdict = generateVerdict(expectedBICSAC, resultBICSAC);
        const logAnalysis = {
          Subject: `${expectedInPaperResults[0].name} BIC-SAC`,
          Result: resultBICSAC,
          Expected: expectedBICSAC,
          Difference: diff,
          Verdict: verdict,
        };
        analysis.push(logAnalysis);
      },
    );
    test.concurrent(
      `${expectedInPaperResults[1].name} BIC-SAC`,
      { timeout: 0 },
      () => {
        const resultBICSAC = benchmark
          .bitIndependenceCriterionStrictAvalancheCriterion(
            expectedInPaperResults[1].name,
          );
        const expectedBICSAC = expectedInPaperResults[1].BIC_SAC;
        const diff = expectedBICSAC - resultBICSAC;
        const verdict = generateVerdict(expectedBICSAC, resultBICSAC);
        const logAnalysis = {
          Subject: `${expectedInPaperResults[1].name} BIC-SAC`,
          Result: resultBICSAC,
          Expected: expectedBICSAC,
          Difference: diff,
          Verdict: verdict,
        };
        analysis.push(logAnalysis);
      },
    );
    test.concurrent(
      `${expectedInPaperResults[2].name} BIC-SAC`,
      { timeout: 0 },
      () => {
        const resultBICSAC = benchmark
          .bitIndependenceCriterionStrictAvalancheCriterion(
            expectedInPaperResults[2].name,
          );
        const expectedBICSAC = expectedInPaperResults[2].BIC_SAC;
        const diff = expectedBICSAC - resultBICSAC;
        const verdict = generateVerdict(expectedBICSAC, resultBICSAC);
        const logAnalysis = {
          Subject: `${expectedInPaperResults[2].name} BIC-SAC`,
          Result: resultBICSAC,
          Expected: expectedBICSAC,
          Difference: diff,
          Verdict: verdict,
        };
        analysis.push(logAnalysis);
      },
    );
    test.concurrent(
      `${expectedInPaperResults[3].name} BIC-SAC`,
      { timeout: 0 },
      () => {
        const resultBICSAC = benchmark
          .bitIndependenceCriterionStrictAvalancheCriterion(
            expectedInPaperResults[3].name,
          );
        const expectedBICSAC = expectedInPaperResults[3].BIC_SAC;
        const diff = expectedBICSAC - resultBICSAC;
        const verdict = generateVerdict(expectedBICSAC, resultBICSAC);
        const logAnalysis = {
          Subject: `${expectedInPaperResults[3].name} BIC-SAC`,
          Result: resultBICSAC,
          Expected: expectedBICSAC,
          Difference: diff,
          Verdict: verdict,
        };
        analysis.push(logAnalysis);
      },
    );
    test.concurrent(
      `${expectedInPaperResults[4].name} BIC-SAC`,
      { timeout: 0 },
      () => {
        const resultBICSAC = benchmark
          .bitIndependenceCriterionStrictAvalancheCriterion(
            expectedInPaperResults[4].name,
          );
        const expectedBICSAC = expectedInPaperResults[4].BIC_SAC;
        const diff = expectedBICSAC - resultBICSAC;
        const verdict = generateVerdict(expectedBICSAC, resultBICSAC);
        const logAnalysis = {
          Subject: `${expectedInPaperResults[4].name} BIC-SAC`,
          Result: resultBICSAC,
          Expected: expectedBICSAC,
          Difference: diff,
          Verdict: verdict,
        };
        analysis.push(logAnalysis);
      },
    );
  });
});

// describe("Bit Independence Criterion Non-linearity (BIC-NL)", () => {
//   expectedInPaperResults.forEach((expectedResult) => {
//     test(`${expectedResult.name} BIC-NL`, () => {
//       //   const resultNL = benchmark.nonLinearity(expectedResult.sbox);
//       //   const expectedNL = expectedResult.NL;
//       //   const error = ((resultNL - expectedNL) / expectedNL) * 100;
//       //   console.log(`${expectedResult.name} NL : ${resultNL}`);
//       //   console.log(`Error : ${error}`);
//       //   assert(error <= ERROR);
//     });
//   });
// });

// describe("Linear Approximation Probability (LAP)", () => {
//   expectedInPaperResults.forEach((expectedResult) => {
//     test(`${expectedResult.name} LAP`, () => {
//       //   const resultNL = benchmark.nonLinearity(expectedResult.sbox);
//       //   const expectedNL = expectedResult.NL;
//       //   const error = ((resultNL - expectedNL) / expectedNL) * 100;
//       //   console.log(`${expectedResult.name} NL : ${resultNL}`);
//       //   console.log(`Error : ${error}`);
//       //   assert(error <= ERROR);
//     });
//   });
// });

// describe("Differential Approximation Probability (DAP)", () => {
//   expectedInPaperResults.forEach((expectedResult) => {
//     test(`${expectedResult.name} DAP`, () => {
//       //   const resultNL = benchmark.nonLinearity(expectedResult.sbox);
//       //   const expectedNL = expectedResult.NL;
//       //   const error = ((resultNL - expectedNL) / expectedNL) * 100;
//       //   console.log(`${expectedResult.name} NL : ${resultNL}`);
//       //   console.log(`Error : ${error}`);
//       //   assert(error <= ERROR);
//     });
//   });
// });

// describe("Differential Uniformity (DU)", () => {
//   expectedInPaperResults.forEach((expectedResult) => {
//     test(`${expectedResult.name} DU`, () => {
//       //   const resultNL = benchmark.nonLinearity(expectedResult.sbox);
//       //   const expectedNL = expectedResult.NL;
//       //   const error = ((resultNL - expectedNL) / expectedNL) * 100;
//       //   console.log(`${expectedResult.name} NL : ${resultNL}`);
//       //   console.log(`Error : ${error}`);
//       //   assert(error <= ERROR);
//     });
//   });
// });

// describe("Algebraic Degree (AD)", () => {
//   expectedInPaperResults.forEach((expectedResult) => {
//     test(`${expectedResult.name} AD`, () => {
//       //   const resultNL = benchmark.nonLinearity(expectedResult.sbox);
//       //   const expectedNL = expectedResult.NL;
//       //   const error = ((resultNL - expectedNL) / expectedNL) * 100;
//       //   console.log(`${expectedResult.name} NL : ${resultNL}`);
//       //   console.log(`Error : ${error}`);
//       //   assert(error <= ERROR);
//     });
//   });
// });

// describe("Transparency Order (TO)", () => {
//   expectedInPaperResults.forEach((expectedResult) => {
//     test(`${expectedResult.name} TO`, () => {
//       //   const resultNL = benchmark.nonLinearity(expectedResult.sbox);
//       //   const expectedNL = expectedResult.NL;
//       //   const error = ((resultNL - expectedNL) / expectedNL) * 100;
//       //   console.log(`${expectedResult.name} NL : ${resultNL}`);
//       //   console.log(`Error : ${error}`);
//       //   assert(error <= ERROR);
//     });
//   });
// });

// describe("Correlation Immunity (CI)", () => {
//   expectedInPaperResults.forEach((expectedResult) => {
//     test(`${expectedResult.name} CI`, () => {
//       //   const resultNL = benchmark.nonLinearity(expectedResult.sbox);
//       //   const expectedNL = expectedResult.NL;
//       //   const error = ((resultNL - expectedNL) / expectedNL) * 100;
//       //   console.log(`${expectedResult.name} NL : ${resultNL}`);
//       //   console.log(`Error : ${error}`);
//       //   assert(error <= ERROR);
//     });
//   });
// });

afterAll(async () => {
  await analysis.sort();
  await console.table(analysis);
});
