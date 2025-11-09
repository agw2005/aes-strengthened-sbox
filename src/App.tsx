import { useState } from "react";
import Header from "./components/Header.tsx";
import {
  blocksToString,
  encryptBlock,
  generateAes128Key,
  stringToBlocks,
} from "./math/aes128.ts";

function App() {
  const [aesKey, setAesKey] = useState<Uint8Array>();
  const [plainText, setPlainText] = useState<string>("");
  const [encryptedPlainText, setEncryptedPlainText] = useState<string>("");
  const [keyNotGeneratedYetError, setKeyNotGeneratedYetError] = useState<
    string
  >("");

  const handleGenerateAesKey = () => {
    const generatedKey = generateAes128Key();
    setAesKey(generatedKey);
    setKeyNotGeneratedYetError("");
  };

  const handleEncryptPlainText = () => {
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
    const encryptedTextBlock = encryptBlock(plainTextBlock, aesKey);
    const encryptedTextString = blocksToString(encryptedTextBlock);
    setEncryptedPlainText(encryptedTextString);
  };

  return (
    <main className="bg-black min-h-screen p-8 flex flex-col gap-8">
      <Header>Strengthened AES via S-Box Modification</Header>

      <section className="flex flex-col gap-4 items-center">
        <button
          onClick={handleGenerateAesKey}
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
            {aesKey ? aesKey : "AES-key not generated yet"}
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
          onClick={handleEncryptPlainText}
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
    </main>
  );
}

export default App;
