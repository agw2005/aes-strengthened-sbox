import { useState } from "react";
import Header from "./components/Header.tsx";
import { generateAesKey } from "./math/aes.ts";

function App() {
  const [plainText, setPlainText] = useState("");
  const [randomNumber, setRandomNumber] = useState<Uint8Array>();

  const handleGenerateNumber = () => {
    setRandomNumber(generateAesKey());
  };

  return (
    <main className="bg-black p-8 h-screen flex flex-col gap-8">
      <Header>Strengthened AES via S-Box Modification</Header>

      <section className="flex flex-col gap-4 items-center">
        <button
          onClick={handleGenerateNumber}
          type="button"
          className="bg-white hover:bg-gray-500 hover:text-white p-4"
        >
          Generate
        </button>
        <p className="text-white">{randomNumber}</p>
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
