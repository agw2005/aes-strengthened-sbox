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
import { SBOX_TYPE } from "./math/aesHelper.ts";

function App() {
  const [generatedAESKey, setGeneratedAESKey] = useState<Uint8Array>();
  const [generatedAESKeyInHexadecimal, setGeneratedAESKeyInHexadecimal] =
    useState<string>("");
  const [inputPlainText, setInputPlainText] = useState<string>("");
  const [inputAESKeyInHexadecimal, setInputAESKeyInHexadecimal] = useState<
    string[]
  >(Array(16).fill(""));

  const [outputEncryptedText, setOutputEncryptedText] = useState<string>("");
  const [inputEncryptedText, setInputEncryptedText] = useState<string>("");
  const [outputDecryptedText, setOutputDecryptedText] = useState<string>("");
  const [keyNotGeneratedYetError, setKeyNotGeneratedYetError] = useState<
    string
  >("");

  const aes = {
    handleGenerateAesKey: () => {
      const generatedKey = generateAes128Key();
      const hexadecimalKey = keyToHexadecimal(generatedKey);
      setGeneratedAESKey(generatedKey);
      setGeneratedAESKeyInHexadecimal(hexadecimalKey);
      setKeyNotGeneratedYetError("");
    },
    handleEncryptPlainText: () => {
      try {
        if (generatedAESKey === undefined) {
          throw new Error(`Key has not been generated yet`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setKeyNotGeneratedYetError(errorMessage);
        console.error(err);
        return;
      }
      setKeyNotGeneratedYetError("");
      const plainTextString = inputPlainText;
      const plainTextBlocks = stringToBlocks(plainTextString);
      const encryptedTextBlocks = encryptBlock(
        plainTextBlocks,
        generatedAESKey,
        SBOX_TYPE.Original,
      );
      const encryptedTextString = blocksToString(encryptedTextBlocks);
      setOutputEncryptedText(encryptedTextString);
    },
    handleDecryptEncryptedText: () => {
      try {
        if (generatedAESKey === undefined) {
          throw new Error(`Key has not been generated yet`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setKeyNotGeneratedYetError(errorMessage);
        console.error(err);
        return;
      }
      setKeyNotGeneratedYetError("");
      const inputAESKeyInHexadecimalToString = hexBytesToStringHexBytes(
        inputAESKeyInHexadecimal,
      );
      const inputAESKey = hexadecimalToKey(inputAESKeyInHexadecimalToString);

      const encryptedTextString = outputEncryptedText;
      const encryptedTextBlocks = stringToBlocks(encryptedTextString);
      const decryptedTextBlocks = decryptBlock(
        encryptedTextBlocks,
        inputAESKey,
        SBOX_TYPE.Original,
      );
      const decryptedTextString = blocksToString(decryptedTextBlocks);
      setOutputDecryptedText(decryptedTextString);
    },
  };

  const helper = {
    handleByteChange: (index: number, value: string) => {
      setInputAESKeyInHexadecimal((prev) => {
        const newBytes = [...prev];
        newBytes[index] = value;
        return newBytes;
      });
    },
    handlePasteFromGeneratedKey: () => {
      const bytes = [];
      for (let i = 0; i < AES_KEY_SIZE_BYTES; i++) {
        bytes.push(getNthByteFromHexKey(generatedAESKeyInHexadecimal, i));
      }
      setInputAESKeyInHexadecimal(bytes);
    },
    handlePasteFromEncryptedText: () => {
      setInputEncryptedText("");
      setInputEncryptedText(outputEncryptedText);
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
        setInputAESKeyInHexadecimal(bytes);
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
            generatedAESKey ? "bg-black" : "bg-yellow-800"
          } rounded-2xl max-w-7/8 p-2`}
        >
          <p
            className={`text-white break-all text-center ${
              generatedAESKey ? "" : "font-bold"
            }`}
          >
            {generatedAESKey
              ? generatedAESKeyInHexadecimal
              : "AES-key not generated yet"}
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
              onChange={(e) => setInputPlainText(e.currentTarget.value)}
              value={inputPlainText}
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
              value={outputEncryptedText}
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
          {inputAESKeyInHexadecimal.map((byte, index) => (
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
              onChange={(e) => setInputEncryptedText(e.currentTarget.value)}
              value={inputEncryptedText}
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
              value={outputDecryptedText}
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
