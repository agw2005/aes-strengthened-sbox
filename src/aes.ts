export const generateBigNumber = (bit: number): bigint => {
  const min = 100;
  const max = 2 ** bit;
  const randomMultiplier = Number(Math.random());
  const range = Number(max - min + 1);
  const randomBigNumber = BigInt(
    Math.floor(randomMultiplier * range) + Number(min),
  );
  return randomBigNumber;
};
