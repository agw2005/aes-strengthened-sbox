const INPUT_BITS = 8;

const benchmarkHelper = {
  parityOfBitwiseDot: (a: number, b: number): 0 | 1 => {
    let x = a & b;
    x ^= x >> 4;
    x ^= x >> 2;
    x ^= x >> 1;
    const result = (x & 1) as 0 | 1;
    return result;
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
  strictAvalancheCriterion: () => {},
  bitIndependenceCriterionNonLinearity: () => {},
  bitIndependenceCriterionStrictAvalancheCriterion: () => {},
  linearApproximationProbability: () => {},
  differentialApproximationProbability: () => {},
  differentialUniformity: () => {},
  algebraicDegree: () => {},
  transparencyOrder: () => {},
  correlationImmunity: () => {},
};
