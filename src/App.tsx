import { useState } from "react";
import Header from "./components/Header.tsx";
import { generateAes128Key } from "./math/aes128.ts";

function App() {
  const [plainText, setPlainText] = useState("");
  const [aesKey, setAesKey] = useState<Uint8Array>();

  const handleGenerateAesKey = () => {
    setAesKey(generateAes128Key());
  };

  return (
    <main className="bg-black h-max min-h-screen p-8 flex flex-col gap-8">
      <Header>Strengthened AES via S-Box Modification</Header>

      <section className="flex flex-col gap-4 items-center">
        <button
          onClick={handleGenerateAesKey}
          type="button"
          className="bg-white hover:bg-gray-500 hover:text-white p-4"
        >
          Generate
        </button>
        <p className="text-white">{`AES Key : ${aesKey ? "" : "N/A"}`}</p>
        {aesKey
          ? (
            <div className="border-2 border-white w-1/2 p-2">
              <p className="text-white break-all text-center">{aesKey}</p>
            </div>
          )
          : (
            ""
          )}
      </section>
      <section className="h-64 p-4 gap-8 flex">
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
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex-1">
            <h2 className="text-white text-center font-bold text-xl">
              Encrypted text
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
      </section>
    </main>
  );
}

export default App;
