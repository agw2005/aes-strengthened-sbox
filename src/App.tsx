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
import { SBOX_TYPE, type SBoxType } from "./math/aesHelper.ts";

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

  const [inputSelectedSBoxType, setInputSelectedSBoxType] = useState<SBoxType>(
    SBOX_TYPE.Original,
  );

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
        inputSelectedSBoxType,
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

      const encryptedTextString = inputEncryptedText;
      const encryptedTextBlocks = stringToBlocks(encryptedTextString);
      const decryptedTextBlocks = decryptBlock(
        encryptedTextBlocks,
        inputAESKey,
        inputSelectedSBoxType,
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
    <main className="bg-pastel-purple min-h-screen p-8 flex flex-col gap-8">
      <Header>Strengthened AES via S-Box Modification</Header>
      <section className="md:w-1/2 self-center flex flex-col gap-4 m-0">
        <hr className="text-pastel-pink mb-2" />
        <p className="text-pastel-green text-center text-sm font-bold filter drop-shadow">
          This web app is an implementation of the research article,{" "}
          <strong>
            AES S-box modification uses affine matrices exploration for
            increased S-box strength,{` `}
          </strong>
          that aims to strengthen the AES algorithm by forming an inverse
          multiplicative matrix, exploring affine matrices, and using a constant
          in the affine transformation in order to gather candidate S-boxes. The
          modified S-Boxes are K4, K44, K81, K111, and K128. This implementation
          uses a simple AES backend, written manually in TypeScript. Though it
          is not production ready, It can handle basic encryption and decryption
          with both the standard &amp; modified S-Boxes. Thus, sufficient for
          implementing the idea of the research article.
        </p>
        <hr className="text-pastel-pink mt-2" />
      </section>
      <section className="flex flex-col gap-4 items-center">
        <button
          onClick={aes.handleGenerateAesKey}
          type="button"
          className="h-max self-center rounded-2xl font-bold filter drop-shadow p-2 md:p-4 bg-pastel-yellow hover:bg-pastel-pink hover:text-black active:bg-pastel-green active:text-black"
        >
          Generate key
        </button>
        <h2 className="text-pastel-green text-2xl font-bold filter drop-shadow">
          {`AES-128 Key : `}
        </h2>
        <div
          className={`border-2 border-pastel-green filter drop-shadow ${
            generatedAESKey ? "bg-pastel-pink" : "bg-pastel-pink"
          } rounded-2xl max-w-7/8 p-2`}
        >
          <p
            className={`text-black font-bold break-all text-center ${
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
      <hr className="text-pastel-pink md:self-center" />
      <section className="flex flex-col gap-2">
        <h2 className="text-pastel-green text-center font-bold text-2xl filter drop-shadow">
          S-Box Type :
        </h2>
        <div className="flex justify-center gap-4 flex-wrap">
          {Object.values(SBOX_TYPE).map((SboxTypes) => {
            return (
              <button
                key={SboxTypes}
                onClick={() => setInputSelectedSBoxType(SboxTypes)}
                type="button"
                className={`h-max min-w-20 self-center rounded-2xl filter drop-shadow text-sm font-bold p-2 md:p-2 ${
                  SboxTypes === inputSelectedSBoxType
                    ? "bg-pastel-pink hover:bg-pastel-green active:bg-pastel-yellow"
                    : "bg-pastel-yellow hover:bg-pastel-pink active:bg-pastel-green"
                }`}
              >
                {SboxTypes}
              </button>
            );
          })}
        </div>
      </section>
      <section className="flex justify-center">
        <div className="border-2 border-pastel-green w-3/4 md:w-max p-2 bg-red-800 text-center">
          <p className="text-white text-xs break-all">
            Unfortunately, for now, the S-Box for K128 will not decrypt
            properly.
          </p>
        </div>
      </section>
      <hr className="text-pastel-pink" />
      <section className="min-h-32 md:min-h-96 p-4 gap-8 flex md:flex-row flex-col ">
        <div className="md:flex-1 h-64 flex flex-col gap-2">
          <h2 className="text-pastel-green text-center font-bold text-2xl filter drop-shadow">
            Plain text
          </h2>
          <div className="h-full">
            <textarea
              onChange={(e) => setInputPlainText(e.currentTarget.value)}
              value={inputPlainText}
              className="text-black bg-pastel-yellow rounded-2xl font-semibold overflow-y-scroll p-2 text-xs resize-none outline-0 w-full h-full scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-pastel-purple filter drop-shadow"
            >
            </textarea>
          </div>
        </div>
        <button
          type="button"
          onClick={aes.handleEncryptPlainText}
          className="text-sm font-bold h-max self-center md:relative md:bottom-9 rounded-2xl p-2 bg-pastel-yellow hover:bg-pastel-pink active:bg-pastel-green"
        >
          Encrypt
        </button>
        <div className="md:flex-1 h-64 flex flex-col gap-2">
          <div className="flex-1">
            <h2 className="text-pastel-green text-center font-bold text-2xl filter drop-shadow">
              Encrypted text
            </h2>
          </div>
          <form action="" className="flex-99">
            <textarea
              disabled
              value={outputEncryptedText}
              className="text-black bg-pastel-yellow rounded-2xl font-semibold overflow-y-scroll p-2 text-xs resize-none outline-0 w-full h-full scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-pastel-purple filter drop-shadow"
            >
            </textarea>
          </form>
        </div>
      </section>
      <hr className="text-pastel-pink" />
      <section className="self-center flex flex-col gap-4 items-center w-full">
        <h2 className="text-pastel-green text-center font-bold text-2xl drop-shadow">
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
                className="outline-0 font-bold text-center bg-pastel-yellow py-2 text-xs w-6"
              />
              {index < 15 && (
                <p className="text-pastel-pink text-2xl font-bold">:</p>
              )}
            </React.Fragment>
          ))}
        </div>
        <button
          type="button"
          onClick={helper.handlePasteFromGeneratedKey}
          className="h-max font-bold self-center rounded-2xl p-2 bg-pastel-yellow hover:bg-pastel-pink active:bg-pastel-green"
        >
          Paste from generated key
        </button>
        <button
          type="button"
          onClick={helper.handlePasteAESKeyFromClipboard}
          className="h-max font-bold self-center rounded-2xl p-2 bg-pastel-yellow hover:bg-pastel-pink active:bg-pastel-green"
        >
          Paste from clipboard
        </button>
      </section>
      <hr className="text-pastel-pink" />
      <section className="min-h-32 md:min-h-96 p-4 gap-8 flex md:flex-row flex-col ">
        <div className="md:flex-1 h-64 flex flex-col gap-2">
          <h2 className="text-pastel-green text-center font-bold text-2xl filter drop-shadow">
            Enter an encrypted text
          </h2>
          <div className="h-full">
            <textarea
              onChange={(e) => setInputEncryptedText(e.currentTarget.value)}
              value={inputEncryptedText}
              className="text-black bg-pastel-yellow rounded-2xl font-semibold overflow-y-scroll p-2 text-xs resize-none outline-0 w-full h-full scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-pastel-purple filter drop-shadow"
            >
            </textarea>
          </div>
          <button
            type="button"
            onClick={helper.handlePasteFromEncryptedText}
            className="font-bold h-max self-center rounded-2xl p-2 bg-pastel-yellow hover:bg-pastel-pink active:bg-pastel-green"
          >
            Paste from encrypted text
          </button>
        </div>
        <button
          type="button"
          onClick={aes.handleDecryptEncryptedText}
          className="font-bold h-max self-center rounded-2xl p-2 md:relative md:bottom-9 bg-pastel-yellow hover:bg-pastel-pink active:bg-pastel-green"
        >
          Decrypt
        </button>
        <div className="md:flex-1 h-64 flex flex-col gap-2">
          <div className="flex-1">
            <h2 className="text-pastel-green text-center font-bold text-2xl drop-shadow">
              Decrypted text
            </h2>
          </div>
          <form action="" className="flex-99">
            <textarea
              disabled
              value={outputDecryptedText}
              className="text-black bg-pastel-yellow rounded-2xl font-semibold overflow-y-scroll p-2 text-xs resize-none outline-0 w-full h-full scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-pastel-purple filter drop-shadow"
            >
            </textarea>
          </form>
        </div>
      </section>
    </main>
  );
}

export default App;
