import React, { useState } from "react";
import Header from "./components/Header.tsx";
import {
  blocksToString,
  decryptBlock,
  encryptBlock,
  generateAes128Key,
  stringToBlocks,
} from "./math/aes128.ts";
import {
  getNthByteFromHexKey,
  hexadecimalToKey,
  hexBytesToStringHexBytes,
  keyToHexadecimal,
} from "./helper/hex.ts";
import { AES_KEY_SIZE_BYTES } from "./math/aesConstants.ts";
import { customLogger } from "./helper/log.ts";

function App() {
  const [aesKey, setAesKey] = useState<Uint8Array>();
  const [aesKeyHex, setAesKeyHex] = useState<string>("");
  const [plainText, setPlainText] = useState<string>("");
  const [aesKeyHexInputBytes, setAesKeyHexInputBytes] = useState<string[]>(
    Array(16).fill(""),
  );

  const [encryptedPlainText, setEncryptedPlainText] = useState<string>("");
  const [encryptedPlainTextInput, setEncryptedPlainTextInput] = useState<
    string
  >("");
  const [decryptedText, setDecryptedText] = useState<string>("");
  const [keyNotGeneratedYetError, setKeyNotGeneratedYetError] = useState<
    string
  >("");

  const aes = {
    handleGenerateAesKey: () => {
      const generatedKey = generateAes128Key();
      customLogger(`Generated key : ${generatedKey}`);
      const hexadecimalKey = keyToHexadecimal(generatedKey);
      customLogger(`Hexadecimal key : ${hexadecimalKey}`);
      setAesKey(generatedKey);
      setAesKeyHex(hexadecimalKey);
      setKeyNotGeneratedYetError("");
    },
    handleEncryptPlainText: () => {
      try {
        if (aesKey === undefined) {
          throw new Error(`Key has not been generated yet`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setKeyNotGeneratedYetError(errorMessage);
        console.error(err);
        return;
      }
      setKeyNotGeneratedYetError("");
      const plainTextBlock = stringToBlocks(plainText);
      customLogger(`Plain text block : ${plainTextBlock}`);
      const encryptedTextBlocks = encryptBlock(plainTextBlock, aesKey);
      customLogger(`Encrypted text block : ${encryptedTextBlocks}`);
      const encryptedTextString = blocksToString(encryptedTextBlocks);
      customLogger(`Encrypted text string : ${encryptedTextString}`);
      setEncryptedPlainText(encryptedTextString);
      customLogger(
        `Encrypted text block (reconverted) : ${
          blocksToString(
            encryptedTextBlocks,
          )
        }`,
      );
    },
    handleDecryptEncryptedText: () => {
      try {
        if (aesKey === undefined) {
          throw new Error(`Key has not been generated yet`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setKeyNotGeneratedYetError(errorMessage);
        console.error(err);
        return;
      }
      setKeyNotGeneratedYetError("");
      const hexAesKey = hexBytesToStringHexBytes(aesKeyHexInputBytes);
      customLogger(`AES key hex string : ${hexAesKey}`);
      const validAesKey = hexadecimalToKey(hexAesKey);
      customLogger(`AES key Uint8Array : ${validAesKey}`);
      const encryptedTextBlocks = stringToBlocks(encryptedPlainText);
      customLogger(`Encrypted text block : ${encryptedTextBlocks}`);
      const decryptedTextBlocks = decryptBlock(
        encryptedTextBlocks,
        validAesKey,
      );
      customLogger(`Decrypted text block : ${decryptedTextBlocks}`);
      const decryptedTextString = blocksToString(decryptedTextBlocks);
      customLogger(`Decrypted text string : ${decryptedTextString}`);
      setDecryptedText(decryptedTextString);
    },
  };

  const helper = {
    handleByteChange: (index: number, value: string) => {
      setAesKeyHexInputBytes((prev) => {
        const newBytes = [...prev];
        newBytes[index] = value;
        return newBytes;
      });
    },
    handlePasteFromGeneratedKey: () => {
      const bytes = [];
      for (let i = 0; i < AES_KEY_SIZE_BYTES; i++) {
        bytes.push(getNthByteFromHexKey(aesKeyHex, i));
      }
      setAesKeyHexInputBytes(bytes);
    },
    handlePasteFromEncryptedText: () => {
      setEncryptedPlainTextInput("");
      setEncryptedPlainTextInput(encryptedPlainText);
    },
  };

  return (
    <main className="bg-black min-h-screen p-8 flex flex-col gap-8">
      <Header>Strengthened AES via S-Box Modification</Header>

      <section className="flex flex-col gap-4 items-center">
        <button
          onClick={aes.handleGenerateAesKey}
          type="button"
          className="h-max self-center rounded-2xl p-2 md:p-4 bg-white hover:bg-gray-500 hover:text-white active:bg-amber-300 active:text-black"
        >
          Generate key
        </button>
        <p className="text-white font-bold">{`AES-128 Key : `}</p>
        <div
          className={`border-2 border-white ${
            aesKey ? "bg-black" : "bg-yellow-800"
          } rounded-2xl max-w-7/8 p-2`}
        >
          <p
            className={`text-white break-all text-center ${
              aesKey ? "" : "font-bold"
            }`}
          >
            {aesKey ? aesKeyHex : "AES-key not generated yet"}
          </p>
        </div>
      </section>
      {keyNotGeneratedYetError
        ? (
          <section className="self-center">
            <div className="border-2 border-white w-max p-2 bg-red-800">
              <p className="text-white text-xs">{keyNotGeneratedYetError}</p>
            </div>
          </section>
        )
        : (
          ""
        )}
      <section className="min-h-32 p-4 gap-8 flex md:flex-row flex-col ">
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex-1">
            <h2 className="text-white text-center font-bold text-xl">
              Plain text
            </h2>
          </div>
          <form action="" className="flex-99">
            <textarea
              onChange={(e) => setPlainText(e.currentTarget.value)}
              value={plainText}
              className="text-white border-white overflow-y-scroll p-2 text-sm resize-none border-5 rounded-2xl w-full h-full"
            >
            </textarea>
          </form>
        </div>
        <button
          type="button"
          onClick={aes.handleEncryptPlainText}
          className="h-max self-center rounded-2xl p-2 bg-white hover:bg-gray-500 hover:text-white active:bg-amber-300 active:text-black"
        >
          Encrypt
        </button>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex-1">
            <h2 className="text-white text-center font-bold text-xl">
              Encrypted text
            </h2>
          </div>
          <form action="" className="flex-99">
            <textarea
              disabled
              value={encryptedPlainText}
              className="text-white border-white overflow-y-scroll p-2 text-sm resize-none border-5 rounded-2xl w-full h-full"
            >
            </textarea>
          </form>
        </div>
      </section>
      <section className="self-center flex flex-col gap-1 items-center w-full">
        <h2 className="text-white text-center font-bold text-xl">
          Enter an AES key
        </h2>
        <div className="flex w-full items-center gap-0.5 flex-wrap justify-center">
          {aesKeyHexInputBytes.map((byte, index) => (
            <React.Fragment key={index}>
              <input
                onChange={(e) =>
                  helper.handleByteChange(index, e.currentTarget.value)}
                value={byte}
                maxLength={2}
                className="text-white text-center border-white py-2 text-xs border w-6"
              />
              {index < 15 && <p className="text-white text-2xl">:</p>}
            </React.Fragment>
          ))}
        </div>
        <button
          type="button"
          onClick={helper.handlePasteFromGeneratedKey}
          className="h-max self-center rounded-2xl p-2 bg-gray-500 text-white hover:bg-gray-400 active:bg-amber-300 active:text-black"
        >
          Paste from generated key
        </button>
      </section>
      <section className="min-h-32 p-4 gap-8 flex md:flex-row flex-col ">
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex-1">
            <h2 className="text-white text-center font-bold text-xl">
              Enter an encrypted text
            </h2>
          </div>
          <form action="" className="flex-99">
            <textarea
              onChange={(e) =>
                setEncryptedPlainTextInput(e.currentTarget.value)}
              value={encryptedPlainTextInput}
              className="text-white border-white overflow-y-scroll p-2 text-sm resize-none border-5 rounded-2xl w-full h-full"
            >
            </textarea>
          </form>
          <button
            type="button"
            onClick={helper.handlePasteFromEncryptedText}
            className="h-max self-center rounded-2xl p-2 bg-gray-500 text-white hover:bg-gray-400 active:bg-amber-300 active:text-black"
          >
            Paste from encrypted text
          </button>
        </div>
        <button
          type="button"
          onClick={aes.handleDecryptEncryptedText}
          className="h-max self-center rounded-2xl p-2 bg-white hover:bg-gray-500 hover:text-white active:bg-amber-300 active:text-black"
        >
          Decrypt
        </button>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex-1">
            <h2 className="text-white text-center font-bold text-xl">
              Decrypted text
            </h2>
          </div>
          <form action="" className="flex-99">
            <textarea
              disabled
              value={decryptedText}
              className="text-white border-white overflow-y-scroll p-2 text-sm resize-none border-5 rounded-2xl w-full h-full"
            >
            </textarea>
          </form>
        </div>
      </section>
    </main>
  );
}

export default App;
