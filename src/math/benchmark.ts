import { generateAes128Key } from "./aes128";
import { BLOCK_SIZE_BYTES } from "./aesConstants";
import { encryptPerBlock, type SBoxType } from "./aesHelper";

const INPUT_BITS = 8;
const SAC_MINIMUM_ITERATION = 1000;

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
    iteration: number = SAC_MINIMUM_ITERATION
  ) => {
    const BITS_PER_BLOCK = BLOCK_SIZE_BYTES * 8;
    let totalOutputBits = 0;
    let totalFlippedBits = 0;
    const generatedAESKey: Uint8Array = generateAes128Key();

    for (let t = 0; t < iteration; t++) {
      const plainText = crypto.getRandomValues(new Uint8Array(BITS_PER_BLOCK));
      const baseCipherText = encryptPerBlock(
        plainText,
        generatedAESKey,
        sboxType
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
  bitIndependenceCriterionStrictAvalancheCriterion: () => {},
  linearApproximationProbability: () => {},
  differentialApproximationProbability: () => {},
  differentialUniformity: () => {},
  algebraicDegree: () => {},
  transparencyOrder: () => {},
  correlationImmunity: () => {},
};
