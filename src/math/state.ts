export const stringToAESBlocks = (plaintext: string): Uint8Array[] => {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(plaintext);

  const numBlocks = Math.ceil(bytes.length / 16);
  const blocks: Uint8Array[] = [];

  for (let i = 0; i < numBlocks; i++) {
    const block = new Uint8Array(16);
    block.set(bytes.slice(i * 16, i * 16 + 16));
    blocks.push(block);
  }

  return blocks;
};

export const aesBlocksToString = (blocks: Uint8Array[]): string => {
  const totalLength = blocks.length * 16;
  const combined = new Uint8Array(totalLength);

  for (let i = 0; i < blocks.length; i++) {
    combined.set(blocks[i], i * 16);
  }

  let lastNonZeroIndex = combined.length - 1;
  while (lastNonZeroIndex >= 0 && combined[lastNonZeroIndex] === 0) {
    lastNonZeroIndex--;
  }
  const trimmed = combined.slice(0, lastNonZeroIndex + 1);

  const decoder = new TextDecoder();
  return decoder.decode(trimmed);
};

export const getStateByte = (
  state: Uint8Array,
  row: number,
  col: number,
): number => {
  return state[col * 4 + row];
};

export const setStateByte = (
  state: Uint8Array,
  row: number,
  col: number,
  value: number,
): void => {
  state[col * 4 + row] = value;
};
