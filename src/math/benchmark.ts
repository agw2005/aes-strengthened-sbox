import { generateAes128Key } from "./aes128.ts";
import { BLOCK_SIZE_BYTES } from "./aesConstants.ts";
import { encryptPerBlock, type SBoxType } from "./aesHelper.ts";

const INPUT_BITS = 8;
const SAC_MINIMUM_ITERATION = 50;
const BIC_SAC_MINIMUM_ITERATION = SAC_MINIMUM_ITERATION;

const benchmarkHelper = {
  parityOfBitwiseDot: (a: number, b: number): 0 | 1 => {
    let x = a & b;
    x ^= x >> 4;
    x ^= x >> 2;
    x ^= x >> 1;
    const result = (x & 1) as 0 | 1;
    return result;
  },
  popcount: (x: number): number => {
    // simple bit-count
    let cnt = 0;
    for (; x !== 0; x &= x - 1) {
      cnt++;
    }
    return cnt;
  },
};

export const benchmark = {
  nonLinearity: (sbox: number[]): number => {
    const sboxLength = 2 ** INPUT_BITS;
    const twoToNminus1 = 1 << (INPUT_BITS - 1);
    let worstNL = Number.MAX_SAFE_INTEGER;

    for (let u = 1; u < sboxLength; u++) {
      // f_u: x -> parity(u ⋅ sbox[x])
      const f = new Uint8Array(sboxLength);
      for (let x = 0; x < sboxLength; x++) {
        const y = sbox[x];
        f[x] = benchmarkHelper.parityOfBitwiseDot(u, y);
      }

      let maxAbsW = 0;
      for (let mask = 0; mask < sboxLength; mask++) {
        let sum = 0;
        for (let x = 0; x < sboxLength; x++) {
          const inDot = benchmarkHelper.parityOfBitwiseDot(mask, x);
          const exponent = f[x] ^ inDot;
          sum += exponent === 0 ? +1 : -1;
        }
        const absW = Math.abs(sum);
        if (absW > maxAbsW) maxAbsW = absW;
      }
      const nl = twoToNminus1 - (maxAbsW >>> 1);
      if (nl < worstNL) worstNL = nl;
    }

    return worstNL;
  },
  strictAvalancheCriterion: (
    sboxType: SBoxType,
    iteration: number = SAC_MINIMUM_ITERATION,
  ): number => {
    const BITS_PER_BLOCK = BLOCK_SIZE_BYTES * 8;
    let totalOutputBits = 0;
    let totalFlippedBits = 0;
    const generatedAESKey: Uint8Array = generateAes128Key();

    for (let t = 0; t < iteration; t++) {
      const plainText = crypto.getRandomValues(new Uint8Array(BITS_PER_BLOCK));
      const baseCipherText = encryptPerBlock(
        plainText,
        generatedAESKey,
        sboxType,
      );

      for (let bitIndex = 0; bitIndex < BITS_PER_BLOCK; bitIndex++) {
        const modified = new Uint8Array(plainText);
        const bytePos = Math.floor(bitIndex / INPUT_BITS);
        const bitInByte = bitIndex % INPUT_BITS;
        modified[bytePos] ^= 1 << bitInByte;
        const cipher2 = encryptPerBlock(modified, generatedAESKey, sboxType);
        let diffCount = 0;
        for (let i = 0; i < BLOCK_SIZE_BYTES; i++) {
          const x = baseCipherText[i] ^ cipher2[i];
          diffCount += benchmarkHelper.popcount(x);
        }

        totalFlippedBits += diffCount;
        totalOutputBits += BITS_PER_BLOCK;
      }
    }
    const averageFlipRate = totalFlippedBits / totalOutputBits;

    return averageFlipRate;
  },
  bitIndependenceCriterionNonLinearity: () => {},
  bitIndependenceCriterionStrictAvalancheCriterion: (
    sboxType: SBoxType,
    iteration: number = BIC_SAC_MINIMUM_ITERATION,
  ): number => {
    const BITS = BLOCK_SIZE_BYTES * 8;
    const key = generateAes128Key();
    type CorrAcc = {
      sumA: number;
      sumB: number;
      sumA2: number;
      sumB2: number;
      sumAB: number;
      count: number;
    };
    const accumulators: Record<string, CorrAcc> = {};
    for (let t = 0; t < iteration; t++) {
      const plain = crypto.getRandomValues(new Uint8Array(BLOCK_SIZE_BYTES));
      const base = encryptPerBlock(plain, key, sboxType);
      for (let i = 0; i < BITS; i++) {
        const mod = new Uint8Array(plain);
        const bytePos = Math.floor(i / 8);
        const bitInByte = i % 8;
        mod[bytePos] ^= 1 << bitInByte;
        const c2 = encryptPerBlock(mod, key, sboxType);
        const diff = base.map((b, idx) => b ^ c2[idx]);
        for (let j = 0; j < BITS; j++) {
          const bitJ = (diff[Math.floor(j / 8)] >>> j % 8) & 1;
          for (let k = j + 1; k < BITS; k++) {
            const bitK = (diff[Math.floor(k / 8)] >>> k % 8) & 1;
            const keyName = `${i}_${j}_${k}`;
            if (!accumulators[keyName]) {
              accumulators[keyName] = {
                sumA: 0,
                sumB: 0,
                sumA2: 0,
                sumB2: 0,
                sumAB: 0,
                count: 0,
              };
            }
            const acc = accumulators[keyName];
            acc.count++;
            acc.sumA += bitJ;
            acc.sumB += bitK;
            acc.sumA2 += bitJ * bitJ;
            acc.sumB2 += bitK * bitK;
            acc.sumAB += bitJ * bitK;
          }
        }
      }
    }
    let maxAbsCorr = 0;
    for (const acc of Object.values(accumulators)) {
      const { sumA, sumB, sumA2, sumB2, sumAB, count } = acc;
      const numerator = count * sumAB - sumA * sumB;
      const denomPartA = count * sumA2 - sumA * sumA;
      const denomPartB = count * sumB2 - sumB * sumB;
      const denom = Math.sqrt(denomPartA * denomPartB);

      const corr = denom === 0 ? 0 : numerator / denom;
      const absCorr = Math.abs(corr);
      if (absCorr > maxAbsCorr) maxAbsCorr = absCorr;
    }

    return maxAbsCorr;
  },
  linearApproximationProbability: () => {},
  differentialApproximationProbability: () => {},
  differentialUniformity: () => {},
  algebraicDegree: () => {},
  transparencyOrder: () => {},
  correlationImmunity: () => {},
};

// const startTime = new Date().getTime();
// console.log(`Result:
//   ${benchmark.bitIndependenceCriterionStrictAvalancheCriterion(
//     SBOX_TYPE.Original,
//     BIC_SAC_MINIMUM_ITERATION
//   )}`);
// const endTime = new Date().getTime();
// console.log(`Epoch: ${(endTime - startTime) / 1000} seconds`);
