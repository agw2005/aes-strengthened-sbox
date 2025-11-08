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
