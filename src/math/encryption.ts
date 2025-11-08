import { subByteBox } from "./aesConstants.ts";

const _encryptionRoutine = (inputState: Uint8Array) => {
  initialRound();
  for (let i = 0; i < 9; i++) {
    mainRound(inputState);
  }
  finalRound(inputState);
};

const initialRound = () => {
  addRoundKeys();
};

const mainRound = (inputState: Uint8Array) => {
  let resultState = inputState;
  resultState = substituteBytes(inputState);
  resultState = shiftRows(resultState);
  mixColumns();
  addRoundKeys();
};

const finalRound = (inputState: Uint8Array) => {
  let resultState = inputState;
  resultState = substituteBytes(inputState);
  resultState = shiftRows(resultState);
  addRoundKeys();
};

const substituteBytes = (inputState: Uint8Array): Uint8Array => {
  const matrixElementCount = 16;
  const substitutedBytesState = new Uint8Array(matrixElementCount);
  for (let i = 0; i < matrixElementCount; i++) {
    substitutedBytesState[i] = subByteBox[inputState[i]];
  }
  return substitutedBytesState;
};

const shiftRows = (inputState: Uint8Array) => {
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

const mixColumns = () => {
  return 0;
};

const addRoundKeys = () => {
  return 0;
};
