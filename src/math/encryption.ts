import { subByteBox } from "./aesConstants.ts";
import { mixSingleColumn } from "./helper.ts";

const _encryptionRoutine = (inputState: Uint8Array, roundKey: Uint8Array) => {
  initialRound(inputState, roundKey);
  for (let i = 0; i < 9; i++) {
    mainRound(inputState, roundKey);
  }
  finalRound(inputState, roundKey);
};

const initialRound = (inputState: Uint8Array, roundKey: Uint8Array) => {
  addRoundKeys(inputState, roundKey);
};

const mainRound = (inputState: Uint8Array, roundKey: Uint8Array) => {
  let resultState = inputState;
  resultState = substituteBytes(inputState);
  resultState = shiftRows(resultState);
  resultState = mixColumns(resultState);
  addRoundKeys(inputState, roundKey);
};

const finalRound = (inputState: Uint8Array, roundKey: Uint8Array) => {
  let resultState = inputState;
  resultState = substituteBytes(inputState);
  resultState = shiftRows(resultState);
  addRoundKeys(inputState, roundKey);
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
      shiftedRowsState[rowIndex + matrixColumnCount * columnIndex] = inputState[
        rowIndex +
        matrixRowCount * ((columnIndex + rowIndex) % matrixColumnCount)
      ];
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
