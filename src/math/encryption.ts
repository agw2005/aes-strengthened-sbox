import { subByteBox } from "./aesConstants.ts";
import { expandKey } from "./expansion.ts";
import { mixSingleColumn } from "./helper.ts";
import { getStateByte, setStateByte } from "./state.ts";

export const encryptAes = (
  inputState: Uint8Array,
  aesKey: Uint8Array,
): Uint8Array => {
  const expandedKey = expandKey(aesKey);

  let resultState = addRoundKeys(inputState, expandedKey.slice(0, 16));

  for (let round = 1; round <= 9; round++) {
    const roundKey = expandedKey.slice(round * 16, round * 16 + 16);
    resultState = substituteBytes(resultState);
    resultState = shiftRows(resultState);
    resultState = mixColumns(resultState);
    resultState = addRoundKeys(resultState, roundKey);
  }

  const finalRoundKey = expandedKey.slice(160, 176);
  resultState = substituteBytes(resultState);
  resultState = shiftRows(resultState);
  resultState = addRoundKeys(resultState, finalRoundKey);

  return resultState;
};

const substituteBytes = (inputState: Uint8Array): Uint8Array => {
  const matrixElementCount = 16;
  const substitutedBytesState = new Uint8Array(matrixElementCount);
  for (let i = 0; i < matrixElementCount; i++) {
    substitutedBytesState[i] = subByteBox[inputState[i]];
  }
  return substitutedBytesState;
};

const shiftRows = (inputState: Uint8Array): Uint8Array => {
  const matrixRowCount = 4;
  const matrixColumnCount = 4;
  const matrixElementCount = matrixRowCount * matrixColumnCount;
  const shiftedRowsState = new Uint8Array(matrixElementCount);
  for (let rowIndex = 0; rowIndex < matrixRowCount; rowIndex++) {
    for (let columnIndex = 0; columnIndex < matrixColumnCount; columnIndex++) {
      const shiftedCol = (columnIndex + rowIndex) % 4;
      const value = getStateByte(inputState, rowIndex, shiftedCol);
      setStateByte(shiftedRowsState, rowIndex, columnIndex, value);
    }
  }
  return shiftedRowsState;
};

const mixColumns = (inputState: Uint8Array): Uint8Array => {
  const matrixRowCount = 4;
  const matrixColumnCount = 4;
  const matrixElementCount = matrixRowCount * matrixColumnCount;
  const mixedColumnsState = new Uint8Array(matrixElementCount);
  for (let columnIndex = 0; columnIndex < matrixColumnCount; columnIndex++) {
    const column = inputState.slice(
      columnIndex * matrixColumnCount,
      columnIndex * matrixColumnCount + matrixColumnCount,
    );
    const mixedColumn = mixSingleColumn(column);
    mixedColumnsState.set(mixedColumn, columnIndex * matrixColumnCount);
  }
  return mixedColumnsState;
};

const addRoundKeys = (
  inputState: Uint8Array,
  roundKey: Uint8Array,
): Uint8Array => {
  const XORedState = new Uint8Array(inputState.length);
  for (let i = 0; i < inputState.length; i++) {
    XORedState[i] = inputState[i] ^ roundKey[i];
  }
  return XORedState;
};
