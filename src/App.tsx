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
import { flattenBlocks, splitIntoBlocks } from "./math/aesHelper.ts";
import { base64ToUint8Array, uint8ArrayToBase64 } from "./helper/base64.ts";

function App() {
  const [aesKey, setAesKey] = useState<Uint8Array>();
  const [aesKeyHex, setAesKeyHex] = useState<string>("");
  const [plainText, setPlainText] = useState<string>("");
  const [aesKeyHexInputBytes, setAesKeyHexInputBytes] = useState<string[]>(
    Array(16).fill(""),
  );

  const [encryptedPlainTextBase64, setEncryptedPlainTextBase64] = useState<
    string
  >(
    "",
  );
  const [encryptedPlainTextInput, setEncryptedPlainTextInput] = useState<
    string
  >("");
  const [decryptedTextBase64, setDecryptedText] = useState<string>("");
  const [keyNotGeneratedYetError, setKeyNotGeneratedYetError] = useState<
    string
  >("");

  const aes = {
    handleGenerateAesKey: () => {
      const generatedKey = generateAes128Key();
      const hexadecimalKey = keyToHexadecimal(generatedKey);
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
      const encryptedTextBlocks = encryptBlock(plainTextBlock, aesKey);
      const encryptedTextBlock = flattenBlocks(encryptedTextBlocks);
      const encryptedBase64 = uint8ArrayToBase64(encryptedTextBlock);
      setEncryptedPlainTextBase64(encryptedBase64);
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
      const validAesKey = hexadecimalToKey(hexAesKey);
      const encryptedTextBlock = base64ToUint8Array(encryptedPlainTextInput);
      const encryptedTextBlocks = splitIntoBlocks(encryptedTextBlock);
      const decryptedTextBlocks = decryptBlock(
        encryptedTextBlocks,
        validAesKey,
      );
      const decryptedTextStringBase64 = blocksToString(decryptedTextBlocks);
      setDecryptedText(decryptedTextStringBase64);
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
      setEncryptedPlainTextInput(encryptedPlainTextBase64);
    },
    handlePasteAESKeyFromClipboard: async () => {
      try {
        const text = await navigator.clipboard.readText();

        // ChatGPT: Remove spaces, colons, etc.
        const cleanText = text.replace(/[^0-9a-fA-F]/g, "");

        if (cleanText.length !== AES_KEY_SIZE_BYTES * 2) {
          alert(
            "Invalid AES key length in clipboard. Must be 32 hex characters.",
          );
          return;
        }

        const bytes = [];
        for (let i = 0; i < AES_KEY_SIZE_BYTES; i++) {
          bytes.push(cleanText.slice(i * 2, i * 2 + 2));
        }
        setAesKeyHexInputBytes(bytes);
      } catch (err) {
        console.error("Clipboard paste failed:", err);
      }
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
      <section className="min-h-32 md:min-h-96 p-4 gap-8 flex md:flex-row flex-col ">
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
              value={encryptedPlainTextBase64}
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
        <button
          type="button"
          onClick={helper.handlePasteAESKeyFromClipboard}
          className="h-max self-center rounded-2xl p-2 bg-gray-500 text-white hover:bg-gray-400 active:bg-amber-300 active:text-black"
        >
          Paste from clipboard
        </button>
      </section>
      <section className="min-h-32 md:min-h-96 p-4 gap-8 flex md:flex-row flex-col ">
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
              value={decryptedTextBase64}
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
